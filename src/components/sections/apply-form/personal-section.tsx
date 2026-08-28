"use client";

import { useController, type Control } from "react-hook-form";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { LeadInput } from "@/lib/validations/lead";
import type { Country } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { Field } from "./primitives";

export function PersonalSection({
  t,
  control,
  countries,
  locale,
}: {
  t: (key: string) => string;
  control: Control<LeadInput>;
  countries: Country[];
  locale: AppLocale;
}) {
  const firstName = useController({ control, name: "firstName" });
  const lastName = useController({ control, name: "lastName" });
  const email = useController({ control, name: "email" });
  const phone = useController({ control, name: "phone" });
  const whatsapp = useController({ control, name: "whatsapp" });
  const dateOfBirth = useController({ control, name: "dateOfBirth" });
  const gender = useController({ control, name: "gender" });
  const country = useController({ control, name: "country" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-headline-sm">
          <User className="h-5 w-5 text-primary" />
          {t("sectionPersonal")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="firstName"
            label={t("firstName")}
            error={firstName.fieldState.error?.message}
          >
            <Input
              id="firstName"
              autoComplete="given-name"
              aria-invalid={!!firstName.fieldState.error}
              value={firstName.field.value ?? ""}
              onChange={firstName.field.onChange}
            />
          </Field>
          <Field
            id="lastName"
            label={t("lastName")}
            error={lastName.fieldState.error?.message}
          >
            <Input
              id="lastName"
              autoComplete="family-name"
              aria-invalid={!!lastName.fieldState.error}
              value={lastName.field.value ?? ""}
              onChange={lastName.field.onChange}
            />
          </Field>
        </div>

        <Field
          id="email"
          label={t("email")}
          error={email.fieldState.error?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!email.fieldState.error}
            value={email.field.value ?? ""}
            onChange={email.field.onChange}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="phone"
            label={t("phone")}
            error={phone.fieldState.error?.message}
          >
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={!!phone.fieldState.error}
              value={phone.field.value ?? ""}
              onChange={phone.field.onChange}
            />
          </Field>
          <Field
            id="whatsapp"
            label={t("whatsapp")}
            error={whatsapp.fieldState.error?.message}
            hint={t("whatsappHint")}
          >
            <Input
              id="whatsapp"
              type="tel"
              autoComplete="tel"
              aria-invalid={!!whatsapp.fieldState.error}
              value={whatsapp.field.value ?? ""}
              onChange={whatsapp.field.onChange}
            />
          </Field>
        </div>

        <Field id="dateOfBirth" label={t("dateOfBirth")}>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth.field.value ?? ""}
            onChange={dateOfBirth.field.onChange}
          />
        </Field>

        <Field id="gender" label={t("gender")}>
          <Select
            value={gender.field.value || undefined}
            onValueChange={gender.field.onChange}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder={t("genderPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("genderMale")}</SelectItem>
              <SelectItem value="female">{t("genderFemale")}</SelectItem>
              <SelectItem value="other">{t("genderOther")}</SelectItem>
              <SelectItem value="prefer-not">{t("genderPreferNot")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          id="country"
          label={t("country")}
          error={country.fieldState.error?.message}
        >
          <Select
            value={country.field.value || undefined}
            onValueChange={country.field.onChange}
          >
            <SelectTrigger
              id="country"
              aria-invalid={!!country.fieldState.error}
            >
              <SelectValue placeholder={t("countryPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.flag} {c.name[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
    </Card>
  );
}
