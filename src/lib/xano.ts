/**
 * Xano API client for Seekers (dashboard, store, profile, games, leaderboard).
 * Sends the Memberstack JWT when available so Xano can require auth and identify the user by the token's subject (not by email in the URL). See docs/xano-security.md.
 */

import { getMemberstackToken } from "@/lib/memberstack-token";

const BASE =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_XANO_BASE_URL ??
        "https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8")
    : "https://x3yo-h8fa-1fj9.a2.xano.io/api:3rlLJ6G8";

function url(path: string, params?: Record<string, string>) {
  const u = path.startsWith("http") ? path : `${BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  if (!params || Object.keys(params).length === 0) return u;
  const search = new URLSearchParams(params).toString();
  return `${u}${u.includes("?") ? "&" : "?"}${search}`;
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getMemberstackToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await fetch(url(path, params), {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Xano GET ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Xano POST ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// --- Response types (match live Xano responses) ---

export interface XanoDashboard {
  tier?: string;
  status_points_this_period?: number;
  yap_dollars?: number;
  current_streak?: number;
  recent_activity?: Array<{
    source?: string;
    created_at?: string;
    amount?: number;
  }>;
}

export interface XanoStoreItem {
  id: string | number;
  name: string;
  description?: string;
  yap_dollars_cost: number;
  image_url?: string;
}

export interface XanoRedeemResult {
  message?: string;
  reward_name?: string;
  new_balance?: number;
}

export interface XanoUserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  birthday?: string;
  pronouns?: string;
  street_address?: string;
  suburb_city?: string;
  region_state?: string;
  postcode?: string;
  country?: string;
  job_title?: string;
  company_name?: string;
  industry?: string;
  social_instagram?: string;
  social_tiktok?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_x?: string;
  social_facebook?: string;
  social_threads?: string;
  website?: string;
  referral_source?: string;
  membership_number?: string;
  email_frequency?: string;
  [key: string]: unknown;
}

export interface XanoUpdateProfilePayload {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  birthday?: string;
  pronouns?: string;
  street_address?: string;
  suburb_city?: string;
  region_state?: string;
  postcode?: string;
  country?: string;
  job_title?: string;
  company_name?: string;
  industry?: string;
  social_instagram?: string;
  social_tiktok?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_x?: string;
  social_facebook?: string;
  social_threads?: string;
  website?: string;
  referral_source?: string;
}

export interface XanoLeaderboardEntry {
  display_name?: string;
  time_seconds?: number;
  guesses_used?: number;
  [key: string]: unknown;
}

export interface XanoSubmitGamePayload {
  user_email: string;
  game_type: string;
  date: string;
  completed?: boolean;
  time_seconds?: number;
  difficulty?: string;
  guesses_used?: number;
  rectangles_used?: number;
  bulbs_used?: number;
}

export interface XanoSubmitGameResult {
  points_earned?: number;
  yap_dollars_earned?: number;
  [key: string]: unknown;
}

// --- API functions ---

export async function getDashboard(email: string): Promise<XanoDashboard> {
  return get<XanoDashboard>("get_dashboard", { email });
}

export async function getStoreItems(): Promise<XanoStoreItem[]> {
  const raw = await get<XanoStoreItem[] | { items?: XanoStoreItem[] }>("get_store_items");
  return Array.isArray(raw) ? raw : raw?.items ?? [];
}

export async function redeemReward(
  email: string,
  rewardId: string | number
): Promise<XanoRedeemResult> {
  return post<XanoRedeemResult>("redeem_reward", { email, reward_id: rewardId });
}

export async function getUserProfile(email: string): Promise<XanoUserProfile> {
  return get<XanoUserProfile>("get_user_profile", { email });
}

export async function updateProfile(
  payload: XanoUpdateProfilePayload
): Promise<{ message?: string }> {
  return post<{ message?: string }>("update_profile", payload as unknown as Record<string, unknown>);
}

export async function updateEmailFrequency(
  email: string,
  emailFrequency: string
): Promise<{ success?: boolean; message?: string }> {
  return post<{ success?: boolean; message?: string }>("seekers/update_email_frequency", {
    email,
    email_frequency: emailFrequency,
  });
}

export async function deleteAccount(email: string): Promise<{ success?: boolean; message?: string }> {
  return post<{ success?: boolean; message?: string }>("seekers/delete_account", { email });
}

export async function getGameLeaderboard(params: {
  game_type: string;
  date: string;
  limit?: number;
}): Promise<XanoLeaderboardEntry[]> {
  const { game_type, date, limit = 100 } = params;
  const raw = await get<XanoLeaderboardEntry[] | { leaderboard?: XanoLeaderboardEntry[] }>(
    "get_game_leaderboard",
    { game_type, date, limit: String(limit) }
  );
  const list = Array.isArray(raw) ? raw : raw?.leaderboard ?? [];
  return list.slice(0, limit);
}

export async function submitGameResult(
  payload: XanoSubmitGamePayload
): Promise<XanoSubmitGameResult> {
  return post<XanoSubmitGameResult>("submit_game_result", payload as unknown as Record<string, unknown>);
}
