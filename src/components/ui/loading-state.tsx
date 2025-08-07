"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingType = 'spinner' | 'skeleton' | 'cards' | 'table' | 'list' | 'detail';
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingStateProps {
  type?: LoadingType;
  size?: LoadingSize;
  items?: number;
  title?: string;
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export function LoadingState({ 
  type = 'cards', 
  size = 'md',
  items = 6, 
  title, 
  text,
  className,
  fullScreen = false,
  overlay = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  };

  const containerClasses = cn(
    fullScreen && "min-h-screen w-full flex items-center justify-center",
    overlay && "absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center",
    className
  );

  // Spinner Loading
  if (type === 'spinner') {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
          {text && (
            <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Skeleton Loading (modern alternative)
  if (type === 'skeleton') {
    return (
      <div className={containerClasses}>
        <div className="w-full space-y-4 max-w-4xl">
          {title && <Skeleton className="h-8 w-48" />}
          <div className="space-y-3">
            {Array.from({ length: items || 3 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Table Loading
  if (type === 'table') {
    return (
      <div className={cn("space-y-4", containerClasses)}>
        {title && <Skeleton className="h-8 w-48" />}
        <div className="rounded-md border">
          <div className="border-b p-4">
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {Array.from({ length: items }).map((_, i) => (
            <div key={i} className="border-b p-4 last:border-b-0">
              <div className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-20" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // List Loading
  if (type === 'list') {
    return (
      <div className={cn("space-y-4", containerClasses)}>
        {title && <Skeleton className="h-8 w-48" />}
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detail Loading
  if (type === 'detail') {
    return (
      <div className={containerClasses}>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <div className="pt-4">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: Cards Loading
  return (
    <div className={cn("space-y-6", containerClasses)}>
      {title && <Skeleton className="h-8 w-48" />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: items }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Specialized Loading Components for common use cases
export function PageLoadingState({ text = "Seite wird geladen..." }: { text?: string }) {
  return (
    <LoadingState 
      type="spinner" 
      size="lg" 
      text={text}
      fullScreen 
    />
  );
}

export function ComponentLoadingState({ text }: { text?: string }) {
  return (
    <LoadingState 
      type="spinner" 
      size="md" 
      text={text}
      className="py-8"
    />
  );
}

export function ButtonLoadingState({ size = 'sm' }: { size?: LoadingSize }) {
  return <Loader2 className={cn("animate-spin", 
    size === 'sm' ? 'h-4 w-4' : 
    size === 'md' ? 'h-5 w-5' :
    size === 'lg' ? 'h-6 w-6' : 'h-8 w-8'
  )} />;
}
