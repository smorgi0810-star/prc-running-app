import { isSupabaseConfigured, supabase } from "./supabase";

export type SupabaseBucket = "gallery" | "feed" | "profile" | "hero";

type UploadOptions = {
  bucket: SupabaseBucket;
  file: File;
  folder: string;
  maxSizeMb?: number;
};

function getSafeExt(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/quicktime") return "mov";

  return "bin";
}

export async function uploadToSupabaseStorage({
  bucket,
  file,
  folder,
  maxSizeMb = 10,
}: UploadOptions): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다. Vercel Environment Variables를 확인하세요.");
  }

  const limitBytes = maxSizeMb * 1024 * 1024;

  if (file.size > limitBytes) {
    throw new Error(`${maxSizeMb}MB 이하 파일만 업로드할 수 있습니다.`);
  }

  const ext = getSafeExt(file);
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export async function uploadGalleryImage(file: File): Promise<string> {
  return uploadToSupabaseStorage({
    bucket: "gallery",
    file,
    folder: "gallery",
    maxSizeMb: 10,
  });
}

export async function uploadFeedMedia(file: File): Promise<string> {
  const isVideo = file.type.startsWith("video/");
  return uploadToSupabaseStorage({
    bucket: "feed",
    file,
    folder: isVideo ? "videos" : "images",
    maxSizeMb: isVideo ? 80 : 10,
  });
}

export async function uploadProfileImage(file: File): Promise<string> {
  return uploadToSupabaseStorage({
    bucket: "profile",
    file,
    folder: "profile",
    maxSizeMb: 5,
  });
}

export async function uploadHeroImage(file: File): Promise<string> {
  return uploadToSupabaseStorage({
    bucket: "hero",
    file,
    folder: "hero",
    maxSizeMb: 10,
  });
}

export async function uploadTimelineImage(file: File): Promise<string> {
  return uploadToSupabaseStorage({
    bucket: "hero",
    file,
    folder: "timeline",
    maxSizeMb: 10,
  });
}
