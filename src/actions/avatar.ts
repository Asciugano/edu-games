"use server";

import { deleteFile } from "@/lib/uploadthing";

export async function deleteOldAvatar(fileKey: string) {
  await deleteFile(fileKey);
}
