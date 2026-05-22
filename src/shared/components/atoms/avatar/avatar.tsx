import { cva, type VariantProps } from "class-variance-authority";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/shared/components/ui/avatar";
import { getSummaryName } from "@/src/shared/utils/common";
import { cn } from "@/src/shared/lib/utils";

const avatarVariants = cva("relative inline-block shrink-0", {
  variants: {
    size: {
      xs: "size-6 text-[10px]",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-16 text-base",
      xl: "size-20 text-lg",
      "2xl": "size-32 md:size-40 text-2xl",
      "3xl": "size-40 md:size-48 text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const indicatorVariants = cva(
  "absolute bottom-0 right-0 rounded-full border-2 border-background",
  {
    variants: {
      size: {
        xs: "size-1.5 border",
        sm: "size-2",
        md: "size-2.5",
        lg: "size-3.5",
        xl: "size-5 border-4",
        "2xl": "size-6 border-4",
        "3xl": "size-8 border-4",
      },
      status: {
        online: "bg-green-500",
        offline: "bg-muted-foreground",
        busy: "bg-destructive",
        away: "bg-yellow-500",
      },
    },
    defaultVariants: {
      status: "online",
    },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  status?: "online" | "offline" | "busy" | "away";
  showStatus?: boolean;
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size,
  status = "online",
  showStatus = false,
  className,
}: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size }), className)}>
      <ShadcnAvatar className="size-full">
        <AvatarImage src={src || ""} alt={alt} className="object-cover" />
        <AvatarFallback className="font-semibold bg-muted text-muted-foreground">
          {fallback ? getSummaryName(fallback) : "U"}
        </AvatarFallback>
      </ShadcnAvatar>

      {showStatus && (
        <span className={cn(indicatorVariants({ size, status }))} />
      )}
    </div>
  );
}
