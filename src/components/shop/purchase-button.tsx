"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PurchaseDialog } from "./purchase-dialog";

interface Props {
  item: {
    id: string;
    name: string;
    price: number;
  };

  owned?: boolean;
}

export function PurchaseButton({ item, owned }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={owned}
        onClick={() => setOpen(true)}
        variant={owned ? "outline" : "default"}
      >
        {owned ? "Posseduto" : "Acquista"}
      </Button>

      <PurchaseDialog item={item} open={open} onOpenChange={setOpen} />
    </>
  );
}
