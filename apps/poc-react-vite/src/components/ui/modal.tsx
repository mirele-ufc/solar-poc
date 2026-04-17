import * as React from "react";

import { cn } from "./utils";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
} & Omit<React.ComponentProps<"div">, "children" | "className">;

function ModalRoot({
  isOpen,
  onClose,
  children,
  className,
  overlayClassName,
  ...dialogProps
}: ModalProps) {
  React.useEffect(() => {
    if (!isOpen || !onClose) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-slot="modal-overlay"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4",
        overlayClassName,
      )}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        data-slot="modal"
        className={cn(
          "w-full max-w-lg rounded-[12px] bg-white p-6 shadow-xl",
          className,
        )}
        role={dialogProps.role ?? "dialog"}
        aria-modal={
          typeof dialogProps["aria-modal"] === "boolean"
            ? dialogProps["aria-modal"]
            : true
        }
        {...dialogProps}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("mb-4 flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="modal-body" className={cn("", className)} {...props} />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn("mt-6 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
