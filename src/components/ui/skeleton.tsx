import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-sand-200/50 dark:bg-sand-800/50", className)}
      {...props}
    />
  );
}

export { Skeleton };
