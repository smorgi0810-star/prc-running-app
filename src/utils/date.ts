export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function now(): string {
  return new Date().toISOString();
}

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function yearOf(date: string): string {
  return date.slice(0, 4);
}

export function weekday(date: string): number {
  return new Date(`${date}T00:00:00`).getDay();
}

export function monthDays(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const arr: string[] = [];

  for (let i = 0; i < first.getDay(); i += 1) arr.push("");
  for (let d = 1; d <= last.getDate(); d += 1) {
    arr.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }

  while (arr.length % 7) arr.push("");

  return arr;
}
