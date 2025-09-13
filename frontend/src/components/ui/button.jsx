import * as React from "react";

export const Button = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
  };

  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
