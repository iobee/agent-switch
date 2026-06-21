import { useQuery, type QueryClient } from "@tanstack/react-query";
import { hermesApi } from "@/lib/api/hermes";
import { providersApi } from "@/lib/api/providers";

/**
 * Centralized query keys for all Hermes-related queries.
 * Import this from any file that needs to invalidate Hermes caches.
 */
export const hermesKeys = {
  all: ["hermes"] as const,
  liveProviderIds: ["hermes", "liveProviderIds"] as const,
  modelConfig: ["hermes", "modelConfig"] as const,
};

/**
 * Invalidate all Hermes caches that may change when a provider is
 * added/updated/deleted/switched. Runs invalidations in parallel so the
 * caller doesn't await three sequential refetches.
 */
export function invalidateHermesProviderCaches(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: hermesKeys.liveProviderIds }),
    queryClient.invalidateQueries({ queryKey: hermesKeys.modelConfig }),
  ]);
}

// ============================================================
// Query hooks
// ============================================================

export function useHermesLiveProviderIds(enabled: boolean) {
  return useQuery({
    queryKey: hermesKeys.liveProviderIds,
    queryFn: () => providersApi.getHermesLiveProviderIds(),
    enabled,
  });
}

export function useHermesModelConfig(enabled: boolean) {
  return useQuery({
    queryKey: hermesKeys.modelConfig,
    queryFn: () => hermesApi.getModelConfig(),
    enabled,
  });
}
