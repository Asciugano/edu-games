"use client";

import { CardContent } from "@/components/ui/card";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <Skeleton className="h-52 w-full" />;

  return (
    <CardContent className="space-y-8">
      <RadioGroup
        defaultValue={theme || "system"}
        onValueChange={(value) => setTheme(value)}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="light" id="light" />

          <Label htmlFor="light">Light</Label>
        </div>

        <div className="flex items-center space-x-3">
          <RadioGroupItem value="dark" id="dark" />

          <Label htmlFor="dark">Dark</Label>
        </div>

        <div className="flex items-center space-x-3">
          <RadioGroupItem value="system" id="system" />

          <Label htmlFor="system">System</Label>
        </div>
      </RadioGroup>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h4>Compact Sidebar</h4>

            <p className="text-sm text-muted-foreground">
              Reduce sidebar spacing.
            </p>
          </div>

          <Switch />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h4>Animations</h4>

            <p className="text-sm text-muted-foreground">
              Enable interface animations.
            </p>
          </div>

          <Switch defaultChecked />
        </div>
      </div>
    </CardContent>
  );
}
