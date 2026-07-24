"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { generateReactHelpers } from "@uploadthing/react";

import type { UploadRouter } from "@/lib/uploadthing";
import { compressImage } from "@/lib/img/compress-image";

const { useUploadThing } = generateReactHelpers<UploadRouter>();

interface AvatarUploadButtonProps {
  value?: string | null;
  onChange: ({ url, key }: { url: string; key: string }) => void;
  name?: string;
}

export function AvatarUploadButton({
  value,
  onChange,
  name = "image",
}: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const { startUpload, isUploading } = useUploadThing("avatar");

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await compressImage(file);

    const localUrl = URL.createObjectURL(compressedFile);
    setPreview(localUrl);

    const uploaded = await startUpload([compressedFile]);

    if (!uploaded || uploaded.length === 0) return;

    const url = uploaded[0].ufsUrl;

    setPreview(url);
    onChange({
      url,
      key: uploaded[0].key,
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-20 border">
        <AvatarImage src={preview ?? undefined} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="mr-2 size-4" />
              Change Avatar
            </>
          )}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
