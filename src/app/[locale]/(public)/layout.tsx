import { AppFooter } from "@/components/footer/app-footer";
import NavBar from "@/components/nav-bar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edu-Games" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />

      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
