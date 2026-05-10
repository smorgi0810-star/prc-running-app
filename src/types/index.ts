export type TabKey =
  | "home"
  | "feed"
  | "schedule"
  | "gallery"
  | "dashboard"
  | "members"
  | "profile"
  | "admin"
  | "login";

export type CalendarType = "solar" | "lunar";

export type User = {
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
};

export type RunRecord = {
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

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
};

export type FeedPost = {
  id: string;
  userId: string;
  date: string;
  content: string;
  image: string;
  hashtags: string[];
  likes: string[];
  comments: Comment[];
  runRecordId: string;
};

export type RunEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  mapUrl: string;
  description: string;
  attendees: string[];
};

export type GalleryPhoto = {
  id: string;
  image: string;
  uploadedBy: string;
  uploadedAt: string;
  caption: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  uploadedAt: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
};

export type AppState = {
  users: User[];
  runRecords: RunRecord[];
  feedPosts: FeedPost[];
  runEvents: RunEvent[];
  galleryPhotos: GalleryPhoto[];
  heroSlides: HeroSlide[];
  notices: Notice[];
};
