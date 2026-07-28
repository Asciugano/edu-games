"use client";

import { Loader2, CheckCircle2, XCircle, Coins } from "lucide-react";

import { useState } from "react";
import { purchaseItem } from "@/actions/shop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { useWindowSize } from "@uidotdev/usehooks";
import Confetti from "react-confetti";

interface Props {
  item: {
    id: string;
    name: string;
    price: number;
  };

  open: boolean;

  onOpenChange: (value: boolean) => void;
}

export function PurchaseDialog({ item, open, onOpenChange }: Props) {
  const { height, width } = useWindowSize();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const [error, setError] = useState("");

  async function handlePurchase() {
    try {
      setStatus("loading");

      await purchaseItem(item.id);

      setStatus("success");
    } catch (err) {
      setStatus("error");

      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  function close() {
    setStatus("idle");
    setError("");
    onOpenChange(false);
  }

  return (
    <>
      {status === "success" && (
        <Confetti
          recycle={false}
          height={height ?? 0}
          width={width ?? 0}
          numberOfPieces={150}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          {status === "idle" && (
            <>
              <DialogHeader>
                <h2 className="text-3xl font-semibold">Conferma acquisto</h2>

                <p className="text-sm text-muted-foreground">
                  Sei sicuro di voler acquistare:
                  <br />
                  <strong>{item.name}</strong>
                  <div className="mt-4 flex items-center gap-2">
                    <Coins className="text-yellow-500" />
                    {item.price} monete
                  </div>
                </p>
              </DialogHeader>

              <DialogFooter className="flex items-center justify-between gap-3">
                <DialogClose asChild>
                  <Button variant="destructive">Annulla</Button>
                </DialogClose>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handlePurchase();
                  }}
                >
                  Acquista
                </Button>
              </DialogFooter>
            </>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="size-12 animate-spin" />

              <p>Acquisto in corso...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 className="size-14 text-green-500" />

              <h2 className="text-xl font-semibold">Acquisto completato!</h2>

              <p className="text-muted-foreground">Hai ottenuto {item.name}</p>

              <Button onClick={close}>Continua</Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <XCircle className="size-14 text-red-500" />

              <h2 className="text-xl font-semibold">Errore</h2>

              <p className="text-muted-foreground">{error}</p>

              <Button variant="outline" onClick={close}>
                Chiudi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
