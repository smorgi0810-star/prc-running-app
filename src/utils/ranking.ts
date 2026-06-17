export function paceSec(pace: string): number {
  const [m, s] = pace.split(":").map(Number);
  return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : 9999;
}

export function paceText(sec: number): string {
  return sec >= 9999 ? "-" : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
