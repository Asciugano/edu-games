import Link from "next/link";
import { FaGithub, FaInstagram, FaMailBulk } from "react-icons/fa";

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">EduGames</h2>

            <p className="text-sm text-muted-foreground">
              Impara divertendoti con giochi educativi progettati per rendere
              l&apos;apprendimento coinvolgente.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Esplora</h3>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/games">Giochi</Link>
              <Link href="/leaderboard">Classifica</Link>
              <Link href="/achievements">Achievement</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Supporto</h3>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/contact">Contatti</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/feedback">Segnala un bug</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legale</h3>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/cookies">Cookie Policy</Link>
              <Link href="/terms">Termini di utilizzo</Link>
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-border" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex gap-4">
            <Link href="https://github.com/Asciugano/edu-games" target="_blank">
              <FaGithub className="size-5 transition hover:text-primary" />
            </Link>

            <Link href="#">
              <FaInstagram className="size-5 transition hover:text-primary" />
            </Link>

            <Link href="mailto:diaferiosamuele@gamil.com">
              <FaMailBulk className="size-5 transition hover:text-primary" />
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground md:text-right">
            <p>Copyright (c) 2026 Asciugano. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
