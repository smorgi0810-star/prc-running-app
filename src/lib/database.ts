import { isSupabaseConfigured, supabase } from "./supabase";

export type SharedState = {
  users: any[];
  runRecords: any[];
  feedPosts: any[];
  runEvents: any[];
  galleryPhotos: any[];
  heroSlides: any[];
  timelineSlides: any[];
  notices: any[];
};

const TABLE_NAME = "prc_shared_state";
const ROW_ID = "main";

export const emptySharedState: SharedState = {
  users: [],
  runRecords: [],
  feedPosts: [],
  runEvents: [],
  galleryPhotos: [],
  heroSlides: [],
  timelineSlides: [],
  notices: [],
};

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

export async function loadSharedState(): Promise<SharedState | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("users, run_records, feed_posts, run_events, gallery_photos, hero_slides, timeline_slides, notices")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    await saveSharedState(emptySharedState);
    return emptySharedState;
  }

  return {
    users: asArray(data.users),
    runRecords: asArray(data.run_records),
    feedPosts: asArray(data.feed_posts),
    runEvents: asArray(data.run_events),
    galleryPhotos: asArray(data.gallery_photos),
    heroSlides: asArray(data.hero_slides),
    timelineSlides: asArray(data.timeline_slides),
    notices: asArray(data.notices),
  };
}

export async function saveSharedState(shared: SharedState): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        id: ROW_ID,
        users: shared.users,
        run_records: shared.runRecords,
        feed_posts: shared.feedPosts,
        run_events: shared.runEvents,
        gallery_photos: shared.galleryPhotos,
        hero_slides: shared.heroSlides,
        timeline_slides: shared.timelineSlides,
        notices: shared.notices,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) throw error;
}
