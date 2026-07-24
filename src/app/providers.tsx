"use client";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { useState } from "react";
import type { UploadRouter } from "@/lib/uploadthing";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextSSRPlugin<UploadRouter> endpoint="/api/uploadthing" />
      {children}
    </>
  );
}
