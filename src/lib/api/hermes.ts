import { invoke } from "@tauri-apps/api/core";
import type { HermesModelConfig } from "@/types";

/**
 * Hermes provider integration API.
 * CC Switch only reads the `model` section needed to highlight active provider
 * state. Hermes memory, dashboard, and agent management are outside this app.
 */
export const hermesApi = {
  async getModelConfig(): Promise<HermesModelConfig | null> {
    return await invoke("get_hermes_model_config");
  },
};
