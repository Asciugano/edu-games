import type { Metadata } from "next";
import AppBreadcrumb from "@/components/app-breadcrumb";
import AppSidebar from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { assignChallenges } from "@/actions/challenge";
import { AppFooter } from "@/components/footer/app-footer";

export const metadata: Metadata = { title: "Edu-Games" };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const defaultOpen = cookiesStore.get("sidebar_state")?.value === "true";

  await assignChallenges();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <SidebarInset>
          <header className="flex items-center gap-2 border-b p-2">
            <SidebarTrigger />
            <Separator orientation="vertical" />
            <AppBreadcrumb />
          </header>
          <main className="flex-1">
            <div className="p-4">{children}</div>
          </main>
          <div className="mt-10">
            <AppFooter />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
