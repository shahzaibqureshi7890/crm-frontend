"use client";

import { useAuth } from "@/context/AuthContext";
import type { CurrentUser } from "@/types/user.types";

interface UseCurrentUserResult {
  user: CurrentUser | null;
  isLoading: boolean;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const { user, isLoading } = useAuth();

  return {
    user,
    isLoading,
  };
};
