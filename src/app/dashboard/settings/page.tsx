import PageHeader from "@/components/page-header";

import {
  User,
  Palette,
  Bell,
  Accessibility,
  Shield,
  Languages,
  Info,
  BookOpen,
  Settings,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AccountSection from "@/components/settings/account-section";
import AppearanceSection from "@/components/settings/appearance-section";
import LearningSection from "@/components/settings/learing-section";

const sections = [
  {
    id: "account",
    title: "Account",
    icon: User,
    content: <AccountSection />,
    subtitle: "Gestisci le tue informazioni personali",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    subtitle: "Gestisci il look dell'applicazione",
    content: <AppearanceSection />,
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
  },
  {
    id: "accessibility",
    title: "Accessibility",
    icon: Accessibility,
  },
  {
    id: "learning",
    title: "Learning",
    icon: BookOpen,
    subtitle: "Configura la tua esperienza di gioco",
    content: <LearningSection />,
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: Shield,
  },
  {
    id: "language",
    title: "Language",
    icon: Languages,
  },
  {
    id: "about",
    title: "About",
    icon: Info,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        title="Impostazioni"
        subtitle="Gestisci il tuo account e le tue preferenze"
        icon={Settings}
      />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-6 h-fit">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <a href={`#${section.id}`}>
                      <section.icon className="size-4" />
                      {section.title}
                    </a>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card id={section.id} key={section.id}>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center gap-3">
                  <section.icon className="size-5" />

                  <div>
                    <h2 className="text-lg font-semibold">{section.title}</h2>

                    <p className="text-sm text-muted-foreground">
                      {section.subtitle}
                    </p>
                  </div>
                </div>

                <Separator />

                {section.content ? (
                  <div>{section.content}</div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                    Coming soon...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
