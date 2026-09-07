"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function AppModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}: AppModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  if (!isOpen) {
    return null;
  }
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-modal-title"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`w-full ${sizeClasses[size]} overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2
            id="app-modal-title"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}
        </div>
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
