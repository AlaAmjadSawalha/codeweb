import * as React from "react";

const variantMap = {
  default: "btn-primary",
  destructive: "btn-danger",
  outline: "btn-outline-secondary",
  secondary: "btn-secondary",
  ghost: "btn-light",
  link: "btn-link text-decoration-none",
};

const sizeMap = {
  default: "",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-sm px-2 py-1",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {

    const classes = `btn ${variantMap[variant]} ${sizeMap[size]} ${className || ''}`.trim();

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function buttonVariants({ variant = "default", size = "default", className = "" }: { variant?: keyof typeof variantMap | null, size?: keyof typeof sizeMap | null, className?: string } = {}) {
  // Map null to "default" to typescript doesn't complain about shadcn types occasionally throwing nulls
  const v = (variant || "default") as keyof typeof variantMap;
  const s = (size || "default") as keyof typeof sizeMap;
  return `btn ${variantMap[v] || variantMap.default} ${sizeMap[s] || sizeMap.default} ${className}`.trim();
}

export { Button };
