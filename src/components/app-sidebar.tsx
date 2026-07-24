"use client";

import {
  Map,
  ChevronsUpDown,
  Gift,
  ChartColumn,
  Trophy,
  Play,
  Shuffle,
  Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavMain from "@/components/nav-main";
import NavUser from "@/components/nav-user";
import { Suspense } from "react";
import AvatarSkeleton from "@/components/skeletons/avatar-skeleton";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createGameSession, getOpenGameSession } from "@/actions/game";
import { GameMode } from "../../generated/prisma/enums";

export const data = {
  main: [
    {
      title: "Gioca",
      url: "/dashboard/games",
      icon: Play,
    },
    {
      title: "Percorsi",
      url: "/paths",
      icon: Map,
    },
  ],

  // learning: [
  // ],

  progress: [
    {
      title: "Progressi",
      url: "/dashboard/progress",
      icon: ChartColumn,
    },
    {
      title: "Sfide",
      url: "/dashboard/challenges",
      icon: Trophy,
    },
    {
      title: "Premi",
      url: "/dashboard/rewards",
      icon: Gift,
    },
  ],
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const quickActions = [
    {
      title: "Continua",
      icon: Play,
      action: async () => {
        try {
          const sessionId = await getOpenGameSession();
          router.push(`/dashboard/games/${sessionId}/play`);
        } catch (err) {
          console.error(err);
          toast.error(err as string);
        }
      },
    },
    {
      title: "Lezione Casuale",
      icon: Shuffle,
      action: async () => {
        const sessionId = await createGameSession(GameMode.MIXED);
        router.push(`/dashboard/games/${sessionId}/play`);
      },
    },
    {
      title: "Guadagna XP",
      icon: Star,
      action: () => router.push("/dashboard/challenges"),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-primary data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image
                      src="/icon.png"
                      alt="logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Edu-Games</span>
                    {/*<span className="truncate text-xs">{activeaction.plan}</span>*/}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Quick Actions
                </DropdownMenuLabel>
                {quickActions.map((action, index) => (
                  <DropdownMenuItem
                    key={action.title}
                    className="gap-2 p-2"
                    onClick={action.action}
                    asChild
                  >
                    <div>
                      <Button asChild variant="ghost">
                        <div>
                          <div className="flex size-6 items-center justify-center rounded-md border">
                            <action.icon className="size-3.5 shrink-0" />
                          </div>
                          {action.title}
                        </div>
                      </Button>
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {Object.entries(data).map(([section, items]) => (
          <NavMain key={section} label={section} items={items} />
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-4">
        <Suspense fallback={<AvatarSkeleton />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
