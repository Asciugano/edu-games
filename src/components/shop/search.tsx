"use client";

import { Search, Coins, RotateCcw, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ShopSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`?${params.toString()}`);
  };

  const onSearch = useDebouncedCallback((value: string) => {
    updateParam("search", value);
  }, 300);

  const resetFilters = () => {
    router.replace("/dashboard/shop");
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="pl-10"
              placeholder="Cerca un oggetto..."
              defaultValue={searchParams.get("search") ?? ""}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* Tipo */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <Select
              defaultValue={searchParams.get("type") ?? "all"}
              onValueChange={(value) => updateParam("type", value)}
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="AVATAR">Avatar</SelectItem>
                <SelectItem value="FRAME">Cornici</SelectItem>
                <SelectItem value="TITLE">Titoli</SelectItem>
                <SelectItem value="THEME">Temi</SelectItem>
              </SelectContent>
            </Select>

            {/* Rarità */}
            <Select
              defaultValue={searchParams.get("rarity") ?? "all"}
              onValueChange={(value) => updateParam("rarity", value)}
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Rarità" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Tutte</SelectItem>
                <SelectItem value="COMMON">Comune</SelectItem>
                <SelectItem value="RARE">Rara</SelectItem>
                <SelectItem value="EPIC">Epica</SelectItem>
                <SelectItem value="LEGENDARY">Leggendaria</SelectItem>
              </SelectContent>
            </Select>

            {/* Prezzo massimo */}
            <div className="relative w-full lg:w-40">
              <Coins className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-yellow-500" />

              <Input
                type="number"
                min={0}
                className="pl-10"
                placeholder="Prezzo max"
                defaultValue={searchParams.get("maxPrice") ?? ""}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
              />
            </div>

            {/* Ordinamento */}
            <Select
              defaultValue={searchParams.get("sort") ?? "recent"}
              onValueChange={(value) => updateParam("sort", value)}
            >
              <SelectTrigger className="w-full lg:w-52">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="recent">Più recenti</SelectItem>
                <SelectItem value="price-asc">Prezzo crescente</SelectItem>
                <SelectItem value="price-desc">Prezzo decrescente</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset */}
            <Button
              variant="outline"
              size="icon"
              onClick={resetFilters}
              title="Reset filtri"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
