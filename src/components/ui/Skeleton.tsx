import { cn } from "../../lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-sm bg-[linear-gradient(90deg,#F1F5F9_0%,#E2E8F0_50%,#F1F5F9_100%)] bg-[length:1280px_100%]",
        className,
      )}
    />
  );
}
