import { Skeleton } from "@/components/ui/skeleton";

export default function AvatarSkeleton() {
  return (
    <div className="flex w-fit items-center gap-4 p-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}
