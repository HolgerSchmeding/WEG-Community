'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { runFlow } from '@genkit-ai/next/client';
import { summarizeDocument } from '@/ai/flows/document-summarization';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, FileText } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  document: z
    .string()
    .min(200, {
      message: 'Das Dokument muss mindestens 200 Zeichen lang sein.',
    })
    .max(15000, {
      message: 'Das Dokument darf maximal 15.000 Zeichen lang sein.',
    }),
});

interface DocumentSummarizerProps {
  documentText?: string;
}

export function DocumentSummarizer({
  documentText = '',
}: DocumentSummarizerProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: documentText,
    },
  });

  useEffect(() => {
    form.reset({ document: documentText });
  }, [documentText, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSummary('');

    try {
      // Simulate summary generation
      setTimeout(() => {
        setSummary(
          `Zusammenfassung des Dokuments:\n\nDies ist eine simulierte Zusammenfassung des eingereichten Dokuments. In einer vollständigen Implementierung würde hier die KI-basierte Zusammenfassung erscheinen.`
        );
        setLoading(false);
        toast({
          title: 'Zusammenfassung erstellt!',
          description: 'Die KI hat das Dokument erfolgreich zusammengefasst.',
        });
      }, 2000);
    } catch (error) {
      console.error('Summarization error:', error);
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description:
          'Die Zusammenfassung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dokument einfügen</CardTitle>
          <CardDescription>
            Kopieren Sie den Text eines Dokuments hier hinein, um eine
            automatische Zusammenfassung zu erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dokumenteninhalt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Fügen Sie hier den Text ein..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Zusammenfassen
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(loading || summary) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ihre Zusammenfassung
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
              </div>
            )}
            {summary && (
              <ScrollArea className="h-60">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {summary}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
