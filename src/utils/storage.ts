export const STORAGE_KEY = "prc_running_crew_final_v1";
export const SESSION_KEY = "prc_running_crew_session_final_v1";

export function saveStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);

  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
