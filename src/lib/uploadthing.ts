import { createUploadthing, type FileRouter } from "uploadthing/next";
import { utapi } from "@/lib/uploading-server";

const f = createUploadthing();

export const uploadRouter = {
  avatar: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Più avanti controlleremo che l'utente sia autenticato
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export async function deleteFile(fileKey: string) {
  try {
    await utapi.deleteFiles(fileKey);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
