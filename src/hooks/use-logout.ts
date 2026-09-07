"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { logoutUser } from "@/services/auth.service";
import { showAppToast } from "@/components/ui/app-toast";
import { useAuth } from "@/context/AuthContext";

interface UseLogoutResult {
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export const useLogout = (): UseLogoutResult => {
  const router = useRouter();
  const { clearUser } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await logoutUser();

      clearUser();

      showAppToast("success", response.message);

      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Logout failed. Please try again.";

      showAppToast("error", message);
    } finally {
      setIsLoggingOut(false);
    }
  }, [clearUser, isLoggingOut, router]);

  return {
    logout,
    isLoggingOut,
  };
};
