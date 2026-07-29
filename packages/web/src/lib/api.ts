const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("petshop_token")
      : null;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let msg: string | string[] = res.statusText;
    try {
      const body = await res.json();
      msg = body.message ?? msg;
    } catch {
      /* ignore */
    }
    throw new Error(
      Array.isArray(msg) ? msg.join(", ") : typeof msg === "string" ? msg : "Request failed",
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function assetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}
