
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { runFlow } from "@genkit-ai/next/client";
import type { Message } from "genkit";
import { chatWithBoardAssistant } from "@/ai/flows/board-assistant-flow";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendHorizonal, Bot, User, Loader2 } from "lucide-react";

const formSchema = z.object({
  message: z.string().min(1, "Die Nachricht darf nicht leer sein."),
});

export function BoardAssistantChat() {
  const { toast } = useToast();
  const [history, setHistory] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, 100);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: [{ text: values.message }] };
    setHistory(prev => [...prev, userMessage]);
    scrollToBottom();
    form.reset();

    try {
      const { answer } = await runFlow(chatWithBoardAssistant, {
        history: [...history, userMessage],
        newMessage: values.message,
      });

      const modelMessage: Message = { role: "model", content: [{ text: answer }] };
      setHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Der Assistent konnte nicht antworten. Bitte versuchen Sie es erneut.",
      });
       const errorMessage: Message = { role: "model", content: [{ text: "Es ist ein Fehler aufgetreten." }] };
       setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot />
            KI-Assistent für den Beirat
        </CardTitle>
        <CardDescription>
            Stellen Sie Fragen zum Wohnungseigentumsgesetz (WEG).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[500px] pr-4" ref={scrollAreaRef as any}>
            <div className="space-y-4">
            {history.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "model" && (
                    <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("p-3 rounded-lg max-w-xs", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content[0].text}</p>
                </div>
                {msg.role === "user" && (
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
             {history.length === 0 && !isLoading && (
                 <div className="text-center text-sm text-muted-foreground p-8">
                     <p>Geben Sie Ihre Frage unten ein, um den Chat zu starten.</p>
                 </div>
             )}
            </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Ihre Frage..."
                        autoComplete="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
