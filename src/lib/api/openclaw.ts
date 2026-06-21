import { invoke } from "@tauri-apps/api/core";
import type {
  OpenClawDefaultModel,
  OpenClawModelCatalogEntry,
  OpenClawHealthWarning,
  OpenClawWriteOutcome,
} from "@/types";

/**
 * OpenClaw provider integration API.
 * Agent Switch only touches the provider/model fields required for local Gateway
 * switching. OpenClaw workspace, env, tools, and agent defaults management are
 * intentionally outside this app surface.
 */
export const openclawApi = {
  /**
   * Get default model configuration (agents.defaults.model)
   */
  async getDefaultModel(): Promise<OpenClawDefaultModel | null> {
    return await invoke("get_openclaw_default_model");
  },

  /**
   * Set default model configuration (agents.defaults.model)
   */
  async setDefaultModel(
    model: OpenClawDefaultModel,
  ): Promise<OpenClawWriteOutcome> {
    return await invoke("set_openclaw_default_model", { model });
  },

  /**
   * Get model catalog/allowlist (agents.defaults.models)
   */
  async getModelCatalog(): Promise<Record<
    string,
    OpenClawModelCatalogEntry
  > | null> {
    return await invoke("get_openclaw_model_catalog");
  },

  /**
   * Set model catalog/allowlist (agents.defaults.models)
   */
  async setModelCatalog(
    catalog: Record<string, OpenClawModelCatalogEntry>,
  ): Promise<OpenClawWriteOutcome> {
    return await invoke("set_openclaw_model_catalog", { catalog });
  },

  async scanHealth(): Promise<OpenClawHealthWarning[]> {
    return await invoke("scan_openclaw_config_health");
  },

  async getLiveProvider(
    providerId: string,
  ): Promise<Record<string, unknown> | null> {
    return await invoke("get_openclaw_live_provider", { providerId });
  },
};
