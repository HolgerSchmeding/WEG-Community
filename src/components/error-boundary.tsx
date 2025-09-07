'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production könnte hier ein Error Reporting Service aufgerufen werden
    // Beispiel: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  // Hilfsmethode zur Erkennung von Firebase-Fehlern
  private isFirebaseError(error: Error): boolean {
    return (
      error.message.includes('Firebase') ||
      error.message.includes('Firestore') ||
      error.message.includes('auth/') ||
      error.message.includes('permission-denied') ||
      error.message.includes('network-request-failed')
    );
  }

  // Hilfsmethode für Firebase-spezifische Fehlermeldungen
  private getFirebaseErrorMessage(error: Error): string {
    if (error.message.includes('permission-denied')) {
      return 'Sie haben keine Berechtigung für diese Aktion. Bitte melden Sie sich an.';
    }
    if (error.message.includes('network-request-failed')) {
      return 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung.';
    }
    if (error.message.includes('auth/')) {
      return 'Authentifizierungsfehler: Bitte melden Sie sich erneut an.';
    }
    return 'Datenbankfehler: Bitte versuchen Sie es später erneut.';
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI wenn vorhanden
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Standard Fallback UI mit Firebase-Unterstützung
      const isFirebaseError =
        this.state.error && this.isFirebaseError(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isFirebaseError
                  ? 'Verbindungsproblem'
                  : 'Ups! Etwas ist schief gelaufen'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isFirebaseError && this.state.error
                  ? this.getFirebaseErrorMessage(this.state.error)
                  : 'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es erneut.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {this.props.showErrorDetails && this.state.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="mt-2">
                    <details className="cursor-pointer">
                      <summary className="font-medium mb-2">
                        Fehlerdetails (für Entwickler)
                      </summary>
                      <div className="text-sm font-mono bg-gray-100 p-3 rounded border overflow-auto">
                        <p className="font-bold">Fehlermeldung:</p>
                        <p className="mb-2">{this.state.error.message}</p>

                        <p className="font-bold">Stack Trace:</p>
                        <pre className="text-xs whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>

                        {this.state.errorInfo && (
                          <>
                            <p className="font-bold mt-2">Komponenten Stack:</p>
                            <pre className="text-xs whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </>
                        )}
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Erneut versuchen
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Seite neu laden
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Zur Startseite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-basierte Alternative für funktionale Komponenten
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);

    // Hier könnte auch Error Reporting stattfinden
    // Beispiel: reportError(error, errorInfo);
  };
}

// Wrapper für spezifische Bereiche
export function PageErrorBoundary({
  children,
  pageName,
}: {
  children: ReactNode;
  pageName?: string;
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(`Error in ${pageName || 'page'}:`, error, errorInfo);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
}

// Wrapper für Formulare
export function FormErrorBoundary({
  children,
  onError,
}: {
  children: ReactNode;
  onError?: (error: Error) => void;
}) {
  const fallback = (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Bei der Verarbeitung des Formulars ist ein Fehler aufgetreten. Bitte
        laden Sie die Seite neu und versuchen Sie es erneut.
      </AlertDescription>
    </Alert>
  );

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('Form error:', error, errorInfo);
    if (onError) {
      onError(error);
    }
  };

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={handleError}
      showErrorDetails={false}
    >
      {children}
    </ErrorBoundary>
  );
}
