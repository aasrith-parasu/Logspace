// ─── Mock Data & Types ────────────────────────────────────────────────────────

export type Category =
  | "Tech & Coding"
  | "Art & Design"
  | "Writing & Storytelling"
  | "Music & Audio"
  | "Film & Video"
  | "Game Development"
  | "Fitness & Health"
  | "Business & Entrepreneurship"
  | "Education & Learning"
  | "Science & Research"
  | "Cooking & Food"
  | "Fashion & Crafts"
  | "Photography"
  | "Other";

export type ProjectStatus = "Active" | "On Hold" | "Completed" | "Abandoned" | "Stale";
export type MoodTag = "Grinding" | "Blocked" | "Breakthrough" | "Rethinking" | "Shipped" | "Exploring" | "Just Getting Started";

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  interests: Category[];
  isFollowing?: boolean;
  joinDate: string;
  totalProjects: number;
  totalEntries: number;
}

export interface TimelineEntry {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  body: string;
  date: string;
  isMilestone: boolean;
  moodTag: MoodTag;
  mediaUrls: string[];
  reactions: { heart: number; fire: number; celebrate: number; inspired: number };
  commentCount: number;
  viewCount: number;
  hashtags: string[];
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  categories: Category[];
  coverImage: string;
  startDate: string;
  status: ProjectStatus;
  visibility: "Public" | "Followers-Only" | "Private";
  entryCount: number;
  followerCount: number;
  totalReactions: number;
  streakCount: number;
  linkedUrls: { label: string; url: string }[];
  entries: TimelineEntry[];
  healthScore: number;
  isFollowing?: boolean;
}

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    username: "maya_builds",
    displayName: "Maya Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
    bio: "Full-stack dev building in public. Currently obsessed with Rust and WebAssembly.",
    location: "San Francisco, CA",
    followers: 1240,
    following: 89,
    interests: ["Tech & Coding", "Game Development"],
    isFollowing: true,
    joinDate: "2024-01-15",
    totalProjects: 5,
    totalEntries: 87,
  },
  {
    id: "u2",
    username: "oliver_writes",
    displayName: "Oliver Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=oliver",
    bio: "Writing my first novel one chapter at a time. Fantasy + sci-fi hybrid.",
    location: "Austin, TX",
    followers: 430,
    following: 210,
    interests: ["Writing & Storytelling", "Art & Design"],
    isFollowing: false,
    joinDate: "2024-03-02",
    totalProjects: 2,
    totalEntries: 34,
  },
  {
    id: "u3",
    username: "zara_creates",
    displayName: "Zara Okonkwo",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zara",
    bio: "Illustrator & animator. Documenting my journey from freelancer to studio founder.",
    location: "London, UK",
    followers: 3800,
    following: 145,
    interests: ["Art & Design", "Film & Video"],
    isFollowing: true,
    joinDate: "2023-11-20",
    totalProjects: 8,
    totalEntries: 156,
  },
  {
    id: "u4",
    username: "dev_ravi",
    displayName: "Ravi Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi",
    bio: "Indie hacker. Building SaaS tools for creators. 0 → $1k MRR in public.",
    location: "Bangalore, India",
    followers: 2100,
    following: 67,
    interests: ["Tech & Coding", "Business & Entrepreneurship"],
    isFollowing: false,
    joinDate: "2024-02-10",
    totalProjects: 3,
    totalEntries: 62,
  },
  {
    id: "u5",
    username: "luna_fitness",
    displayName: "Luna Torres",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luna",
    bio: "Training for my first ultramarathon. Logging every mile, every setback.",
    location: "Barcelona, Spain",
    followers: 890,
    following: 320,
    interests: ["Fitness & Health"],
    isFollowing: false,
    joinDate: "2024-04-05",
    totalProjects: 1,
    totalEntries: 45,
  },
  {
    id: "u6",
    username: "kai_sounds",
    displayName: "Kai Nakamura",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kai",
    bio: "Producing my debut album entirely in public. Lo-fi meets jazz meets chaos.",
    location: "Tokyo, Japan",
    followers: 1560,
    following: 98,
    interests: ["Music & Audio", "Art & Design"],
    isFollowing: true,
    joinDate: "2023-12-01",
    totalProjects: 4,
    totalEntries: 73,
  },
];

