import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-primary dark:text-primary-foreground", className)}>
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C18 8 18 24 12 28" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
            <path d="M20 4C14 8 14 24 20 28" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
            <path d="M16 4C19.3333 9.33333 19.3333 22.6667 16 28" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12.5 16H19.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span className="text-xl font-bold tracking-tight text-foreground">{APP_NAME}</span>
      </div>
    </div>
  );
}
