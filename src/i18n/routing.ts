import { defineRouting } from "next-intl/routing";
import { locales } from "@/types/locales";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});
