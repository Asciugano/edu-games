"use client";

import { KeyRound, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function SecurityCard() {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h3 className="font-semibold">Security</h3>
        <p className="text-sm text-muted-foreground">Protect your account.</p>
      </div>

      <Separator />

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4" />
            <span className="font-medium">Password</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Change your password anytime.
          </p>
        </div>

        <Button variant="outline">Change</Button>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="size-4" />
            <span className="font-medium">2FA</span>
          </div>

          <p className="text-sm text-muted-foreground">Add extra security.</p>
        </div>

        <Button variant="secondary">Enable</Button>
      </div>
    </Card>
  );
}
