"use client";

import { authClient } from "@/lib/auth-client";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 mx-4 my-4 rounded-xl bg-card/50 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* SINISTRA: Logo */}
        <div>
          <Link
            href="/"
            className="flex text-xl font-bold tracking-wide text-primary hover:text-hover-primary transition gap-3"
          >
            <Image
              src="/icon.png"
              alt="icon"
              height={32}
              width={32}
              className="rounded-xl"
            />
            A11yLab
          </Link>
        </div>

        {/* DESTRA: Links + Login/Logout */}
        <div className="flex items-center space-x-6">
          {/* Links */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-primary transition"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          {/* Login o Logout */}
          {!session?.user ? (
            <Button variant="ghost" asChild>
              <Link href="/auth/sign-in">
                <LogIn size={18} />
                <span>Sign-In</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/auth/sign-in");
                    },
                  },
                })
              }
            >
              <LogOut size={18} />
              <span>Sign-Out</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
