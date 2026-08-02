import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Gamepad2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import LandingAnimations from "@/components/landing-animation";
import { games } from "@/types/games/games";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { GameHeader } from "@/components/game-header";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("landing");

  const features = [
    {
      icon: Zap,
      title: t("features.items.learn.title"),
      description: t("features.items.learn.description"),
    },
    {
      icon: Trophy,
      title: t("features.items.xp.title"),
      description: t("features.items.xp.description"),
    },
    {
      icon: Flame,
      title: t("features.items.streak.title"),
      description: t("features.items.streak.description"),
    },
  ];

  return (
    <>
      <LandingAnimations />

      <main className="min-h-screen overflow-hidden bg-background">
        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <section className="relative hero-section">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute right-[-150px] top-[250px] h-[350px] w-[350px] rounded-full bg-yellow-400/10 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
            {/* HERO CONTENT */}

            <div>
              <div className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
                <Sparkles className="size-4 text-yellow-500" />
                {t("hero.badge")}
              </div>

              <h1 className="hero-title max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                <span className="hero-title-line">{t("hero.title1")}</span>
                <br />
                <span className="hero-title-line text-primary">
                  {t("hero.title2")}
                </span>
                <br />
                <span className="hero-title-line">{t("hero.title3")}</span>
              </h1>

              <p className="hero-description mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {t("hero.description")}
              </p>

              <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/games"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {t("hero.primaryButton")}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 font-bold transition hover:bg-muted"
                >
                  {t("hero.secondaryButton")}
                </Link>
              </div>

              <div className="hero-benefits mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  {t("hero.benefits.free")}
                </div>

                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-4 text-primary" />
                  {t("hero.benefits.interactive")}
                </div>

                <div className="flex items-center gap-2">
                  <Trophy className="size-4 text-primary" />
                  {t("hero.benefits.progression")}
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="hero-visual relative mx-auto w-full max-w-xl">
              <div className="relative rotate-2 rounded-[2rem] border bg-card p-5 shadow-2xl">
                <GameHeader
                  xp={30}
                  currentRound={7}
                  totalRounds={10}
                  exercize="MATH_QUIZ"
                />

                <Card className="mx-auto max-w-4xl">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      {t("gamePreview.title")}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-10 pt-8">
                    {/* Domanda */}
                    <div className="space-y-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("gamePreview.question")}
                      </p>

                      <div
                        className="
    mx-auto flex h-32 max-w-md items-center justify-center
    rounded-2xl border
    from-primary/10 to-primary/5
    shadow-inner
    "
                      >
                        <p className="text-5xl font-black tracking-wider">
                          12 <span className="text-primary">x</span> 8
                        </p>
                      </div>
                    </div>

                    {/* Risposte */}
                    <div className="grid grid-cols-2 gap-4">
                      {["86", "96", "108", "112"].map((n) => (
                        <Button
                          key={n}
                          size="lg"
                          className="
      bg-muted
      h-20 rounded-xl
      text-3xl font-black
      transition-all
      hover:border-primary
      hover:bg-primary/10
      active:scale-95
      "
                        >
                          {n}
                        </Button>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="justify-center border-t bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                      {t("gamePreview.footer")}
                    </p>
                  </CardFooter>
                </Card>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-5 text-yellow-500" />

                    <span className="text-sm font-semibold">
                      {t("gamePreview.xpAvailable")}
                    </span>
                  </div>

                  <span className="font-black text-primary">+25 XP</span>
                </div>
              </div>

              {/* FLOATING XP */}

              <div className="hero-floating-card absolute -bottom-7 -left-8 rounded-2xl border bg-card p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400/20">
                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("gamePreview.newLevel")}
                    </p>

                    <p className="font-black">{t("gamePreview.level")}</p>
                  </div>
                </div>
              </div>

              {/* FLOATING STREAK */}

              <div className="hero-floating-card absolute -right-6 -top-6 rounded-2xl border bg-card px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 fill-orange-500 text-orange-500" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("gamePreview.streak")}
                    </p>

                    <p className="font-black">
                      {t("gamePreview.days", { count: 12 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* INTRO */}
        {/* ====================================================== */}

        <section className="intro-section border-y bg-muted/30">
          <div className="intro-content mx-auto max-w-4xl px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="size-7 text-primary" />
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              {t("intro.title")}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {t("intro.description")}
            </p>
          </div>
        </section>

        {/* ====================================================== */}
        {/* FEATURES */}
        {/* ====================================================== */}

        <section className="features-section mx-auto max-w-7xl px-6 py-24 lg:px-8 ">
          <div className="max-w-2xl features-title">
            <p className="features-title-line font-bold text-primary">
              {t("features.label")}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              <span className="features-title-line">
                {t("features.title1")}
              </span>
              <br />
              <span className="features-title-line">
                {t("features.title2")}
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="feature-card group rounded-3xl border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6 text-primary" />
                    </div>

                    <span className="feature-number text-5xl font-black text-muted/40 transition-colors group-hover:text-primary/40">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-black transition-colors group-hover:text-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================== */}
        {/* GAMES */}
        {/* ====================================================== */}

        <section className="games-section bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="games-heading flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-bold text-primary">{t("games.label")}</p>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {t("games.title1")}
                  <br />
                  {t("games.title2")}
                </h2>
              </div>

              <Link
                href="/dashboard/games"
                className="group inline-flex items-center gap-2 font-bold text-primary"
              >
                {t("games.viewAll")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="games-grid mt-12 grid gap-5 md:grid-cols-3">
              {games.map((game) => {
                const Icon = game.icon;

                return (
                  <Link
                    href="/dashboard/games"
                    key={game.title}
                    className="game-card group rounded-3xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="size-7 text-primary" />
                      </div>

                      <ArrowRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>

                    <h3 className="mt-8 text-xl font-black transition-colors group-hover:text-primary">
                      {game.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {game.desription}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-bold">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      {t("games.discover")}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* PROGRESSION */}
        {/* ====================================================== */}

        <section className="progression-section mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="progression-content">
              <p className="font-bold text-primary">{t("progression.label")}</p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                {t("progression.title1")}
                <br />
                {t("progression.title2")}
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                {t("progression.description")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border p-5 transition hover:border-primary/40">
                  <Zap className="size-6 text-yellow-500" />

                  <p className="mt-3 text-2xl font-black">
                    {t("progression.stats.xp.title")}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("progression.stats.xp.description")}
                  </p>
                </div>

                <div className="rounded-2xl border p-5 transition hover:border-primary/40">
                  <Trophy className="size-6 text-primary" />

                  <p className="mt-3 text-2xl font-black">
                    {t("progression.stats.badge.title")}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("progression.stats.badge.description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="progression-card rounded-[2rem] border bg-card p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("progression.level")}
                  </p>

                  <p className="mt-1 text-3xl font-black">12</p>
                </div>

                <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="size-7 text-primary" />
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold">
                    {t("progression.experience", { current: 1.24, max: 1.5 })}
                  </span>

                  <span className="text-muted-foreground">83%</span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-muted">
                  <div className="progression-bar h-full w-[83%] rounded-full bg-primary" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="progression-stat rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-black">12</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("progression.strak")}
                  </p>
                </div>

                <div className="progression-stat rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-black">47</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("progression.games")}
                  </p>
                </div>

                <div className="progression-stat rounded-xl bg-muted/50 p-4 text-center">
                  <p className="text-2xl font-black">18</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("progression.badges")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* CTA */}
        {/* ====================================================== */}

        <section className="cta-section px-6 pb-24 lg:px-8">
          <div className="cta-content mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-primary-foreground sm:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl text-center">
              <Sparkles className="mx-auto size-10" />

              <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-5xl">
                {t("cta.title")}
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-lg opacity-90">
                {t("cta.description")}
              </p>

              <Link
                href="/dashboard/games"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-7 py-4 font-black text-foreground shadow-lg transition hover:-translate-y-0.5"
              >
                {t("cta.button")}
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
