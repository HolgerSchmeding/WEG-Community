
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { type User, type Role, roleLabels } from "@/app/admin/users/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";


const userSchema = z.object({
  id: z.string().optional(),
  salutation: z.enum(["Herr", "Frau", "Divers"]),
  firstName: z.string().min(1, "Vorname ist ein Pflichtfeld"),
  lastName: z.string().min(1, "Nachname ist ein Pflichtfeld"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  roles: z.array(z.enum(["admin", "resident", "owner", "board"])).default([]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserEditDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  onSave: (data: UserFormData) => void;
}

export function UserEditDialog({
  isOpen,
  onOpenChange,
  user,
  onSave,
}: UserEditDialogProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      salutation: "Frau",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roles: [],
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset(user);
      } else {
        form.reset({
          salutation: "Frau",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          roles: [],
        });
      }
    }
  }, [isOpen, user, form]);

  const onSubmit = (data: UserFormData) => {
    onSave(data);
  };
  
  const isNewUser = !user;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="font-headline">
                {isNewUser ? "Neuen Benutzer anlegen" : "Benutzer bearbeiten"}
              </DialogTitle>
              <DialogDescription>
                Füllen Sie die Felder aus, um einen Benutzer anzulegen oder zu
                aktualisieren.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="salutation" className="text-right">
                  Anrede
                </Label>
                <Controller
                  name="salutation"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="salutation" className="col-span-3">
                        <SelectValue placeholder="Anrede auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frau">Frau</SelectItem>
                        <SelectItem value="Herr">Herr</SelectItem>
                        <SelectItem value="Divers">Divers</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  Vorname
                </Label>
                <Input id="firstName" {...form.register("firstName")} className="col-span-3" />
                {form.formState.errors.firstName && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.firstName.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Nachname
                </Label>
                <Input id="lastName" {...form.register("lastName")} className="col-span-3" />
                {form.formState.errors.lastName && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.lastName.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  E-Mail
                </Label>
                <Input id="email" type="email" {...form.register("email")} className="col-span-3" />
                {form.formState.errors.email && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.email.message}</p>}
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefon
                </Label>
                <Input id="phone" type="tel" {...form.register("phone")} className="col-span-3" placeholder="Optional"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4 pt-2">
                <Label className="text-right mt-2">
                  Rollen
                </Label>
                 <FormField
                    control={form.control}
                    name="roles"
                    render={() => (
                        <FormItem className="col-span-3 space-y-3">
                            {(Object.keys(roleLabels) as Role[]).map((role) => (
                                <FormField
                                    key={role}
                                    control={form.control}
                                    name="roles"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={role}
                                            className="flex flex-row items-center space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(role)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), role])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== role
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {roleLabels[role]}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </FormItem>
                    )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Speichern
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
