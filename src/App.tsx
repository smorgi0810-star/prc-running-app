import React, { useEffect, useMemo, useState } from "react";

type TabKey = "home" | "feed" | "schedule" | "gallery" | "dashboard" | "members" | "profile" | "admin" | "login";
type CalendarType = "solar" | "lunar";

type User = {
  id: string;
  loginId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  nickname: string;
  role: string;
  bloodType: string;
  mbti: string;
  profileImage: string;
  profileImageScale: number;
  profileImageX: number;
  profileImageY: number;
  birthdayCalendar: CalendarType;
  birthdayYear: string;
  birthdayMonth: string;
  birthdayDay: string;
  marathonGoalCount: number;
  monthlyGoalKm: number;
  marathonGoalDistance: string;
  marathonGoalTime: string;
  isApproved: boolean;
  isAdmin: boolean;
  shirtSize?: string;
  pantsSize?: string;
  shoeSize?: string;
};

type RunRecord = {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  distanceKm: number;
  pace: string;
  durationMinutes: number;
  avgHeartRate: number;
  image: string;
  memo: string;
  hashtags: string[];
};

type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
};

type FeedPost = {
  id: string;
  userId: string;
  date: string;
  content: string;
  image: string;
  mediaType?: "image" | "video";
  hashtags: string[];
  likes: string[];
  comments: Comment[];
  runRecordId: string;
};

type RunEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  mapUrl: string;
  description: string;
  attendees: string[];
};

type GalleryPhoto = {
  id: string;
  image: string;
  uploadedBy: string;
  uploadedAt: string;
  caption: string;
};

type HeroSlide = {
  id: string;
  image: string;
  uploadedAt: string;
};

type TimelineSlide = {
  id: string;
  month: string;
  title: string;
  description: string;
  image: string;
};

type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
};

type AppState = {
  users: User[];
  runRecords: RunRecord[];
  feedPosts: FeedPost[];
  runEvents: RunEvent[];
  galleryPhotos: GalleryPhoto[];
  heroSlides: HeroSlide[];
  timelineSlides: TimelineSlide[];
  notices: Notice[];
};

const STORAGE_KEY = "prc_running_crew_final_v3";
const SESSION_KEY = "prc_running_crew_session_final_v1";
const FINISHER_ICON = "🏁";

const img = {
  run1: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1400&auto=format&fit=crop",
  run2: "https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=1400&auto=format&fit=crop",
  run3: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1400&auto=format&fit=crop",
  run4: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1400&auto=format&fit=crop",
  profile1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  profile2: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
  profile3: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  profile4: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
};

const PRC_LOGO_DATA_URL = "data:image/webp;base64,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";

const koreanHolidays = [
  "2026-01-01", "2026-02-16", "2026-02-17", "2026-02-18", "2026-03-01", "2026-05-05", "2026-05-24", "2026-06-06", "2026-08-15", "2026-09-24", "2026-09-25", "2026-09-26", "2026-10-03", "2026-10-09", "2026-12-25",
];

const defaultUsers: User[] = [
  { id: "u_admin", loginId: "admin", password: "1234", name: "PRC Admin", email: "admin@prc.com", phone: "010-0000-0000", nickname: "운영자", role: "관리자", bloodType: "O", mbti: "ENTJ", profileImage: img.profile1, profileImageScale: 1, profileImageX: 0, profileImageY: 0, birthdayCalendar: "solar", birthdayYear: "1985", birthdayMonth: "05", birthdayDay: "20", marathonGoalCount: 2, monthlyGoalKm: 120, marathonGoalDistance: "Half", marathonGoalTime: "1:55:00", isApproved: true, isAdmin: true },
  { id: "u_01", loginId: "runner01", password: "1234", name: "Runner K", email: "runner01@prc.com", phone: "010-1111-1111", nickname: "새벽런 마스터", role: "Crew Leader", bloodType: "A", mbti: "ENFJ", profileImage: img.profile1, profileImageScale: 1, profileImageX: 0, profileImageY: 0, birthdayCalendar: "solar", birthdayYear: "1988", birthdayMonth: "05", birthdayDay: "11", marathonGoalCount: 3, monthlyGoalKm: 100, marathonGoalDistance: "Half", marathonGoalTime: "1:50:00", isApproved: true, isAdmin: false },
  { id: "u_02", loginId: "runner02", password: "1234", name: "Runner J", email: "runner02@prc.com", phone: "010-2222-2222", nickname: "한강 페이서", role: "Pacer", bloodType: "B", mbti: "ISTJ", profileImage: img.profile2, profileImageScale: 1, profileImageX: 0, profileImageY: 0, birthdayCalendar: "lunar", birthdayYear: "1990", birthdayMonth: "05", birthdayDay: "18", marathonGoalCount: 2, monthlyGoalKm: 90, marathonGoalDistance: "10K", marathonGoalTime: "0:50:00", isApproved: true, isAdmin: false },
  { id: "u_03", loginId: "runner03", password: "1234", name: "Runner C", email: "runner03@prc.com", phone: "010-3333-3333", nickname: "우중런 전설", role: "Member", bloodType: "AB", mbti: "INFP", profileImage: img.profile3, profileImageScale: 1, profileImageX: 0, profileImageY: 0, birthdayCalendar: "solar", birthdayYear: "1992", birthdayMonth: "05", birthdayDay: "05", marathonGoalCount: 1, monthlyGoalKm: 70, marathonGoalDistance: "10K", marathonGoalTime: "0:58:00", isApproved: true, isAdmin: false },
];

const defaultRecords: RunRecord[] = [
  { id: "r01", userId: "u_01", date: "2026-05-01", startTime: "05:30", distanceKm: 10.2, pace: "5:28", durationMinutes: 56, avgHeartRate: 148, image: img.run1, memo: "5월 첫 러닝. 공기가 완벽했다.", hashtags: ["야간런", "한강런", "PRC"] },
  { id: "r02", userId: "u_02", date: "2026-05-03", startTime: "07:00", distanceKm: 15, pace: "6:10", durationMinutes: 93, avgHeartRate: 142, image: img.run2, memo: "주말 LSD 완료.", hashtags: ["주말런", "LSD", "커피런"] },
  { id: "r03", userId: "u_03", date: "2026-05-05", startTime: "21:30", distanceKm: 8.4, pace: "6:01", durationMinutes: 51, avgHeartRate: 151, image: img.run3, memo: "비 오는 날에도 뛰었다.", hashtags: ["우중런", "Midnight", "PRC"] },
  { id: "r04", userId: "u_01", date: "2026-05-08", startTime: "22:00", distanceKm: 21.1, pace: "5:40", durationMinutes: 119, avgHeartRate: 156, image: img.run4, memo: "하프 완주!", hashtags: ["마라톤", "완주", "PB"] },
  { id: "r05", userId: "u_02", date: "2026-04-20", startTime: "06:30", distanceKm: 12.4, pace: "5:55", durationMinutes: 73, avgHeartRate: 144, image: img.run2, memo: "4월 장거리", hashtags: ["LSD", "PRC"] },
];

const defaultComments: Comment[] = [
  { id: "c01", postId: "p01", userId: "u_02", content: "사진 감성 미쳤다 🔥", createdAt: "2026-05-01T08:30:00", likes: ["u_01"] },
  { id: "c02", postId: "p01", userId: "u_03", content: "다음에는 같이 뛰자!", createdAt: "2026-05-01T09:10:00", likes: [] },
];

const defaultState: AppState = {
  users: defaultUsers,
  runRecords: defaultRecords,
  feedPosts: [
    { id: "p01", userId: "u_01", date: "2026-05-01", content: "1주년을 앞두고 다시 달리기 시작. 오늘 공기 완벽했다🔥", image: img.run1, hashtags: ["야간런", "한강런", "PRC"], likes: ["u_02", "u_03"], comments: defaultComments, runRecordId: "r01" },
    { id: "p02", userId: "u_02", date: "2026-05-03", content: "천천히 오래 달린 날. 끝나고 먹은 커피가 진짜 보상.", image: img.run2, hashtags: ["주말런", "LSD", "커피런"], likes: ["u_01"], comments: [], runRecordId: "r02" },
    { id: "p03", userId: "u_03", date: "2026-05-05", content: "비가 와도 PRC는 멈추지 않는다.", image: img.run3, hashtags: ["우중런", "PRC"], likes: ["u_01"], comments: [], runRecordId: "r03" },
    { id: "p04", userId: "u_01", date: "2026-05-08", content: "하프 완주 완료. PRC 1주년 선물 같은 기록!", image: img.run4, hashtags: ["마라톤", "완주", "PB"], likes: ["u_02", "u_03"], comments: [], runRecordId: "r04" },
  ],
  runEvents: [
    { id: "e01", title: "1주년 대비 단체런", date: "2026-05-11", time: "07:00", location: "한강공원", mapUrl: "https://map.naver.com/", description: "1주년 전 마지막 단체 훈련", attendees: ["u_01", "u_02", "u_03"] },
    { id: "e02", title: "기념 사진 촬영런", date: "2026-05-18", time: "06:30", location: "탄천 코스", mapUrl: "https://www.google.com/maps", description: "단체 사진 촬영 예정", attendees: ["u_01", "u_02"] },
    { id: "e03", title: "PRC 1주년", date: "2026-05-20", time: "20:00", location: "온라인 공개", mapUrl: "", description: "1주년 홈페이지 오픈", attendees: ["u_01", "u_02", "u_03"] },
  ],
  galleryPhotos: [
    { id: "g01", image: img.run3, uploadedBy: "u_01", uploadedAt: "2026-05-08T08:00:00", caption: "우리의 새벽" },
    { id: "g02", image: img.run1, uploadedBy: "u_02", uploadedAt: "2026-05-07T08:00:00", caption: "한강 단체런" },
    { id: "g03", image: img.run2, uploadedBy: "u_03", uploadedAt: "2026-05-06T08:00:00", caption: "주말 LSD" },
    { id: "g04", image: img.run4, uploadedBy: "u_01", uploadedAt: "2026-05-05T08:00:00", caption: "기념 러닝" },
  ],
  heroSlides: [
    { id: "h01", image: img.run3, uploadedAt: "2026-05-01T08:00:00" },
    { id: "h02", image: img.run1, uploadedAt: "2026-05-02T08:00:00" },
    { id: "h03", image: img.run2, uploadedAt: "2026-05-03T08:00:00" },
  ],
  timelineSlides: [
    { id: "tl01", month: "2025.05", title: "PRC 시작", description: "처음 함께 달린 날, 모든 기록이 시작됐다.", image: img.run3 },
    { id: "tl02", month: "2025.08", title: "첫 여름 챌린지", description: "무더운 여름에도 멈추지 않은 우리.", image: img.run1 },
    { id: "tl03", month: "2025.11", title: "첫 대회 참가", description: "함께 뛰니 기록보다 추억이 먼저 남았다.", image: img.run2 },
    { id: "tl04", month: "2026.05", title: "1주년", description: "365 Days Running Together.", image: img.run4 },
  ],
  notices: [
    { id: "n01", title: "5월 20일 PRC 1주년", content: "1년간 함께 달린 기록을 홈페이지로 공유합니다.", category: "공지", pinned: true },
    { id: "n02", title: "Memory Gallery 업로드", content: "각자 가지고 있는 베스트 러닝 사진을 등록해주세요.", category: "사진", pinned: false },
    { id: "n03", title: "정기런 참석 체크", content: "Schedule에서 참석하기를 눌러 참석자를 확인할 수 있습니다.", category: "일정", pinned: false },
  ],
};

