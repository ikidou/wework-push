import { getEnv, requireEnv } from "./utils.ts";

export const CROP_ID = requireEnv("WEWORK_CROP_ID");
export const AGENT_ID = parseInt(getEnv("WEWORK_AGENT_ID", "0"));
export const AGENT_SECRET = requireEnv("WEWORK_AGENT_SECRET");
export const AGENT_TOKEN = requireEnv("WEWORK_AGENT_TOKEN");
export const AGENT_AES_KEY = requireEnv("WEWORK_AGENT_AES_KEY");
export const SEND_TO_USER = requireEnv("WEWORK_SEND_TO_USER");
export const SEND_TOKEN = requireEnv("WEWORK_SEND_TOKEN");
