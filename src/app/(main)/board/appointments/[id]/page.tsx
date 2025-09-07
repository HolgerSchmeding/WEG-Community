'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { BackButton } from '@/components/back-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Save,
  Loader2,
  CalendarIcon,
  KeyRound,
  Users,
  UserCheck,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Role = 'owner' | 'resident' | 'board';

const roleLabels: Record<Role, string> = {
  owner: 'Eigentümer',
  resident: 'Bewohner',
  board: 'Beirat',
};

const appointmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Titel ist ein Pflichtfeld'),
  date: z.date({ required_error: 'Datum ist ein Pflichtfeld.' }),
  description: z.string().min(1, 'Beschreibung ist ein Pflichtfeld'),
  status: z.enum(['Entwurf', 'Anstehend']),
  visibility: z
    .array(z.string())
    .min(1, 'Mindestens eine Rolle muss ausgewählt sein.'),
  internalNotes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Mock data
const mockAppointments = [
  {
    id: '1',
    title: 'Ordentliche Eigentümerversammlung 2024',
    date: new Date(2024, 8, 15),
    status: 'Anstehend',
    visibility: ['owner', 'board'],
    description: 'Die jährliche Eigentümerversammlung findet statt.',
    internalNotes: 'Catering bei Meyer bestellen.',
  },
];

export default function AppointmentFormPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = params.id as string;
  const isNew = id === 'new';

  const [isLoading, setIsLoading] = React.useState(!isNew);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      // date: undefined, // Start with undefined date
      description: '',
      status: 'Entwurf',
      visibility: [],
      internalNotes: '',
    },
  });

  React.useEffect(() => {
    if (!isNew) {
      setIsLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        const appointment = mockAppointments.find(a => a.id === id);
        if (appointment) {
          form.reset({
            status: appointment.status as "Entwurf" | "Anstehend",
            title: appointment.title,
            date: appointment.date,
            description: appointment.description,
            visibility: appointment.visibility,
            id: appointment.id,
            internalNotes: appointment.internalNotes,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Fehler',
            description: 'Termin nicht gefunden.',
          });
          router.push('/board/appointments');
        }
        setIsLoading(false);
      }, 500);
    }
  }, [isNew, id, router, toast, form]);

  const onSubmit = (data: AppointmentFormData) => {
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: isNew ? 'Termin erstellt' : 'Änderungen gespeichert',
        description: `Der Termin "${data.title}" wurde erfolgreich gesichert.`,
      });
      router.push('/board/appointments');
    }, 1000);
  };

  const {
    formState: { isSubmitting },
  } = form;

  if (isLoading) {
    return (
      <div className="container py-8">
        <BackButton text="Zurück zur Übersicht" />
        <div className="max-w-3xl mx-auto mt-8">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <BackButton text="Zurück zur Übersicht" />

      <div className="max-w-3xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {isNew ? 'Neuen Termin erstellen' : 'Termin bearbeiten'}
            </CardTitle>
            <CardDescription>
              Füllen Sie die Felder aus, um den Termin zu erstellen oder zu
              aktualisieren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titel des Termins</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="z.B. Eigentümerversammlung"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Datum</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: de })
                              ) : (
                                <span>Datum auswählen</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={date => date < new Date('1900-01-01')}
                            initialFocus
                            locale={de}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Details zum Termin..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={() => (
                      <FormItem>
                        <FormLabel>Sichtbar für</FormLabel>
                        <div className="space-y-2 pt-2">
                          {(Object.keys(roleLabels) as Role[]).map(role => (
                            <FormField
                              key={role}
                              control={form.control}
                              name="visibility"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(role)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                role,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  value => value !== role
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {roleLabels[role]}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 pt-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Entwurf" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Entwurf
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Anstehend" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Veröffentlichen
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Interne Notizen (nicht öffentlich sichtbar)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="z.B. Aufgaben, Erinnerungen..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.back()}
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Speichern
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
