"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

const TOAST_DURATION = 3000;

type ToastType = "success" | "error";

type AppToastProps = {
  message: string;
  type: ToastType;
  toastId: string;
};

const AppToast = ({ message, type, toastId }: AppToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      toast.dismiss(toastId);
    }, TOAST_DURATION);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastId]);

  return (
    <div className="w-[320px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
      <div className="flex items-start gap-3 px-4 py-3">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            type === "success"
              ? "bg-[var(--color-success)]"
              : "bg-[var(--color-danger)]"
          }`}
        >
          {type === "success" ? "✓" : "!"}
        </div>

        <p className="text-sm font-medium leading-5 text-[var(--foreground)]">
          {message}
        </p>
      </div>

      <div className="h-1 w-full bg-[var(--color-border)]">
        <div
          className={`h-full ${
            type === "success"
              ? "bg-[var(--color-success)]"
              : "bg-[var(--color-danger)]"
          }`}
          style={{
            animation: `app-toast-progress ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export const showAppToast = (type: ToastType, message: string) => {
  toast.custom(
    (toastItem) => (
      <AppToast message={message} type={type} toastId={toastItem.id} />
    ),
    {
      duration: TOAST_DURATION,
      position: "top-right",
    },
  );
};
