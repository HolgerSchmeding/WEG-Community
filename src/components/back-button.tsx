"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  text?: string;
}

export function BackButton({ text }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="pl-0"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {text || "Zurück"}
    </Button>
  );
}
