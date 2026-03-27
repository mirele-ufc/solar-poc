import * as React from "react";

import { cn } from "@/components/ui/utils";

interface FormContainerProps
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface FormContainerHeaderProps {
  title: string;
  className?: string;
}

function FormContainerHeader({ title, className }: FormContainerHeaderProps) {
  return (
    <div
      data-slot="form-container-header"
      className={cn("mb-6", className)}
    >
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function FormContainerBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-container-body"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

function FormContainerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-container-footer"
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

function FormContainerRoot({
  onSubmit,
  children,
  className,
  ...props
}: FormContainerProps) {
  return (
    <form
      data-slot="form-container"
      onSubmit={onSubmit}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </form>
  );
}

// Compound component — slots pattern (dot-notation)
const FormContainer = Object.assign(FormContainerRoot, {
  Header: FormContainerHeader,
  Body: FormContainerBody,
  Footer: FormContainerFooter,
});

export { FormContainer };
export type { FormContainerProps };
