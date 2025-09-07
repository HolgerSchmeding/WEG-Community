import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues?: Partial<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  resetOnSubmit?: boolean;
}

export interface UseFormValidationReturn<T> {
  values: Partial<T>;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, message: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  validate: (showErrors?: boolean) => boolean;
  validateField: (field: keyof T) => boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldError: (field: keyof T) => string | undefined;
  hasFieldError: (field: keyof T) => boolean;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialValues = {},
  onSubmit,
  resetOnSubmit = false,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Einzelnen Wert setzen
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);

    // Fehler für dieses Feld löschen wenn Wert geändert wird
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  // Mehrere Werte setzen
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({
      ...prev,
      ...newValues,
    }));
    setIsDirty(true);
  }, []);

  // Fehler für ein Feld setzen
  const setError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => {
      const filtered = prev.filter(error => error.field !== field);
      return [...filtered, { field: field as string, message }];
    });
  }, []);

  // Fehler für ein Feld löschen
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  // Alle Fehler löschen
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Einzelnes Feld validieren
  const validateField = useCallback(
    (field: keyof T): boolean => {
      try {
        // Vollständige Validierung durchführen und nur Fehler für dieses Feld betrachten
        schema.parse(values);
        clearError(field);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(
            err => err.path.length > 0 && err.path[0] === field
          );
          if (fieldError) {
            setError(field, fieldError.message);
            return false;
          } else {
            // Kein Fehler für dieses spezifische Feld
            clearError(field);
            return true;
          }
        }
        return false;
      }
    },
    [values, schema, setError, clearError]
  );

  // Gesamtes Formular validieren
  const validate = useCallback(
    (showErrors: boolean = true): boolean => {
      try {
        schema.parse(values);
        if (showErrors) {
          clearErrors();
        }
        return true;
      } catch (error) {
        if (error instanceof z.ZodError && showErrors) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          setErrors(validationErrors);
        }
        return false;
      }
    },
    [values, schema, clearErrors]
  );

  // Form Submit Handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!validate()) {
        return;
      }

      if (!onSubmit) {
        return;
      }

      setIsSubmitting(true);

      try {
        const validatedData = schema.parse(values) as T;
        await onSubmit(validatedData);

        if (resetOnSubmit) {
          setValuesState(initialValues);
          setIsDirty(false);
          clearErrors();
        }
      } catch (error) {
        console.error('Form submission error:', error);
        // Hier könnten zusätzliche Error-Handling-Logiken stehen
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validate,
      onSubmit,
      schema,
      values,
      resetOnSubmit,
      initialValues,
      clearErrors,
    ]
  );

  // Formular zurücksetzen
  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors([]);
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Hilfsfunktionen für Fehler
  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      return errors.find(error => error.field === field)?.message;
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (field: keyof T): boolean => {
      return errors.some(error => error.field === field);
    },
    [errors]
  );

  const isValid = errors.length === 0 && Object.keys(values).length > 0;

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    validate,
    validateField,
    handleSubmit,
    reset,
    getFieldError,
    hasFieldError,
  };
}

// Hilfsfunktionen für gemeinsame Validierungs-Schemas
export const validationSchemas = {
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  phone: z
    .string()
    .regex(
      /^(\+49|0)[1-9]\d{8,11}$/,
      'Gültige deutsche Telefonnummer erforderlich'
    ),
  required: (message: string = 'Dieses Feld ist erforderlich') =>
    z.string().min(1, message),
  minLength: (min: number, message?: string) =>
    z.string().min(min, message || `Mindestens ${min} Zeichen erforderlich`),
  maxLength: (max: number, message?: string) =>
    z.string().max(max, message || `Maximal ${max} Zeichen erlaubt`),
  fileSize: (maxSizeInMB: number) =>
    z
      .instanceof(File)
      .refine(
        file => file.size <= maxSizeInMB * 1024 * 1024,
        `Datei darf maximal ${maxSizeInMB}MB groß sein`
      ),
  fileType: (allowedTypes: string[]) =>
    z
      .instanceof(File)
      .refine(
        file => allowedTypes.includes(file.type),
        `Nur folgende Dateitypen erlaubt: ${allowedTypes.join(', ')}`
      ),
};
