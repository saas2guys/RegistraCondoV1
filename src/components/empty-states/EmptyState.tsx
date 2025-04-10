
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="flex max-w-[420px] flex-col items-center justify-center gap-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <h3 className="mt-4 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
