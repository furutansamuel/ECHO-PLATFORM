import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary active:scale-[0.97]",
{
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-emerald-600 to-green-700 text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 hover:brightness-110",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-primary/15 bg-white/70 backdrop-blur-lg shadow-md hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/70 hover:-translate-y-0.5 shadow-sm",
        ghost:
          "text-muted-foreground hover:text-primary hover:bg-primary/5",
        link:"text-primary hover:text-primary/80 underline-offset-4 hover:underline",
      },
      size: {
        default:"h-11 px-5 has-[>svg]:px-4",
        sm:"h-9 rounded-lg px-4",
        lg:"h-12 rounded-xl px-8 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
