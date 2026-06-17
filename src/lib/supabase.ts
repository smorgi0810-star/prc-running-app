import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// 환경변수가 없더라도 앱 전체가 검정 화면으로 멈추지 않도록 throw 하지 않습니다.
// Storage 업로드 시점에 오류 메시지를 보여주도록 처리합니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase 환경변수가 설정되지 않았습니다. Vercel Environment Variables를 확인하세요."
  );
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
