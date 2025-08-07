"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  text?: string;
  href?: string; // Expliziter Link statt browser.back()
  variant?: "ghost" | "outline" | "default";
}

export function BackButton({ 
  text = "Zurück", 
  href,
  variant = "ghost" 
}: BackButtonProps) {
  const router = useRouter();

  // Wenn ein expliziter href angegeben ist, verwende Link
  if (href) {
    return (
      <Button
        variant={variant}
        asChild
        className="pl-0"
      >
        <Link href={href}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {text}
        </Link>
      </Button>
    );
  }

  // Andernfalls verwende Browser-Back (für bessere UX)
  return (
    <Button
      variant={variant}
      onClick={() => router.back()}
      className="pl-0"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}