const productionEmptyState: AppState = {
  users: [
    {
      id: "u_admin",
      loginId: "admin",
      password: "1234",
      name: "PRC Admin",
      email: "admin@prc.com",
      phone: "",
      nickname: "운영자",
      role: "관리자",
      bloodType: "",
      mbti: "",
      profileImage: "",
      profileImageScale: 1,
      profileImageX: 0,
      profileImageY: 0,
      birthdayCalendar: "solar",
      birthdayYear: "1990",
      birthdayMonth: "01",
      birthdayDay: "01",
      marathonGoalCount: 0,
      monthlyGoalKm: 0,
      marathonGoalDistance: "",
      marathonGoalTime: "",
      isApproved: true,
      isAdmin: true,
      shirtSize: "",
      pantsSize: "",
      shoeSize: "",
    },
  ],
  runRecords: [],
  feedPosts: [],
  runEvents: [],
  galleryPhotos: [],
  heroSlides: [],
  timelineSlides: [
    { id: "tl01", month: "2025.05", title: "PRC 시작", description: "처음 함께 달린 날, 모든 기록이 시작됐다.", image: "" },
    { id: "tl02", month: "2025.08", title: "첫 여름 챌린지", description: "무더운 여름에도 멈추지 않은 우리.", image: "" },
    { id: "tl03", month: "2025.11", title: "첫 대회 참가", description: "함께 뛰니 기록보다 추억이 먼저 남았다.", image: "" },
    { id: "tl04", month: "2026.05", title: "1주년", description: "365 Days Running Together.", image: "" },
  ],
  notices: [],
};

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function now(): string {
  return new Date().toISOString();
}
function cn(...v: Array<string | false | undefined>): string {
  return v.filter(Boolean).join(" ");
}
function parse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("localStorage 저장 용량을 초과했거나 저장에 실패했습니다.", error);
  }
}
function getUser(list: User[], userId: string): User | undefined {
  return list.find((u) => u.id === userId);
}
function monthOf(date: string): string {
  return date.slice(0, 7);
}
function yearOf(date: string): string {
  return date.slice(0, 4);
}
function weekday(date: string): number {
  return new Date(`${date}T00:00:00`).getDay();
}
function duration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}시간 ${m}분` : `${m}분`;
}
function paceSec(pace: string): number {
  const [m, s] = pace.split(":").map(Number);
  return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : 9999;
}
function paceText(sec: number): string {
  return sec >= 9999 ? "-" : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
function bestPace(records: RunRecord[]): string {
  return paceText(Math.min(...records.map((r) => paceSec(r.pace)), 9999));
}
function avgPace(records: RunRecord[]): string {
  const valid = records.map((r) => paceSec(r.pace)).filter((v) => v < 9999);
  return valid.length ? paceText(Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)) : "-";
}
function minutesLabel(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}
function normalizeUrl(url: string): string {
  if (!url.trim()) return "";
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
}
function monthDays(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const arr: string[] = [];
  for (let i = 0; i < first.getDay(); i += 1) arr.push("");
  for (let d = 1; d <= last.getDate(); d += 1) arr.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  while (arr.length % 7) arr.push("");
  return arr;
}
function daysInMonth(year: string, month: string): number {
  return new Date(Number(year), Number(month), 0).getDate();
}
function fileToDataUrl(file?: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const maxWidth = 1600;
          const scale = Math.min(1, maxWidth / image.width);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(String(reader.result || ""));
            return;
          }

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        image.onerror = reject;
        image.src = String(reader.result || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function showPicker(e: React.FocusEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>): void {
  const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
  try {
    el.showPicker?.();
  } catch {
    // fallback: browser default
  }
}
function readState(): AppState {
  const s = parse<AppState>(localStorage.getItem(STORAGE_KEY), productionEmptyState);
  return {
    ...productionEmptyState,
    ...s,
    users: (s.users || productionEmptyState.users).map((u) => ({
      ...u,
      email: u.email || "",
      phone: u.phone || "",
      birthdayCalendar: u.birthdayCalendar || "solar",
      birthdayYear: u.birthdayYear || "1990",
      birthdayMonth: u.birthdayMonth || "01",
      birthdayDay: u.birthdayDay || "01",
      profileImageScale: u.profileImageScale || 1,
      profileImageX: u.profileImageX || 0,
      profileImageY: u.profileImageY || 0,
      shirtSize: u.shirtSize || "",
      pantsSize: u.pantsSize || "",
      shoeSize: u.shoeSize || "",
    })),
    feedPosts: (s.feedPosts || productionEmptyState.feedPosts).map((p) => ({
      ...p,
      comments: (p.comments || []).map((c) => ({ ...c, likes: c.likes || [] })),
      likes: p.likes || [],
      hashtags: p.hashtags || [],
    })),
    runEvents: s.runEvents || productionEmptyState.runEvents,
    galleryPhotos: s.galleryPhotos || productionEmptyState.galleryPhotos,
    heroSlides: s.heroSlides || productionEmptyState.heroSlides,
    timelineSlides: s.timelineSlides || productionEmptyState.timelineSlides,
    notices: s.notices || productionEmptyState.notices,
  };
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20", className)}>{children}</div>;
}
function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><div className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-lime-300">{eyebrow}</div><h2 className="text-2xl font-black tracking-tight text-white md:text-4xl">{title}</h2></div>{desc && <p className="max-w-2xl text-sm leading-6 text-zinc-400">{desc}</p>}</div>;
}
function Pill({ children, tone = "default", outline = false, className = "" }: { children: React.ReactNode; tone?: "default" | "lime" | "rose" | "sky" | "amber"; outline?: boolean; className?: string }) {
  const cls = outline ? "border border-lime-300 bg-transparent text-white" : tone === "lime" ? "bg-lime-300 text-zinc-950" : tone === "rose" ? "bg-rose-500 text-white" : tone === "sky" ? "bg-sky-400 text-zinc-950" : tone === "amber" ? "bg-amber-300 text-zinc-950" : "bg-white/10 text-zinc-300";
  return <span className={cn("inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black", cls, className)}>{children}</span>;
}
function Stat({ icon, label, value, sub, tone = "default", compact = false }: { icon: string; label: string; value: string; sub?: string; tone?: "default" | "lime" | "rose" | "sky" | "amber"; compact?: boolean }) {
  const toneClass = tone === "lime" ? "from-lime-300/25 to-emerald-500/10" : tone === "rose" ? "from-rose-400/25 to-orange-500/10" : tone === "sky" ? "from-sky-400/25 to-cyan-500/10" : tone === "amber" ? "from-amber-300/25 to-orange-500/10" : "from-white/10 to-white/[0.03]";
  return <div className={cn("relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br transition hover:-translate-y-1", toneClass, compact ? "min-h-[116px] p-5" : "min-h-[128px] p-5")}>
    <div className="relative z-10 pr-20">
      <div className={cn("font-black", compact ? "text-2xl" : "text-3xl")}>{value}</div>
      <div className="mt-1 text-sm font-bold text-zinc-300">{label}</div>
      {sub && <div className="mt-2 text-xs text-zinc-500">{sub}</div>}
    </div>
    <div className={cn("absolute right-5 top-1/2 -translate-y-1/2 select-none opacity-90 drop-shadow-2xl", compact ? "text-5xl" : "text-6xl")}>{icon}</div>
  </div>;
}
function Input({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  // 모바일 안정화:
  // date/month input은 모바일 브라우저가 자체 Picker를 자동으로 띄운다.
  // showPicker()를 onFocus/onClick에서 강제 호출하면, 사용자가 변경 없이 닫을 때 일부 모바일 브라우저에서 포커스 루프/정지 현상이 생길 수 있어 제거한다.
  return <label className="block"><span className="mb-2 block text-xs font-black text-zinc-400">{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime-300" /></label>;
}
function SelectInput({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-black text-zinc-400">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none focus:border-lime-300">{children}</select></label>;
}
function Textarea({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-black text-zinc-400">{label}</span><textarea value={value} placeholder={placeholder} rows={4} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime-300" /></label>;
}
function Avatar({ user, size = "md", finisher = false }: { user?: User; size?: "sm" | "md" | "lg" | "xl"; finisher?: boolean }) {
  const s = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-24 w-24" : size === "xl" ? "h-44 w-44" : "h-12 w-12";
  return <div className={cn("relative shrink-0", s)}><div className={cn("overflow-hidden rounded-full border border-white/15 bg-zinc-800", s)}>{user?.profileImage ? <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" style={{ transform: `translate(${user.profileImageX}px, ${user.profileImageY}px) scale(${user.profileImageScale})` }} /> : <div className="flex h-full w-full items-center justify-center">👤</div>}</div>{finisher && <div className="absolute -bottom-1 -right-1 rounded-full bg-lime-300 px-1.5 py-0.5 text-xs">{FINISHER_ICON}</div>}</div>;
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-zinc-500">{text}</div>;
}
function YearMonthPicker({ year, month, onYear, onMonth }: { year: string; month: string; onYear: (v: string) => void; onMonth: (v: string) => void }) {
  const years = Array.from({ length: 9 }, (_, i) => String(2023 + i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  return <div className="grid grid-cols-2 gap-3">
    <SelectInput label="년도 선택" value={year} onChange={onYear}>{years.map((y) => <option key={y} value={y}>{y}년</option>)}</SelectInput>
    <SelectInput label="월 선택" value={month} onChange={onMonth}>{months.map((m) => <option key={m} value={m}>{Number(m)}월</option>)}</SelectInput>
  </div>;
}
function MetricRankingCard({ title, rows, unit }: { title: string; rows: Array<{ user: User; value: string | number; raw: number }>; unit?: string }) {
  const valid = rows.filter((r) => r.raw > 0 || String(r.value) !== "0");
  return <Card className="p-5">
    <h3 className="text-lg font-black">{title}</h3>
    <div className="mt-4 grid gap-3">
      {valid.length ? valid.slice(0, 3).map((r, i) => <div key={`${title}_${r.user.id}`} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 text-sm font-black text-zinc-950">{i + 1}</div>
        <Avatar user={r.user} size="sm" />
        <div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{r.user.nickname}</div><div className="text-xs text-zinc-500">{r.user.name}</div></div>
        <div className="text-right text-lg font-black text-lime-300">{r.value}{unit || ""}</div>
      </div>) : <Empty text="해당 기간 데이터 없음" />}
    </div>
  </Card>;
}

export default function PRCRunningCrewFinalApp() {
  const [state, setState] = useState<AppState>(() => readState());
  const [tab, setTab] = useState<TabKey>(localStorage.getItem(SESSION_KEY) ? "home" : "login");
  const [session, setSession] = useState(localStorage.getItem(SESSION_KEY) || "");
  const [msg, setMsg] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [auth, setAuth] = useState({ name: "", email: "", phone: "", loginId: "", password: "", passwordConfirm: "" });
  const [hero, setHero] = useState(0);
  const [calendarYear, setCalendarYear] = useState("2026");
  const [calendarMonthOnly, setCalendarMonthOnly] = useState("05");
  const [dashboardYear, setDashboardYear] = useState("2026");
  const [dashboardMonthOnly, setDashboardMonthOnly] = useState("05");
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [feedSearch, setFeedSearch] = useState("");
  const [feedImage, setFeedImage] = useState("");
  const [feedMediaType, setFeedMediaType] = useState<"image" | "video">("image");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [selectedEvent, setSelectedEvent] = useState<RunEvent | null>(null);
  const [birthdayModal, setBirthdayModal] = useState<{ date: string; users: User[] } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("u_01");
  const [galleryForm, setGalleryForm] = useState({ image: "", caption: "" });
  const [galleryPreview, setGalleryPreview] = useState<GalleryPhoto | null>(null);
  const [heroImage, setHeroImage] = useState("");
  const [profile, setProfile] = useState<User | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [recordForm, setRecordForm] = useState({ date: today(), distanceKm: "6", pace: "6:30", durationMinutes: "39", avgHeartRate: 145, startMinutes: 390, memo: "", hashtags: "PRC, 한강런" });
  const [eventForm, setEventForm] = useState({ title: "", date: "2026-05-20", ampm: "AM", hour: "07", minute: "00", location: "", mapUrl: "", description: "" });

  const calendarMonth = `${calendarYear}-${calendarMonthOnly}`;
  const dashboardMonth = `${dashboardYear}-${dashboardMonthOnly}`;
  const currentUser = useMemo(() => getUser(state.users, session), [state.users, session]);
  const approvedUsers = useMemo(() => state.users.filter((u) => u.isApproved), [state.users]);
  const pendingUsers = useMemo(() => state.users.filter((u) => !u.isApproved), [state.users]);

  useEffect(() => save(state), [state]);
  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, session);
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);
  useEffect(() => {
    if (currentUser && !profile) setProfile(currentUser);
    if (!currentUser) setProfile(null);
  }, [currentUser, profile]);

  useEffect(() => {
    if (!currentUser && tab !== "login") {
      setTab("login");
    }
  }, [currentUser, tab]);
  useEffect(() => {
    const len = Math.min(state.heroSlides.length, 5);
    if (!len) return;
    const t = window.setInterval(() => setHero((v) => (v + 1) % len), 4000);
    return () => window.clearInterval(t);
  }, [state.heroSlides.length]);

  function toast(text: string): void {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 2300);
  }

  function goTab(key: TabKey): void {
    if (!currentUser && key !== "login") {
      setTab("login");
    } else {
      setTab(key);
    }
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  function patch(next: AppState | ((prev: AppState) => AppState)): void {
    setState((prev) => typeof next === "function" ? (next as (p: AppState) => AppState)(prev) : next);
  }
  function login(): void {
    const u = state.users.find((x) => x.loginId === auth.loginId && x.password === auth.password);
    if (!u) return toast("아이디 또는 비밀번호가 맞지 않습니다.");
    if (!u.isApproved) return toast("관리자 승인 대기 중입니다.");
    setSession(u.id);
    localStorage.setItem(SESSION_KEY, u.id);
    setProfile(u);
    setTab("home");
    toast(`${u.name}님 환영합니다.`);
  }
  function signup(): void {
    if (!auth.name || !auth.email || !auth.phone || !auth.loginId || !auth.password || !auth.passwordConfirm) return toast("회원가입 항목을 모두 입력해주세요.");
    if (auth.password !== auth.passwordConfirm) return toast("비밀번호 확인이 일치하지 않습니다.");
    if (state.users.some((u) => u.loginId === auth.loginId)) return toast("이미 사용 중인 아이디입니다.");
    const u: User = { id: uid("u"), loginId: auth.loginId, password: auth.password, name: auth.name, email: auth.email, phone: auth.phone, nickname: "New Runner", role: "Member", bloodType: "", mbti: "", profileImage: img.profile4, profileImageScale: 1, profileImageX: 0, profileImageY: 0, birthdayCalendar: "solar", birthdayYear: "1990", birthdayMonth: "01", birthdayDay: "01", marathonGoalCount: 1, monthlyGoalKm: 50, marathonGoalDistance: "10K", marathonGoalTime: "1:00:00", isApproved: false, isAdmin: false, shirtSize: "", pantsSize: "", shoeSize: "" };
    patch((p) => ({ ...p, users: [...p.users, u] }));
    setAuthMode("login");
    toast("회원가입 완료. 관리자 승인 후 로그인 가능합니다.");
  }
  function logout(): void {
    // Logout 안정화: confirm 없이 즉시 세션 상태와 localStorage를 동시에 초기화
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("prc_running_crew_session_final_v1");
    sessionStorage.removeItem(SESSION_KEY);
    setSession("");
    setProfile(null);
    setTab("login");
    setMsg("로그아웃되었습니다.");
    window.setTimeout(() => setMsg(""), 1800);
  }
  async function upload(file: File | undefined, cb: (url: string) => void): Promise<void> {
    const url = await fileToDataUrl(file);
    if (url) cb(url);
  }

  async function uploadFeedMedia(file: File | undefined): Promise<void> {
    if (!file) return;

    if (file.type.startsWith("video/")) {
      const maxVideoSize = 80 * 1024 * 1024;
      if (file.size > maxVideoSize) {
        toast("동영상은 80MB 이하만 업로드할 수 있습니다.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setFeedImage(objectUrl);
      setFeedMediaType("video");
      toast("동영상이 첨부되었습니다. 현재 localStorage 버전에서는 새로고침 후 영상이 유지되지 않을 수 있습니다.");
      return;
    }

    if (file.type.startsWith("image/")) {
      const url = await fileToDataUrl(file);
      if (url) {
        setFeedImage(url);
        setFeedMediaType("image");
      }
      return;
    }

    toast("이미지 또는 동영상 파일만 업로드할 수 있습니다.");
  }
  function approve(userId: string): void {
    patch((p) => ({ ...p, users: p.users.map((u) => u.id === userId ? { ...u, isApproved: true } : u) }));
    toast("회원 승인이 완료되었습니다.");
  }
  function eventTime(): string {
    let h = Number(eventForm.hour);
    if (eventForm.ampm === "PM" && h < 12) h += 12;
    if (eventForm.ampm === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${eventForm.minute}`;
  }
  function saveEvent(): void {
    if (!currentUser) return setTab("login");
    if (!eventForm.title || !eventForm.date || !eventForm.location) return toast("일정명, 날짜, 장소를 입력해주세요.");
    const time = eventTime();
    if (editEventId) {
      patch((p) => ({ ...p, runEvents: p.runEvents.map((e) => e.id === editEventId ? { ...e, title: eventForm.title, date: eventForm.date, time, location: eventForm.location, mapUrl: eventForm.mapUrl, description: eventForm.description } : e) }));
      setEditEventId(null);
      toast("일정이 수정되었습니다.");
    } else {
      patch((p) => ({ ...p, runEvents: [{ id: uid("e"), title: eventForm.title, date: eventForm.date, time, location: eventForm.location, mapUrl: eventForm.mapUrl, description: eventForm.description, attendees: [currentUser.id] }, ...p.runEvents] }));
      toast("일정이 등록되었습니다.");
    }
    setEventForm({ title: "", date: today(), ampm: "AM", hour: "07", minute: "00", location: "", mapUrl: "", description: "" });
  }
  function editEvent(e: RunEvent): void {
    const h = Number(e.time.slice(0, 2));
    setEditEventId(e.id);
    setEventForm({ title: e.title, date: e.date, ampm: h >= 12 ? "PM" : "AM", hour: String(h % 12 || 12).padStart(2, "0"), minute: e.time.slice(3, 5), location: e.location, mapUrl: e.mapUrl, description: e.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleAttend(eventId: string): void {
    if (!currentUser) return setTab("login");
    patch((p) => ({ ...p, runEvents: p.runEvents.map((e) => {
      if (e.id !== eventId) return e;
      const on = e.attendees.includes(currentUser.id);
      return { ...e, attendees: on ? e.attendees.filter((x) => x !== currentUser.id) : [...e.attendees, currentUser.id] };
    }) }));
    setSelectedEvent((e) => e && e.id === eventId ? { ...e, attendees: e.attendees.includes(currentUser.id) ? e.attendees.filter((x) => x !== currentUser.id) : [...e.attendees, currentUser.id] } : e);
  }
  function addFeed(): void {
    if (!currentUser) return setTab("login");
    if (!feedImage) return toast("사진을 첨부해주세요.");
    const tags = recordForm.hashtags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean);
    const rid = uid("r");
    const rec: RunRecord = { id: rid, userId: currentUser.id, date: recordForm.date, startTime: minutesLabel(Number(recordForm.startMinutes)), distanceKm: Number(recordForm.distanceKm), pace: recordForm.pace, durationMinutes: Number(recordForm.durationMinutes), avgHeartRate: Number(recordForm.avgHeartRate), image: feedImage, memo: recordForm.memo, hashtags: tags };
    const post: FeedPost = { id: uid("p"), userId: currentUser.id, date: recordForm.date, content: recordForm.memo || "오늘도 PRC와 함께 달렸습니다.", image: feedImage, mediaType: feedMediaType, hashtags: tags, likes: [], comments: [], runRecordId: rid };
    patch((p) => ({ ...p, runRecords: [rec, ...p.runRecords], feedPosts: [post, ...p.feedPosts] }));
    setFeedImage("");
    setFeedMediaType("image");
    setRecordForm({ date: today(), distanceKm: "6", pace: "6:30", durationMinutes: "39", avgHeartRate: 145, startMinutes: 390, memo: "", hashtags: "PRC" });
    setShowFeedForm(false);
    toast("피드가 등록되었습니다.");
  }
  function likePost(postId: string): void {
    if (!currentUser) return setTab("login");
    patch((p) => ({ ...p, feedPosts: p.feedPosts.map((post) => post.id === postId ? { ...post, likes: post.likes.includes(currentUser.id) ? post.likes.filter((x) => x !== currentUser.id) : [...post.likes, currentUser.id] } : post) }));
  }
  function addComment(postId: string): void {
    if (!currentUser) return setTab("login");
    const content = (commentDrafts[postId] || "").trim();
    if (!content) return;
    const c: Comment = { id: uid("c"), postId, userId: currentUser.id, content, createdAt: now(), likes: [] };
    patch((p) => ({ ...p, feedPosts: p.feedPosts.map((post) => post.id === postId ? { ...post, comments: [...post.comments, c] } : post) }));
    setCommentDrafts((p) => ({ ...p, [postId]: "" }));
  }
  function likeComment(postId: string, commentId: string): void {
    if (!currentUser) return setTab("login");
    patch((p) => ({ ...p, feedPosts: p.feedPosts.map((post) => post.id === postId ? { ...post, comments: post.comments.map((c) => c.id === commentId ? { ...c, likes: c.likes.includes(currentUser.id) ? c.likes.filter((x) => x !== currentUser.id) : [...c.likes, currentUser.id] } : c) } : post) }));
  }
  function addGallery(): void {
    if (!currentUser) return setTab("login");
    if (!galleryForm.image) return toast("사진을 첨부해주세요.");
    patch((p) => ({ ...p, galleryPhotos: [{ id: uid("g"), image: galleryForm.image, uploadedBy: currentUser.id, uploadedAt: now(), caption: galleryForm.caption || "PRC Memory" }, ...p.galleryPhotos] }));
    setGalleryForm({ image: "", caption: "" });
    toast("Memory Gallery에 사진이 등록되었습니다.");
  }
  function addHero(): void {
    if (!currentUser?.isAdmin) return;
    if (!heroImage) return toast("이미지를 등록해주세요.");
    if (state.heroSlides.length >= 5) return toast("최대 5장까지 가능합니다. 기존 사진을 변경해주세요.");
    patch((p) => ({ ...p, heroSlides: [{ id: uid("h"), image: heroImage, uploadedAt: now() }, ...p.heroSlides].slice(0, 5) }));
    setHeroImage("");
    toast("Hero 슬라이드가 신규 등록되었습니다.");
  }
  function replaceHeroSlide(heroId: string, image: string): void {
    if (!currentUser?.isAdmin || !image) return;
    patch((p) => ({ ...p, heroSlides: p.heroSlides.map((h) => h.id === heroId ? { ...h, image, uploadedAt: now() } : h) }));
    toast("Hero 슬라이드 사진이 변경되었습니다.");
  }
  function replaceTimelineSlide(slideId: string, image: string): void {
    if (!currentUser?.isAdmin || !image) return;
    patch((p) => ({ ...p, timelineSlides: p.timelineSlides.map((slide) => slide.id === slideId ? { ...slide, image } : slide) }));
    toast("우리의 1년 사진이 변경되었습니다.");
  }
  function saveProfile(): void {
    if (!profile || !currentUser) return;
    patch((p) => ({ ...p, users: p.users.map((u) => u.id === currentUser.id ? { ...profile, id: currentUser.id, loginId: currentUser.loginId, password: currentUser.password, isAdmin: currentUser.isAdmin, isApproved: currentUser.isApproved } : u) }));
    toast("프로필이 저장되었습니다.");
  }
  function reset(): void {
    if (!window.confirm("전체 데이터를 초기화하시겠습니까? 회원정보, 피드, 러닝 기록, 일정, 사진첩, Hero, 갤러리 데이터가 모두 삭제되고 관리자 계정만 남습니다.")) return;

    const keysToRemove = [
      STORAGE_KEY,
      SESSION_KEY,
      "prc_running_crew_final_v1",
      "prc_running_crew_final_v2",
      "prc_running_crew_final_v3",
      "prc_running_crew_session_final_v1",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(productionEmptyState));
    setState(productionEmptyState);
    setSession("");
    setProfile(null);
    setAuth({ name: "", email: "", phone: "", loginId: "", password: "", passwordConfirm: "" });
    setGalleryForm({ image: "", caption: "" });
    setFeedImage("");
    setHeroImage("");
    setTab("login");
    toast("전체 데이터가 초기화되었습니다. 관리자 계정만 유지됩니다.");
  }
  function openMap(url: string, e?: React.MouseEvent): void {
    e?.stopPropagation();
    const target = normalizeUrl(url);
    if (!target) return;
    const w = window.open(target, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = target;
  }

  const heroSlides = state.heroSlides.slice(0, 5);
  const activeHero = heroSlides[hero] || heroSlides[0];
  const sortedGallery = [...state.galleryPhotos].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const homeGallery = sortedGallery.slice(0, 15);
  const crewStats = { totalKm: state.runRecords.reduce((s, r) => s + r.distanceKm, 0), totalRuns: state.runRecords.length, totalTime: state.runRecords.reduce((s, r) => s + r.durationMinutes, 0), totalLikes: state.feedPosts.reduce((s, p) => s + p.likes.length, 0), bestPace: bestPace(state.runRecords) };
  const myRecords = currentUser ? state.runRecords.filter((r) => r.userId === currentUser.id) : [];
  const myPosts = currentUser ? state.feedPosts.filter((p) => p.userId === currentUser.id) : [];
  const myStats = { totalKm: myRecords.reduce((s, r) => s + r.distanceKm, 0), totalRuns: myRecords.length, totalTime: myRecords.reduce((s, r) => s + r.durationMinutes, 0), bestPace: bestPace(myRecords), likes: myPosts.reduce((s, p) => s + p.likes.length, 0) };
  const recordsByDate = new Map<string, RunRecord[]>();
  state.runRecords.forEach((r) => recordsByDate.set(r.date, [...(recordsByDate.get(r.date) || []), r]));
  const eventsByDate = new Map<string, RunEvent[]>();
  state.runEvents.forEach((e) => eventsByDate.set(e.date, [...(eventsByDate.get(e.date) || []), e]));
  const birthdaysByDate = new Map<string, User[]>();
  approvedUsers.forEach((u) => {
    const d = `${calendarYear}-${u.birthdayMonth}-${u.birthdayDay}`;
    if (d.startsWith(calendarMonth)) birthdaysByDate.set(d, [...(birthdaysByDate.get(d) || []), u]);
  });
  const filteredPosts = state.feedPosts.filter((p) => {
    const q = feedSearch.toLowerCase().trim().replace(/^#/, "");
    if (!q) return true;
    const u = getUser(state.users, p.userId);
    return [u?.name, u?.nickname, p.content, ...p.hashtags].join(" ").toLowerCase().includes(q);
  });
  const dashboardRecords = state.runRecords.filter((r) => monthOf(r.date) === dashboardMonth);
  const dashboardPosts = state.feedPosts.filter((p) => monthOf(p.date) === dashboardMonth);
  const dashboardEvents = state.runEvents.filter((e) => monthOf(e.date) === dashboardMonth);
  const ranking = approvedUsers.map((u) => {
    const rs = state.runRecords.filter((r) => r.userId === u.id);
    const monthRs = rs.filter((r) => monthOf(r.date) === dashboardMonth);
    const ps = state.feedPosts.filter((p) => p.userId === u.id);
    return { user: u, records: rs, totalKm: rs.reduce((s, r) => s + r.distanceKm, 0), monthKm: monthRs.reduce((s, r) => s + r.distanceKm, 0), attend: state.runEvents.filter((e) => e.attendees.includes(u.id)).length, marathon: rs.filter((r) => r.hashtags.includes("마라톤") || r.hashtags.includes("완주")).length, posts: ps.length, comments: state.feedPosts.flatMap((p) => p.comments).filter((c) => c.userId === u.id).length, likes: ps.reduce((s, p) => s + p.likes.length, 0), time: rs.reduce((s, r) => s + r.durationMinutes, 0), avgPace: avgPace(rs), goalRate: u.monthlyGoalKm ? Math.min(100, Math.round((monthRs.reduce((s, r) => s + r.distanceKm, 0) / u.monthlyGoalKm) * 100)) : 0 };
  });
  const selected = ranking.find((r) => r.user.id === selectedUserId) || ranking[0];
  const periodRows = approvedUsers.map((u) => {
    const rs = dashboardRecords.filter((r) => r.userId === u.id);
    const ps = dashboardPosts.filter((p) => p.userId === u.id);
    const completed = rs.filter((r) => r.hashtags.includes("마라톤") || r.hashtags.includes("완주")).length;
    const bestDistance = Math.max(0, ...rs.map((r) => r.distanceKm));
    const bestPaceSeconds = Math.min(9999, ...rs.map((r) => paceSec(r.pace)));
    return {
      user: u,
      km: rs.reduce((s, r) => s + r.distanceKm, 0),
      time: rs.reduce((s, r) => s + r.durationMinutes, 0),
      attend: dashboardEvents.filter((e) => e.attendees.includes(u.id)).length,
      marathon: completed,
      bestDistance,
      bestPaceSeconds,
      feed: ps.length,
      likes: ps.reduce((s, p) => s + p.likes.length, 0),
    };
  });
  const dashRankings = {
    distance: [...periodRows].sort((a, b) => b.km - a.km).map((r) => ({ user: r.user, value: r.km.toFixed(1), raw: r.km })),
    time: [...periodRows].sort((a, b) => b.time - a.time).map((r) => ({ user: r.user, value: duration(r.time), raw: r.time })),
    attend: [...periodRows].sort((a, b) => b.attend - a.attend).map((r) => ({ user: r.user, value: r.attend, raw: r.attend })),
    marathon: [...periodRows].sort((a, b) => b.marathon - a.marathon).map((r) => ({ user: r.user, value: r.marathon, raw: r.marathon })),
    bestDistance: [...periodRows].sort((a, b) => b.bestDistance - a.bestDistance).map((r) => ({ user: r.user, value: r.bestDistance.toFixed(1), raw: r.bestDistance })),
    bestPace: [...periodRows].filter((r) => r.bestPaceSeconds < 9999).sort((a, b) => a.bestPaceSeconds - b.bestPaceSeconds).map((r) => ({ user: r.user, value: paceText(r.bestPaceSeconds), raw: 9999 - r.bestPaceSeconds })),
    feed: [...periodRows].sort((a, b) => b.feed - a.feed).map((r) => ({ user: r.user, value: r.feed, raw: r.feed })),
    likes: [...periodRows].sort((a, b) => b.likes - a.likes).map((r) => ({ user: r.user, value: r.likes, raw: r.likes })),
  };
  const nav: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "feed", label: "Feed", icon: "📸" },
    { key: "schedule", label: "Schedule", icon: "📅" },
    { key: "gallery", label: "Memory Gallery", icon: "🖼️" },
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "members", label: "Members", icon: "👥" },
    { key: "profile", label: "Profile", icon: "👤" },
    ...(currentUser?.isAdmin ? [{ key: "admin" as TabKey, label: "Admin", icon: "⚙️" }] : []),
  ];
  const birthYears = Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => String(1950 + i));
  const birthMonths = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const birthDays = profile ? Array.from({ length: daysInMonth(profile.birthdayYear, profile.birthdayMonth) }, (_, i) => String(i + 1).padStart(2, "0")) : [];
  const activeTab = currentUser ? tab : "login";

  return <div className="min-h-screen bg-[#08080c] text-white">
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(190,242,100,0.18),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(251,146,60,0.15),transparent_30%),linear-gradient(180deg,#09090b,#18181b_45%,#09090b)]" />
    {msg && <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 rounded-2xl border border-lime-300/30 bg-zinc-950/90 px-5 py-3 text-sm font-black text-lime-300 shadow-2xl">{msg}</div>}

    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => goTab("home")} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-transparent p-0 shadow-none"><img src={PRC_LOGO_DATA_URL} alt="PRC logo" className="h-full w-full object-contain" /></div>
            <div className="text-left"><div className="font-black leading-none">PRC</div><div className="text-xs font-bold text-zinc-500">Package Running Crew</div></div>
          </button>
          {currentUser ? <div className="flex items-center gap-2">
            <button onClick={() => goTab("profile")} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 transition hover:bg-white/10"><Avatar user={currentUser} size="sm" /><span className="hidden text-sm font-black sm:inline">{currentUser.nickname}</span></button>
            <button onClick={logout} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-lime-300">Logout</button>
          </div> : <button onClick={() => goTab("login")} className="rounded-2xl bg-lime-300 px-4 py-2 text-sm font-black text-zinc-950">Login</button>}
        </div>
        {currentUser && <nav className="hidden items-center justify-center gap-1 rounded-3xl border border-white/10 bg-white/[0.04] p-1 xl:flex">
          {nav.map((n) => <button key={n.key} onClick={() => goTab(n.key)} className={cn("flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition", activeTab === n.key ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-white/10 hover:text-white")}><span>{n.icon}</span>{n.label}</button>)}
        </nav>}
      </div>
    </header>

    <main className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:px-6">
      {activeTab === "home" && <>
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[440px] overflow-hidden rounded-[32px] bg-zinc-900">
              {activeHero && <img src={activeHero.image} alt="hero" className="absolute inset-0 h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
              <div className="relative z-10 flex min-h-[440px] flex-col justify-end p-7 md:p-10">
                <div className="inline-flex w-fit rounded-full bg-gradient-to-r from-lime-300/80 via-white/30 to-orange-300/70 p-[1px] shadow-[0_0_40px_rgba(190,242,100,0.28)]">
                  <div className="rounded-full border border-white/20 bg-zinc-950/55 px-6 py-3 text-base font-black tracking-[0.18em] text-white backdrop-blur-md md:text-lg">1st Anniversary · May 20</div>
                </div>
                <h1 className="mt-5 text-5xl font-black leading-[0.92] md:text-7xl">365 Days<br />Running Together</h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300 md:text-base">회사 동료 11명과 함께한 1년의 러닝 기록, 사진, 일정, 댓글, 칭호를 담은 PRC 전용 홈페이지입니다.</p>
                <div className="mt-7 flex gap-3"><button onClick={() => goTab("feed")} className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-zinc-950">피드 보기</button><button onClick={() => goTab("schedule")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black">일정 보기</button></div>
              </div>
              <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"><button onClick={() => setHero((hero - 1 + Math.max(heroSlides.length, 1)) % Math.max(heroSlides.length, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-2xl">‹</button><div className="flex gap-2">{heroSlides.map((h, i) => <button key={h.id} onClick={() => setHero(i)} className={cn("h-2 rounded-full transition-all", i === hero ? "w-10 bg-lime-300" : "w-2 bg-white/50")} />)}</div><button onClick={() => setHero((hero + 1) % Math.max(heroSlides.length, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-2xl">›</button></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Stat icon="🏃" label="총 러닝 횟수" value={`${crewStats.totalRuns}회`} sub="전체 멤버 합산" tone="lime" />
              <Stat icon="🔥" label="총 누적 거리" value={`${crewStats.totalKm.toFixed(1)}km`} sub="전체 멤버 합산" tone="amber" />
              <Stat icon="⏱️" label="총 러닝 타임" value={duration(crewStats.totalTime)} sub="전체 멤버 합산" tone="sky" />
              <Stat icon="⚡" label="베스트 페이스" value={crewStats.bestPace} sub="전체 기록 중 최고" tone="rose" />
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-7 lg:grid-cols-[1fr_1fr]">
          <div><SectionTitle eyebrow="Running Heatmap" title={`${calendarMonth} 활동`} desc="년도와 월을 선택하여 지난 월과 향후 월 활동을 확인합니다." />
            <Card className="p-5"><YearMonthPicker year={calendarYear} month={calendarMonthOnly} onYear={setCalendarYear} onMonth={setCalendarMonthOnly} />
              <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-black text-zinc-500">{["일","월","화","수","목","금","토"].map((d) => <div key={d}>{d}</div>)}</div>
              <div className="mt-2 grid grid-cols-7 gap-2">{monthDays(calendarMonth).map((date, i) => { const rs = date ? recordsByDate.get(date) || [] : []; const km = rs.reduce((s, r) => s + r.distanceKm, 0); const day = date ? weekday(date) : -1; const holiday = date ? koreanHolidays.includes(date) : false; const c = day === 0 || holiday ? "text-rose-300" : day === 6 ? "text-sky-300" : "text-zinc-300"; const bg = km >= 15 ? "bg-lime-300 text-zinc-950" : km >= 8 ? "bg-lime-300/60" : km > 0 ? "bg-lime-300/25" : "bg-white/[0.04]"; return <div key={`${date}_${i}`} className={cn("flex aspect-square items-center justify-center rounded-xl border border-white/5 text-xs font-black", date ? bg : "bg-transparent", date && !km ? c : "")}>{date ? Number(date.slice(-2)) : ""}</div>; })}</div>
            </Card>
          </div>
          <div><SectionTitle eyebrow="My Running Records" title="개인 기록 요약" desc="달력과 높이가 비슷하게 보이도록 컴팩트 카드로 정리했습니다." />
            <div className="grid gap-3"><Stat compact icon="🏁" label="총 러닝 횟수" value={`${myStats.totalRuns}회`} sub="내 기록" /><Stat compact icon="🛣️" label="총 누적 거리" value={`${myStats.totalKm.toFixed(1)}km`} sub="내 기록" /><Stat compact icon="⏳" label="총 러닝 타임" value={duration(myStats.totalTime)} sub="내 기록" /><Stat compact icon="⚡" label="베스트 페이스" value={myStats.bestPace} sub="내 최고 기록" /></div>
          </div>
        </section>

        <section className="mt-14"><SectionTitle eyebrow="Crew Notice" title="공지사항" desc="PRC 1주년과 주요 러닝 일정을 빠르게 확인합니다." /><div className="grid gap-4 md:grid-cols-3">{state.notices.map((n) => <Card key={n.id} className="p-5"><Pill tone={n.pinned ? "lime" : "default"}>{n.category}</Pill><h3 className="mt-4 text-lg font-black">{n.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{n.content}</p></Card>)}</div></section>
        <section className="mt-14"><SectionTitle eyebrow="Anniversary Timeline" title="우리의 1년" desc="관리자 모드에서 직접 등록/교체한 1주년 타임라인 사진입니다." /><div className="grid gap-5 md:grid-cols-4">{state.timelineSlides.map((x) => <Card key={x.id} className="overflow-hidden transition hover:-translate-y-2"><div className="relative h-48"><img src={x.image} className="h-full w-full object-cover" alt={x.title} /><div className="absolute left-4 top-4 rounded-full bg-lime-300 px-3 py-1 text-xs font-black text-zinc-950">1st</div></div><div className="p-5"><div className="text-3xl font-black text-lime-300">{x.month}</div><h3 className="mt-3 text-xl font-black">{x.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{x.description}</p></div></Card>)}</div></section>
        <section className="mt-10"><SectionTitle eyebrow="Memory Gallery" title="함께 달려온 PRC의 추억" desc="최신 사진 15장만 표시합니다. 전체 사진은 상단 Memory Gallery에서 확인하세요." /><div className="grid grid-cols-4 gap-3">{homeGallery.map((p, i) => <div key={p.id} className={cn("relative overflow-hidden rounded-3xl border border-white/10", i === 0 ? "col-span-4 md:col-span-2 md:row-span-2" : i < 5 ? "col-span-2" : "col-span-1")}><img src={p.image} alt={p.caption} className="h-full min-h-32 w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3"><div className="text-xs font-black">{p.caption}</div></div></div>)}</div></section>
      </>}

      {activeTab === "feed" && <section><SectionTitle eyebrow="Instagram Mood" title="Running Feed" desc="러닝 날짜는 클릭 시 브라우저 달력으로 선택됩니다." />
        <div className="mb-4 rounded-2xl border border-lime-300/20 bg-lime-300/[0.06] px-4 py-3 text-sm font-bold text-lime-100">🏁 마라톤 완주 인증사진과 함께 #마라톤, #완주 해시태그를 함께 사용하면 특별 배지가 부여됩니다.</div>
        <div className="mb-6 flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 md:flex-row"><button onClick={() => setShowFeedForm(!showFeedForm)} className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-zinc-950">✍️ 글쓰기</button><div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3"><span>🔍</span><input value={feedSearch} onChange={(e) => setFeedSearch(e.target.value)} placeholder="사람 이름, 별칭, 해시태그 검색" className="w-full bg-transparent text-sm outline-none" /></div></div>
        {showFeedForm && <Card className="mb-8 p-5"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Input label="거리(km)" type="number" value={recordForm.distanceKm} onChange={(v) => setRecordForm({ ...recordForm, distanceKm: v })} /><Input label="페이스" value={recordForm.pace} onChange={(v) => setRecordForm({ ...recordForm, pace: v })} placeholder="6:30" /><Input label="러닝 날짜" type="date" value={recordForm.date} onChange={(v) => setRecordForm({ ...recordForm, date: v })} /><Input label="러닝 시간(분)" type="number" value={recordForm.durationMinutes} onChange={(v) => setRecordForm({ ...recordForm, durationMinutes: v })} /></div><div className="mt-4 grid gap-4 md:grid-cols-2"><label><span className="mb-2 block text-xs font-black text-zinc-400">시작 시간: {minutesLabel(Number(recordForm.startMinutes))}</span><input type="range" min={0} max={1410} step={30} value={recordForm.startMinutes} onChange={(e) => setRecordForm({ ...recordForm, startMinutes: Number(e.target.value) })} className="w-full accent-lime-300" /></label><label><span className="mb-2 block text-xs font-black text-zinc-400">평균 심박수: {recordForm.avgHeartRate} bpm</span><input type="range" min={80} max={210} value={recordForm.avgHeartRate} onChange={(e) => setRecordForm({ ...recordForm, avgHeartRate: Number(e.target.value) })} className="w-full accent-rose-400" /></label></div><div className="mt-4 grid gap-4 md:grid-cols-2"><Textarea label="설명" value={recordForm.memo} onChange={(v) => setRecordForm({ ...recordForm, memo: v })} /><div className="grid gap-3"><Input label="해시태그" value={recordForm.hashtags} onChange={(v) => setRecordForm({ ...recordForm, hashtags: v })} placeholder="마라톤, 완주, PRC" /><label className="flex cursor-pointer justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">📎 사진/동영상 첨부<input className="hidden" type="file" accept="image/*,video/*" onChange={(e) => void uploadFeedMedia(e.target.files?.[0])} /></label></div></div>{feedImage && (feedMediaType === "video" ? <video src={feedImage} controls className="mt-4 max-h-80 w-full rounded-3xl object-cover" /> : <img src={feedImage} alt="preview" className="mt-4 max-h-80 w-full rounded-3xl object-cover" />)}<button onClick={addFeed} className="mt-5 w-full rounded-2xl bg-lime-300 px-5 py-4 text-sm font-black text-zinc-950">러닝 기록 등록</button></Card>}
        <div className="grid gap-6 md:grid-cols-2">{filteredPosts.map((post) => { const u = getUser(state.users, post.userId); const r = state.runRecords.find((x) => x.id === post.runRecordId); const commentsOpen = !!openComments[post.id]; return <Card key={post.id} className="overflow-hidden"><div className="flex items-center gap-3 p-4"><Avatar user={u} /><div className="flex-1"><div className="font-black">{u?.name}</div><div className="text-xs text-zinc-500">{u?.nickname} · {post.date}</div></div><button onClick={() => likePost(post.id)} className={cn("rounded-full px-3 py-2 text-sm font-black", post.likes.includes(currentUser?.id || "") ? "bg-rose-500" : "bg-white text-zinc-950")}>{post.likes.includes(currentUser?.id || "") ? "♥" : "♡"} {post.likes.length}</button></div>{post.mediaType === "video" ? <video src={post.image} controls className="aspect-square w-full bg-black object-contain" /> : <img src={post.image} alt="feed" className="aspect-square w-full object-cover" />}<div className="p-5">{r && <div className="mb-4 grid grid-cols-4 gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-center"><div><div className="text-[11px] font-black text-zinc-500">Distance</div><div className="mt-1 text-base font-black">{r.distanceKm}km</div></div><div><div className="text-[11px] font-black text-zinc-500">Pace</div><div className="mt-1 text-base font-black">{r.pace}</div></div><div><div className="text-[11px] font-black text-zinc-500">Time</div><div className="mt-1 text-base font-black">{r.durationMinutes}m</div></div><div><div className="text-[11px] font-black text-zinc-500">bpm</div><div className="mt-1 text-base font-black">{r.avgHeartRate}</div></div></div>}<p className="text-sm leading-6 text-zinc-200">{post.content}</p><div className="mt-4 flex flex-wrap gap-2">{post.hashtags.map((t) => <Pill key={t}>#{t}</Pill>)}</div><div className="mt-5 border-t border-white/10 pt-4"><button onClick={() => setOpenComments((p) => ({ ...p, [post.id]: !p[post.id] }))} className="mb-3 rounded-2xl bg-white/10 px-4 py-2 text-sm font-black">💬 댓글보기 {post.comments.length}</button>{commentsOpen && <div className="grid gap-3">{post.comments.map((c) => { const cu = getUser(state.users, c.userId); return <div key={c.id} className="flex gap-3 rounded-2xl bg-zinc-950/60 p-3"><Avatar user={cu} size="sm" /><div className="flex-1"><div className="text-xs font-black text-zinc-300">{cu?.nickname}</div><div className="text-sm text-zinc-400">{c.content}</div></div><button onClick={() => likeComment(post.id, c.id)} className={cn("h-fit rounded-full px-3 py-1 text-xs font-black transition", c.likes.includes(currentUser?.id || "") ? "bg-rose-500 text-white" : "bg-white/10 text-zinc-300 hover:bg-white/20")}>{c.likes.includes(currentUser?.id || "") ? "♥" : "♡"} {c.likes.length}</button></div>; })}<div className="mt-3 flex gap-2"><input value={commentDrafts[post.id] || ""} onChange={(e) => setCommentDrafts((p) => ({ ...p, [post.id]: e.target.value }))} className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm outline-none" placeholder="댓글 달기" /><button onClick={() => addComment(post.id)} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">등록</button></div></div>}</div></div></Card>; })}</div>
      </section>}

      {activeTab === "schedule" && <section><SectionTitle eyebrow="Calendar Running Schedule" title="러닝 일정" desc="일정 등록 날짜는 클릭 시 달력으로 선택됩니다." />
        <Card className="mb-7 p-5"><div><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">{editEventId ? "일정 수정" : "일정 등록"}</h3>{editEventId && <button onClick={() => setEditEventId(null)} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black">수정 취소</button>}</div><div className="grid gap-4 md:grid-cols-3"><Input label="일정명" value={eventForm.title} onChange={(v) => setEventForm({ ...eventForm, title: v })} /><Input label="날짜" type="date" value={eventForm.date} onChange={(v) => setEventForm({ ...eventForm, date: v })} /><div><span className="mb-2 block text-xs font-black text-zinc-400">시간</span><div className="grid grid-cols-3 gap-2"><select value={eventForm.ampm} onChange={(e) => setEventForm({ ...eventForm, ampm: e.target.value })} className="rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-3 text-sm"><option>AM</option><option>PM</option></select><select value={eventForm.hour} onChange={(e) => setEventForm({ ...eventForm, hour: e.target.value })} className="rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-3 text-sm">{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => <option key={h}>{h}</option>)}</select><select value={eventForm.minute} onChange={(e) => setEventForm({ ...eventForm, minute: e.target.value })} className="rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-3 text-sm"><option>00</option><option>30</option></select></div></div><Input label="장소" value={eventForm.location} onChange={(v) => setEventForm({ ...eventForm, location: v })} /><Input label="지도 링크" value={eventForm.mapUrl} onChange={(v) => setEventForm({ ...eventForm, mapUrl: v })} /><Input label="설명" value={eventForm.description} onChange={(v) => setEventForm({ ...eventForm, description: v })} /></div><button onClick={saveEvent} className="mt-4 w-full rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-zinc-950">{editEventId ? "일정 수정 저장" : "일정 등록"}</button></div></Card>
        <Card className="mb-7 p-5"><div className="mb-4"><YearMonthPicker year={calendarYear} month={calendarMonthOnly} onYear={setCalendarYear} onMonth={setCalendarMonthOnly} /></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-zinc-500">{["일","월","화","수","목","금","토"].map((d) => <div key={d}>{d}</div>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{monthDays(calendarMonth).map((date, i) => { const evs = date ? eventsByDate.get(date) || [] : []; const bds = date ? birthdaysByDate.get(date) || [] : []; const day = date ? weekday(date) : -1; const holiday = date ? koreanHolidays.includes(date) : false; return <button key={`${date}_${i}`} onClick={() => { if (bds.length) setBirthdayModal({ date, users: bds }); }} className={cn("min-h-24 rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-left", date && (holiday || day === 0) ? "text-rose-300" : day === 6 ? "text-sky-300" : "text-zinc-300")}>{date && <div className="text-xs font-black">{Number(date.slice(-2))}</div>}{evs.map((e) => <div key={e.id} onClick={(ev) => { ev.stopPropagation(); setSelectedEvent(e); }} className="mt-1 truncate rounded-lg bg-lime-300/20 px-2 py-1 text-[10px] font-black text-lime-100">{e.title}</div>)}{bds.map((u) => <div key={u.id} className="mt-1 truncate rounded-lg bg-rose-400/20 px-2 py-1 text-[10px] font-black text-rose-100">🎂 {u.nickname}</div>)}</button>; })}</div></Card>
        <div className="grid gap-5 md:grid-cols-3">{state.runEvents.map((e) => { const on = e.attendees.includes(currentUser?.id || ""); return <Card key={e.id} className="p-5 transition hover:-translate-y-1"><div className="flex justify-between gap-3"><div><Pill tone="lime">{e.date} {e.time}</Pill><h3 className="mt-4 text-xl font-black">{e.title}</h3></div><button onClick={() => setSelectedEvent(e)} className="h-fit rounded-full bg-white/10 px-3 py-1 text-sm font-black">상세</button></div><p className="mt-3 text-sm text-zinc-400">📍 {e.location}</p><p className="mt-2 text-sm leading-6 text-zinc-500">{e.description}</p><div className="mt-4 flex items-center gap-2"><button onClick={() => toggleAttend(e.id)} className={cn("flex-1 rounded-2xl px-4 py-3 text-sm font-black", on ? "bg-rose-500 text-white" : "bg-lime-300 text-zinc-950")}>{on ? "참석 취소" : "참석하기"}</button><button onClick={() => editEvent(e)} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black">수정</button></div><div className="group relative mt-4 inline-flex cursor-default items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 transition hover:scale-105"><span className="text-2xl font-black text-lime-300">{e.attendees.length}</span><span className="text-xs font-black text-zinc-400">참석 예정</span><div className="pointer-events-none absolute bottom-full left-0 mb-2 hidden min-w-48 rounded-2xl border border-white/10 bg-zinc-950 p-3 text-xs text-zinc-300 shadow-2xl group-hover:block">{e.attendees.map((uid) => getUser(state.users, uid)?.nickname).join(", ") || "없음"}</div></div>{e.mapUrl && <button onClick={(ev) => openMap(e.mapUrl, ev)} className="mt-3 block text-sm font-black text-lime-300">지도 링크 열기 →</button>}</Card>; })}</div>
      </section>}

      {activeTab === "gallery" && <section><SectionTitle eyebrow="Memory Gallery" title="전체 사진첩" desc="상단 메뉴에서 접근하는 전체 사진 등록/조회 공간입니다." /><Card className="mb-8 p-5"><div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"><label className="flex cursor-pointer items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">사진 업로드<input type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files?.[0], (url) => setGalleryForm({ ...galleryForm, image: url }))} /></label><Input label="사진 설명" value={galleryForm.caption} onChange={(v) => setGalleryForm({ ...galleryForm, caption: v })} /><button onClick={addGallery} className="rounded-2xl bg-lime-300 px-6 py-3 text-sm font-black text-zinc-950">등록</button></div>{galleryForm.image && <img src={galleryForm.image} className="mt-4 max-h-96 w-full rounded-3xl object-cover" alt="gallery preview" />}</Card><div className="columns-2 gap-4 md:columns-3 lg:columns-4">{sortedGallery.map((p) => <div key={p.id} className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"><button type="button" onClick={() => setGalleryPreview(p)} className="block w-full"><img src={p.image} className="w-full object-cover transition hover:scale-[1.02]" alt={p.caption} /></button><div className="p-4"><div className="font-black">{p.caption}</div><div className="mt-1 text-xs text-zinc-500">by {getUser(state.users, p.uploadedBy)?.nickname}</div></div></div>)}</div></section>}

      {activeTab === "dashboard" && <section><SectionTitle eyebrow="Dashboard" title="기록 분석" desc="전체 누적 멤버 랭킹을 상단에 배치하고, 선택한 년/월 기준 월별 랭킹을 아래에 표시합니다." />
        <Card className="mb-7 p-5"><YearMonthPicker year={dashboardYear} month={dashboardMonthOnly} onYear={setDashboardYear} onMonth={setDashboardMonthOnly} /></Card>
        <div className="grid gap-5 md:grid-cols-4"><Stat icon="🏃" label="전체 러닝" value={`${dashboardRecords.length}회`} tone="lime" /><Stat icon="🛣️" label="선택 월 거리" value={`${dashboardRecords.reduce((s, r) => s + r.distanceKm, 0).toFixed(1)}km`} tone="amber" /><Stat icon="⏱️" label="선택 월 시간" value={duration(dashboardRecords.reduce((s, r) => s + r.durationMinutes, 0))} tone="sky" /><Stat icon="🧡" label="선택 월 좋아요" value={`${dashboardPosts.reduce((s, p) => s + p.likes.length, 0)}개`} tone="rose" /></div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><Card className="p-5"><h3 className="text-xl font-black">전체 누적 멤버 랭킹</h3><div className="mt-4 grid gap-3">{[...ranking].sort((a,b)=>b.totalKm-a.totalKm).map((r, i) => <button key={r.user.id} onClick={() => setSelectedUserId(r.user.id)} className={cn("flex items-center gap-3 rounded-2xl p-3 text-left", selectedUserId === r.user.id ? "bg-lime-300 text-zinc-950" : "bg-white/[0.04]")}><div className="w-8 text-center text-xl font-black">{i+1}</div><Avatar user={r.user} size="sm" finisher={r.marathon > 0} /><div className="flex-1"><div className="font-black">{r.user.nickname}</div><div className="text-xs opacity-70">{r.totalKm.toFixed(1)}km · {r.attend}회 참석</div></div></button>)}</div></Card>{selected && <Card className="p-5"><div className="flex items-center gap-4"><Avatar user={selected.user} size="lg" finisher={selected.marathon > 0} /><div><h3 className="text-3xl font-black">{selected.user.nickname}</h3><p className="text-sm text-zinc-400">{selected.user.role} · 평균 페이스 {selected.avgPace}</p></div></div><div className="mt-6 grid gap-4 md:grid-cols-3"><Stat icon="🛣️" label="누적 거리" value={`${selected.totalKm.toFixed(1)}km`} compact /><Stat icon="📅" label="선택 월 거리" value={`${selected.monthKm.toFixed(1)}km`} compact /><Stat icon="🎯" label="목표 달성률" value={`${selected.goalRate}%`} compact /></div></Card>}</div>

        <section className="mt-8"><SectionTitle eyebrow="Monthly Ranking" title={`${dashboardMonth} 랭킹`} desc="최다 거리, 타임, 참석, 완주, 최고 기록, 피드 활동을 기준으로 표시합니다." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><MetricRankingCard title="최다 거리 랭킹" rows={dashRankings.distance} unit="km" /><MetricRankingCard title="최다 러닝 타임" rows={dashRankings.time} /><MetricRankingCard title="최다 참석 횟수" rows={dashRankings.attend} unit="회" /><MetricRankingCard title="최다 마라톤 완주" rows={dashRankings.marathon} unit="회" /><MetricRankingCard title="1회 최고 거리" rows={dashRankings.bestDistance} unit="km" /><MetricRankingCard title="1회 최고 페이스" rows={dashRankings.bestPace} /><MetricRankingCard title="최다 Feed 등록" rows={dashRankings.feed} unit="개" /><MetricRankingCard title="최다 좋아요" rows={dashRankings.likes} unit="개" /></div></section>
      </section>}

      {activeTab === "members" && <section><SectionTitle eyebrow="PRC Members" title="멤버 소개" desc="좌측에는 프로필과 이름/역할, 우측에는 생일과 목표 정보를 정리했습니다." /><div className="grid gap-5 md:grid-cols-2">{approvedUsers.map((u) => <Card key={u.id} className="p-5 transition hover:-translate-y-1"><div className="grid gap-5 sm:grid-cols-[150px_1fr]"><div className="flex flex-col items-center justify-center rounded-[26px] border border-white/10 bg-zinc-950/35 p-4 text-center"><Avatar user={u} size="lg" finisher={state.runRecords.some((r) => r.userId === u.id && (r.hashtags.includes("마라톤") || r.hashtags.includes("완주")))} /><h3 className="mt-4 text-xl font-black">{u.nickname}</h3><p className="mt-1 text-sm font-bold text-zinc-400">{u.name}</p><Pill className="mt-3">{u.role}</Pill></div><div className="grid content-center gap-3"><div className="rounded-2xl bg-white/[0.04] p-4"><div className="text-xs font-black text-zinc-500">Birthday</div><div className="mt-1 text-lg font-black">🎂 {u.birthdayCalendar === "lunar" ? "음력" : "양력"} {u.birthdayMonth}.{u.birthdayDay}</div></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/[0.04] p-4"><div className="text-xs font-black text-zinc-500">Monthly Goal</div><div className="mt-1 text-lg font-black text-lime-300">🎯 {u.monthlyGoalKm}km</div></div><div className="rounded-2xl bg-white/[0.04] p-4"><div className="text-xs font-black text-zinc-500">Marathon Goal</div><div className="mt-1 text-lg font-black">🏁 {u.marathonGoalCount}회</div></div></div><div className="rounded-2xl bg-white/[0.04] p-4"><div className="text-xs font-black text-zinc-500">Target Record</div><div className="mt-1 text-lg font-black">{u.marathonGoalDistance} / {u.marathonGoalTime}</div></div><div className="flex flex-wrap gap-2"><Pill>{u.bloodType || "혈액형 미입력"}</Pill><Pill>{u.mbti || "MBTI 미입력"}</Pill></div></div></div></Card>)}</div></section>}

      {activeTab === "profile" && <section><SectionTitle eyebrow="My Profile" title="프로필 관리" desc="생일은 선택형 UI로, 사진 편집 영역은 크게 개선했습니다." />{!currentUser ? <Empty text="로그인이 필요합니다." /> : profile && <Card className="p-5 md:p-7"><div className="grid gap-8 lg:grid-cols-[360px_1fr]"><div className="rounded-[32px] border border-white/10 bg-zinc-950/40 p-6"><div className="flex justify-center"><Avatar user={profile} size="xl" /></div><label className="mt-6 flex cursor-pointer justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">프로필 사진 변경<input type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files?.[0], (url) => setProfile({ ...profile, profileImage: url }))} /></label><div className="mt-6 grid gap-5"><label className="text-xs font-black text-zinc-400">사진 확대 {profile.profileImageScale.toFixed(1)}<input type="range" min="0.8" max="2.4" step="0.1" value={profile.profileImageScale} onChange={(e) => setProfile({ ...profile, profileImageScale: Number(e.target.value) })} className="mt-3 w-full accent-lime-300" /></label><label className="text-xs font-black text-zinc-400">X 이동<input type="range" min="-60" max="60" value={profile.profileImageX} onChange={(e) => setProfile({ ...profile, profileImageX: Number(e.target.value) })} className="mt-3 w-full accent-lime-300" /></label><label className="text-xs font-black text-zinc-400">Y 이동<input type="range" min="-60" max="60" value={profile.profileImageY} onChange={(e) => setProfile({ ...profile, profileImageY: Number(e.target.value) })} className="mt-3 w-full accent-lime-300" /></label></div></div><div className="grid gap-4 md:grid-cols-2"><Input label="이름" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} /><Input label="별칭" value={profile.nickname} onChange={(v) => setProfile({ ...profile, nickname: v })} /><Input label="이메일" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} /><Input label="전화번호" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} /><Input label="혈액형" value={profile.bloodType} onChange={(v) => setProfile({ ...profile, bloodType: v })} /><Input label="MBTI" value={profile.mbti} onChange={(v) => setProfile({ ...profile, mbti: v })} /><Input label="상의 사이즈" value={profile.shirtSize || ""} onChange={(v) => setProfile({ ...profile, shirtSize: v })} placeholder="예: 100, L, XL" /><Input label="하의 사이즈" value={profile.pantsSize || ""} onChange={(v) => setProfile({ ...profile, pantsSize: v })} placeholder="예: 32, L" /><Input label="신발 사이즈" value={profile.shoeSize || ""} onChange={(v) => setProfile({ ...profile, shoeSize: v })} placeholder="예: 270" /><SelectInput label="생일 구분" value={profile.birthdayCalendar} onChange={(v) => setProfile({ ...profile, birthdayCalendar: v as CalendarType })}><option value="solar">양력</option><option value="lunar">음력</option></SelectInput><SelectInput label="생일 년" value={profile.birthdayYear} onChange={(v) => setProfile({ ...profile, birthdayYear: v })}>{birthYears.map((y) => <option key={y} value={y}>{y}년</option>)}</SelectInput><SelectInput label="생일 월" value={profile.birthdayMonth} onChange={(v) => { const maxDay = daysInMonth(profile.birthdayYear, v); setProfile({ ...profile, birthdayMonth: v, birthdayDay: String(Math.min(Number(profile.birthdayDay), maxDay)).padStart(2, "0") }); }}>{birthMonths.map((m) => <option key={m} value={m}>{Number(m)}월</option>)}</SelectInput><SelectInput label="생일 일" value={profile.birthdayDay} onChange={(v) => setProfile({ ...profile, birthdayDay: v })}>{birthDays.map((d) => <option key={d} value={d}>{Number(d)}일</option>)}</SelectInput><Input label="월 목표 km" type="number" value={profile.monthlyGoalKm} onChange={(v) => setProfile({ ...profile, monthlyGoalKm: Number(v) })} /><Input label="마라톤 목표 횟수" type="number" value={profile.marathonGoalCount} onChange={(v) => setProfile({ ...profile, marathonGoalCount: Number(v) })} /><Input label="목표 거리" value={profile.marathonGoalDistance} onChange={(v) => setProfile({ ...profile, marathonGoalDistance: v })} /><Input label="목표 시간" value={profile.marathonGoalTime} onChange={(v) => setProfile({ ...profile, marathonGoalTime: v })} /></div></div><button onClick={saveProfile} className="mt-6 w-full rounded-2xl bg-lime-300 px-5 py-4 text-sm font-black text-zinc-950">프로필 저장</button></Card>}</section>}

      {activeTab === "admin" && <section><SectionTitle eyebrow="Admin" title="관리자 설정" desc="가입 승인, Hero/타임라인 이미지 관리, 전체 데이터 초기화를 관리합니다." />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5"><h3 className="text-xl font-black">승인 대기 회원</h3><div className="mt-4 grid gap-3">{pendingUsers.length ? pendingUsers.map((u) => <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3"><Avatar user={u} /><div className="flex-1"><div className="font-black">{u.name}</div><div className="text-xs text-zinc-500">{u.loginId}</div></div><button onClick={() => approve(u.id)} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-zinc-950">승인</button></div>) : <Empty text="승인 대기 회원이 없습니다." />}</div></Card>
          <Card className="p-5"><h3 className="text-xl font-black">전체 데이터 초기화</h3><p className="mt-2 text-sm leading-6 text-zinc-400">현재 브라우저 localStorage에 저장된 회원, 피드, 일정, 사진 데이터를 기본값으로 초기화합니다.</p><button onClick={reset} className="mt-5 w-full rounded-2xl bg-rose-500 px-5 py-3 text-sm font-black text-white">전체 데이터 초기화</button></Card>
        </div>

        <Card className="mt-6 p-5"><h3 className="text-xl font-black">Hero 슬라이드 관리</h3><p className="mt-2 text-sm text-zinc-400">기존 Hero 사진을 변경하거나 신규 Hero 사진을 등록할 수 있습니다.</p><div className="mt-5 grid gap-4 md:grid-cols-3">{state.heroSlides.map((h, index) => <div key={h.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-3"><img src={h.image} className="h-40 w-full rounded-2xl object-cover" alt={`Hero ${index + 1}`} /><div className="mt-3 text-sm font-black">Hero {index + 1}</div><label className="mt-3 flex cursor-pointer justify-center rounded-2xl bg-white px-4 py-3 text-xs font-black text-zinc-950">기존 사진 변경<input type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files?.[0], (url) => replaceHeroSlide(h.id, url))} /></label></div>)}</div><div className="mt-5 rounded-3xl border border-dashed border-lime-300/30 bg-lime-300/[0.04] p-4"><h4 className="font-black">신규 Hero 등록</h4><label className="mt-3 flex cursor-pointer justify-center rounded-2xl bg-white px-4 py-3 text-sm font-black text-zinc-950">신규 사진 선택<input type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files?.[0], setHeroImage)} /></label>{heroImage && <img src={heroImage} className="mt-4 max-h-56 w-full rounded-3xl object-cover" alt="hero preview" />}<button onClick={addHero} className="mt-4 w-full rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-zinc-950">Hero 신규 등록</button></div></Card>

        <Card className="mt-6 p-5"><h3 className="text-xl font-black">Anniversary Timeline 사진 관리</h3><p className="mt-2 text-sm text-zinc-400">Home 화면의 ‘우리의 1년’ 4개 사진을 직접 교체할 수 있습니다.</p><div className="mt-5 grid gap-4 md:grid-cols-4">{state.timelineSlides.map((slide) => <div key={slide.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-3"><img src={slide.image} className="h-36 w-full rounded-2xl object-cover" alt={slide.title} /><div className="mt-3 text-sm font-black text-lime-300">{slide.month}</div><div className="text-sm font-black">{slide.title}</div><label className="mt-3 flex cursor-pointer justify-center rounded-2xl bg-white px-4 py-3 text-xs font-black text-zinc-950">타임라인 사진 변경<input type="file" accept="image/*" className="hidden" onChange={(e) => void upload(e.target.files?.[0], (url) => replaceTimelineSlide(slide.id, url))} /></label></div>)}</div></Card>
      </section>}

      {activeTab === "login" && <section className="mx-auto max-w-xl"><Card className="p-7"><div className="text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-transparent p-0 shadow-none"><img src={PRC_LOGO_DATA_URL} alt="PRC logo" className="h-full w-full object-contain" /></div><h2 className="mt-5 text-3xl font-black">PRC Login</h2><p className="mt-2 text-sm text-zinc-500">관리자 계정 또는 승인된 회원 계정으로 로그인하세요.</p></div><div className="mt-6 flex rounded-2xl bg-white/[0.05] p-1"><button onClick={() => setAuthMode("login")} className={cn("flex-1 rounded-xl py-3 text-sm font-black", authMode === "login" ? "bg-lime-300 text-zinc-950" : "text-zinc-400")}>로그인</button><button onClick={() => setAuthMode("signup")} className={cn("flex-1 rounded-xl py-3 text-sm font-black", authMode === "signup" ? "bg-lime-300 text-zinc-950" : "text-zinc-400")}>회원가입</button></div><div className="mt-6 grid gap-4">{authMode === "signup" && <><Input label="이름" value={auth.name} onChange={(v) => setAuth({ ...auth, name: v })} /><Input label="이메일" value={auth.email} onChange={(v) => setAuth({ ...auth, email: v })} /><Input label="전화번호" value={auth.phone} onChange={(v) => setAuth({ ...auth, phone: v })} /></>}<Input label="아이디" value={auth.loginId} onChange={(v) => setAuth({ ...auth, loginId: v })} /><Input label="비밀번호" type="password" value={auth.password} onChange={(v) => setAuth({ ...auth, password: v })} />{authMode === "signup" && <Input label="비밀번호 확인" type="password" value={auth.passwordConfirm} onChange={(v) => setAuth({ ...auth, passwordConfirm: v })} />}<button onClick={authMode === "login" ? login : signup} className="rounded-2xl bg-lime-300 px-5 py-4 text-sm font-black text-zinc-950">{authMode === "login" ? "로그인" : "가입 신청"}</button></div></Card></section>}
    </main>

    {galleryPreview && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur"><div className="relative max-h-[92vh] w-full max-w-5xl"><button onClick={() => setGalleryPreview(null)} className="absolute -top-12 right-0 rounded-full bg-white px-4 py-2 text-sm font-black text-zinc-950">닫기 ×</button><img src={galleryPreview.image} alt={galleryPreview.caption} className="max-h-[88vh] w-full rounded-[28px] object-contain" /><div className="mt-3 rounded-2xl bg-zinc-950/80 px-4 py-3 text-sm font-black">{galleryPreview.caption}</div></div></div>}

    {selectedEvent && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur"><Card className="w-full max-w-xl bg-zinc-950 p-6"><div className="flex justify-between gap-3"><div><Pill tone="lime">{selectedEvent.date} {selectedEvent.time}</Pill><h3 className="mt-4 text-3xl font-black">{selectedEvent.title}</h3></div><button onClick={() => setSelectedEvent(null)} className="h-fit rounded-full bg-white px-3 py-1 text-zinc-950">×</button></div><p className="mt-4 text-zinc-300">📍 {selectedEvent.location}</p><p className="mt-2 text-sm leading-6 text-zinc-500">{selectedEvent.description}</p><div className="mt-5"><h4 className="font-black">참석자 {selectedEvent.attendees.length}명</h4><div className="mt-3 flex flex-wrap gap-2">{selectedEvent.attendees.map((userId) => <Pill key={userId}>{getUser(state.users, userId)?.nickname}</Pill>)}</div></div><button onClick={() => toggleAttend(selectedEvent.id)} className="mt-5 w-full rounded-2xl bg-lime-300 px-5 py-3 text-sm font-black text-zinc-950">참석/취소</button></Card></div>}
    {birthdayModal && <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-4 backdrop-blur"><Card className="w-full max-w-md bg-zinc-950 p-6"><div className="flex justify-between"><div><Pill tone="rose">Birthday</Pill><h3 className="mt-3 text-2xl font-black">{birthdayModal.date}</h3></div><button onClick={() => setBirthdayModal(null)} className="h-fit rounded-full bg-white px-3 py-1 text-zinc-950">×</button></div><div className="mt-5 grid gap-3">{birthdayModal.users.map((u) => <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3"><Avatar user={u} /><div><div className="font-black">{u.nickname}</div><div className="text-xs text-zinc-500">{u.birthdayCalendar === "lunar" ? "음력" : "양력"} 생일</div></div></div>)}</div></Card></div>}

    {currentUser && <nav className="fixed bottom-4 left-1/2 z-50 flex max-w-[95vw] -translate-x-1/2 gap-1 overflow-x-auto rounded-full border border-white/10 bg-zinc-950/90 p-2 shadow-2xl xl:hidden">{nav.map((n) => <button key={n.key} onClick={() => goTab(n.key)} className={cn("rounded-full p-3 text-lg", activeTab === n.key ? "bg-lime-300 text-zinc-950" : "text-zinc-400")}>{n.icon}</button>)}</nav>}
  </div>;
}
