import type { Provider } from "@/types";

export interface UserRepositoryItem {
  id: string;
  repository_id: number;
  created_at: string;
  url: string;
  provider: Provider;
  config: Record<string, unknown>;
}

export interface UserFeedResponse {
  repositories: UserRepositoryItem[];
  connectors: {
    changelog: import("@/types").ChangelogItem[];
    youtube: import("@/types").YoutubeItem[];
    rss: import("@/types").RssItem[];
    scrap: import("@/types").ScrapItem[];
  };
}

async function apiFetch<T>(
  path: string,
  token: string,
  apiUrl: string,
  init?: RequestInit,
  attempt = 0
): Promise<T> {
  const base = apiUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    if (!res.ok) {
      if (attempt === 0 && res.status >= 500) {
        return apiFetch(path, token, apiUrl, init, 1);
      }
      throw new Error(`StayUp API error ${res.status}: ${path}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (attempt === 0 && err instanceof TypeError) {
      return apiFetch(path, token, apiUrl, init, 1);
    }
    throw err;
  }
}

export async function loginWithPassword(
  email: string,
  password: string,
  apiUrl: string
): Promise<string> {
  const res = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 401) throw new Error("Identifiants invalides.");
  if (!res.ok) throw new Error("Erreur serveur, réessayez.");

  const { token } = (await res.json()) as { token: string };
  return token;
}

export async function getUserFeed(
  userId: string,
  token: string,
  apiUrl: string
): Promise<UserFeedResponse> {
  return apiFetch<UserFeedResponse>(
    `/ui/users/${userId}/feed`,
    token,
    apiUrl
  );
}
