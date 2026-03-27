import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { cn } from "./utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogHeader data-slot="modal-header" className={className}>
      <DialogTitle data-slot="modal-title">{children}</DialogTitle>
    </DialogHeader>
  );
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-body"
      className={cn("py-2", className)}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <DialogFooter
      data-slot="modal-footer"
      className={className}
      {...props}
    />
  );
}

function ModalRoot({ isOpen, onClose, children, className }: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent data-slot="modal" className={className}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Compound component — slots pattern (dot-notation)
const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { Modal };
export type { ModalProps };