// ─── Mock Projects ────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    userId: "u1",
    title: "Pixel Engine",
    slug: "pixel-engine",
    tagline: "A 2D game engine written from scratch in Rust",
    description:
      "Building a fully functional 2D game engine in Rust with WebAssembly compilation target. Goal: ship a playable demo by Q3 2026.",
    categories: ["Tech & Coding", "Game Development"],
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    startDate: "2024-01-20",
    status: "Active",
    visibility: "Public",
    entryCount: 32,
    followerCount: 847,
    totalReactions: 4200,
    streakCount: 14,
    linkedUrls: [{ label: "GitHub", url: "https://github.com" }],
    healthScore: 92,
    isFollowing: true,
    entries: [
      {
        id: "e1",
        projectId: "p1",
        userId: "u1",
        title: "Renderer is finally working 🎉",
        body: "After 3 weeks of fighting with WebGL contexts and Rust's borrow checker, the basic sprite renderer is working. I can now render 10,000 sprites at 60fps on a mid-range laptop. The key insight was batching draw calls by texture atlas rather than per-sprite.",
        date: "2026-05-10",
        isMilestone: true,
        moodTag: "Breakthrough",
        mediaUrls: ["https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80"],
        reactions: { heart: 142, fire: 89, celebrate: 67, inspired: 45 },
        commentCount: 23,
        viewCount: 1240,
        hashtags: ["#rust", "#gamedev", "#webassembly"],
      },
      {
        id: "e2",
        projectId: "p1",
        userId: "u1",
        title: "Physics system — day 1",
        body: "Starting the physics integration today. Going with a simplified AABB collision system first before adding anything fancy. The plan is to get basic platformer physics working by end of week.",
        date: "2026-05-08",
        isMilestone: false,
        moodTag: "Grinding",
        mediaUrls: [],
        reactions: { heart: 34, fire: 28, celebrate: 12, inspired: 19 },
        commentCount: 8,
        viewCount: 456,
        hashtags: ["#physics", "#gamedev"],
      },
    ],
  },
  {
    id: "p2",
    userId: "u2",
    title: "The Hollow Stars",
    slug: "the-hollow-stars",
    tagline: "A fantasy novel about memory, loss, and found family",
    description:
      "Writing my debut novel in public. 120,000 word target. Logging every chapter, every rewrite, every crisis of confidence.",
    categories: ["Writing & Storytelling"],
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
    startDate: "2024-03-10",
    status: "Active",
    visibility: "Public",
    entryCount: 28,
    followerCount: 312,
    totalReactions: 1890,
    streakCount: 8,
    linkedUrls: [],
    healthScore: 78,
    isFollowing: false,
    entries: [
      {
        id: "e3",
        projectId: "p2",
        userId: "u2",
        title: "Chapter 7 — first draft done",
        body: "Finally finished the first draft of Chapter 7. This one nearly broke me — the protagonist's confrontation with her mentor needed to feel earned after 6 chapters of buildup. I rewrote the ending 4 times. Current word count: 42,300.",
        date: "2026-05-11",
        isMilestone: false,
        moodTag: "Grinding",
        mediaUrls: [],
        reactions: { heart: 67, fire: 23, celebrate: 45, inspired: 38 },
        commentCount: 14,
        viewCount: 678,
        hashtags: ["#amwriting", "#fantasy", "#nanowrimo"],
      },
    ],
  },
  {
    id: "p3",
    userId: "u3",
    title: "Studio Zero",
    slug: "studio-zero",
    tagline: "Building my animation studio from a bedroom to a real business",
    description:
      "Documenting the full journey of turning my freelance illustration work into a proper animation studio. Revenue, clients, team building — all in public.",
    categories: ["Art & Design", "Business & Entrepreneurship"],
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    startDate: "2023-11-25",
    status: "Active",
    visibility: "Public",
    entryCount: 67,
    followerCount: 2340,
    totalReactions: 18900,
    streakCount: 24,
    linkedUrls: [
      { label: "Portfolio", url: "https://example.com" },
      { label: "YouTube", url: "https://youtube.com" },
    ],
    healthScore: 98,
    isFollowing: true,
    entries: [
      {
        id: "e4",
        projectId: "p3",
        userId: "u3",
        title: "First client contract signed — $12k project",
        body: "We did it. Signed our first proper studio contract today — a 12-week animation project for a UK-based fintech startup. This is the moment I've been building toward for 18 months. The rate is 3x what I was charging as a freelancer.",
        date: "2026-05-09",
        isMilestone: true,
        moodTag: "Shipped",
        mediaUrls: ["https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"],
        reactions: { heart: 456, fire: 312, celebrate: 289, inspired: 198 },
        commentCount: 87,
        viewCount: 8900,
        hashtags: ["#studiozero", "#animation", "#freelance", "#milestone"],
      },
    ],
  },
  {
    id: "p4",
    userId: "u4",
    title: "FormFlow",
    slug: "formflow",
    tagline: "No-code form builder for indie hackers — $0 to $1k MRR",
    description:
      "Building FormFlow in public. A lightweight, beautiful form builder that doesn't cost $50/month. Logging every product decision, every customer conversation, every revenue milestone.",
    categories: ["Tech & Coding", "Business & Entrepreneurship"],
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    startDate: "2024-02-15",
    status: "Active",
    visibility: "Public",
    entryCount: 45,
    followerCount: 1560,
    totalReactions: 9800,
    streakCount: 18,
    linkedUrls: [
      { label: "GitHub", url: "https://github.com" },
      { label: "Product Hunt", url: "https://producthunt.com" },
    ],
    healthScore: 88,
    isFollowing: false,
    entries: [
      {
        id: "e5",
        projectId: "p4",
        userId: "u4",
        title: "Hit $500 MRR — halfway there",
        body: "FormFlow crossed $500 MRR today. 47 paying customers, $10.63 average revenue per user. The biggest unlock was switching from a per-form pricing model to a flat monthly subscription. Churn dropped from 18% to 6% overnight.",
        date: "2026-05-12",
        isMilestone: true,
        moodTag: "Breakthrough",
        mediaUrls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"],
        reactions: { heart: 234, fire: 189, celebrate: 156, inspired: 123 },
        commentCount: 45,
        viewCount: 4500,
        hashtags: ["#indiehacker", "#saas", "#buildinpublic"],
      },
    ],
  },
  {
    id: "p5",
    userId: "u5",
    title: "Ultra 100",
    slug: "ultra-100",
    tagline: "Training for my first 100-mile ultramarathon",
    description:
      "Logging every training run, every injury, every mental breakdown on the road to completing the Ultra-Trail du Mont-Blanc. 18 months of prep, all documented.",
    categories: ["Fitness & Health"],
    coverImage: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
    startDate: "2024-04-10",
    status: "Active",
    visibility: "Public",
    entryCount: 38,
    followerCount: 678,
    totalReactions: 3400,
    streakCount: 12,
    linkedUrls: [],
    healthScore: 85,
    isFollowing: false,
    entries: [
      {
        id: "e6",
        projectId: "p5",
        userId: "u5",
        title: "50km training run — new personal distance record",
        body: "Ran 50km through the Pyrenees foothills today. Took 7 hours 23 minutes. My feet are destroyed but my mind is clear. The last 10km were a negotiation with every part of my body that wanted to stop. I didn't stop.",
        date: "2026-05-11",
        isMilestone: true,
        moodTag: "Grinding",
        mediaUrls: ["https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&q=80"],
        reactions: { heart: 189, fire: 145, celebrate: 98, inspired: 134 },
        commentCount: 32,
        viewCount: 2300,
        hashtags: ["#ultramarathon", "#running", "#utmb"],
      },
    ],
  },
  {
    id: "p6",
    userId: "u6",
    title: "Neon Koi",
    slug: "neon-koi",
    tagline: "Producing my debut album — lo-fi jazz meets electronic",
    description:
      "Every track, every sample, every creative decision documented. Neon Koi is my debut album and I'm making it entirely in public — from first beat to final master.",
    categories: ["Music & Audio"],
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    startDate: "2023-12-05",
    status: "Active",
    visibility: "Public",
    entryCount: 52,
    followerCount: 1230,
    totalReactions: 7800,
    streakCount: 20,
    linkedUrls: [{ label: "SoundCloud", url: "https://soundcloud.com" }],
    healthScore: 94,
    isFollowing: true,
    entries: [
      {
        id: "e7",
        projectId: "p6",
        userId: "u6",
        title: "Track 4 — 'Midnight Koi' is done",
        body: "Track 4 is finished. This one took 6 weeks and went through 11 versions. The final arrangement is: upright bass sample, Rhodes piano, brushed drums, and a single muted trumpet line that comes in at the 2-minute mark. It's the best thing I've ever made.",
        date: "2026-05-10",
        isMilestone: true,
        moodTag: "Shipped",
        mediaUrls: ["https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80"],
        reactions: { heart: 312, fire: 234, celebrate: 189, inspired: 267 },
        commentCount: 56,
        viewCount: 5600,
        hashtags: ["#lofi", "#jazz", "#albummaking", "#neokoi"],
      },
    ],
  },
];

