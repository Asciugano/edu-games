"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const languages = [
  {
    code: "it",
    label: "Italiano",
    flag: "🇮🇹",
  },
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
  },
];

export function LanguageSection() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(newLocale: string) {
    router.replace(pathname, {
      locale: newLocale,
    });
  }

  return (
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Scegli la lingua dell&apos;applicazione.
      </p>

      <div className="flex flex-wrap gap-3">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={locale === language.code ? "default" : "outline"}
            onClick={() => changeLanguage(language.code)}
          >
            <span className="mr-2">{language.flag}</span>

            {language.label}
          </Button>
        ))}
      </div>
    </CardContent>
  );
}