// ─── Recommendation Engine ────────────────────────────────────────────────────
// Content-based filtering: score projects by category overlap + engagement signals
// Collaborative filtering: boost projects followed by users you follow

export function getRecommendations(
  userInterests: Category[],
  followedUserIds: string[],
  followedProjectIds: string[],
  allProjects: Project[],
  limit = 6
): Project[] {
  const scored = allProjects
    .filter((p) => !followedProjectIds.includes(p.id) && p.visibility === "Public")
    .map((project) => {
      let score = 0;

      // Content-based: category overlap
      const categoryOverlap = project.categories.filter((c) => userInterests.includes(c)).length;
      score += categoryOverlap * 30;

      // Engagement signal: normalized reaction score
      const engagementScore = Math.min(project.totalReactions / 1000, 1) * 20;
      score += engagementScore;

      // Follower signal
      const followerScore = Math.min(project.followerCount / 500, 1) * 15;
      score += followerScore;

      // Collaborative: followed by people you follow
      const followedByNetwork = followedUserIds.includes(project.userId);
      if (followedByNetwork) score += 25;

      // Recency / health
      score += (project.healthScore / 100) * 10;

      // Streak bonus
      score += Math.min(project.streakCount / 30, 1) * 5;

      return { project, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.project);

  return scored;
}

// ─── AI Search ────────────────────────────────────────────────────────────────
// Simulates semantic search with keyword + category + mood matching

export function aiSearch(query: string, projects: Project[]): Project[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  const scored = projects
    .filter((p) => p.visibility === "Public")
    .map((project) => {
      let score = 0;
      const searchText = [
        project.title,
        project.tagline,
        project.description,
        ...project.categories,
        project.status,
        ...project.entries.flatMap((e) => [e.title, e.body, ...e.hashtags]),
      ]
        .join(" ")
        .toLowerCase();

      tokens.forEach((token) => {
        if (searchText.includes(token)) score += 10;
      });

      // Exact title match bonus
      if (project.title.toLowerCase().includes(q)) score += 50;

      // Category match
      project.categories.forEach((cat) => {
        if (cat.toLowerCase().includes(q)) score += 30;
      });

      // Engagement boost
      score += Math.min(project.totalReactions / 2000, 1) * 5;

      return { project, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.project);

  return scored;
}

export const CURRENT_USER: User = {
  id: "me",
  username: "you",
  displayName: "You",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
  bio: "Building in public.",
  location: "Everywhere",
  followers: 12,
  following: 4,
  interests: ["Tech & Coding", "Art & Design", "Music & Audio"],
  joinDate: "2026-05-01",
  totalProjects: 1,
  totalEntries: 3,
};

export const FOLLOWED_USER_IDS = ["u1", "u3", "u6"];
export const FOLLOWED_PROJECT_IDS = ["p1", "p3", "p6"];

export const MOOD_COLORS: Record<MoodTag, string> = {
  Grinding:              "bg-transparent text-[#888] border-[#2a2a2a]",
  Blocked:               "bg-transparent text-[#666] border-[#2a2a2a]",
  Breakthrough:          "bg-transparent text-[#e8e8e8] border-[#3a3a3a]",
  Rethinking:            "bg-transparent text-[#777] border-[#2a2a2a]",
  Shipped:               "bg-transparent text-[#e8e8e8] border-[#444]",
  Exploring:             "bg-transparent text-[#888] border-[#2a2a2a]",
  "Just Getting Started":"bg-transparent text-[#666] border-[#2a2a2a]",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  Active:     "text-[#e8e8e8] border-[#333]",
  "On Hold":  "text-[#666] border-[#2a2a2a]",
  Completed:  "text-[#888] border-[#2a2a2a]",
  Abandoned:  "text-[#444] border-[#1f1f1f]",
  Stale:      "text-[#555] border-[#2a2a2a]",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "Tech & Coding": "💻",
  "Art & Design": "🎨",
  "Writing & Storytelling": "✍️",
  "Music & Audio": "🎵",
  "Film & Video": "🎬",
  "Game Development": "🎮",
  "Fitness & Health": "🏃",
  "Business & Entrepreneurship": "🚀",
  "Education & Learning": "📚",
  "Science & Research": "🔬",
  "Cooking & Food": "🍳",
  "Fashion & Crafts": "🧵",
  Photography: "📷",
  Other: "✨",
};
