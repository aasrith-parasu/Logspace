import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createServerClient } from "@/lib/supabase";

// GET /api/projects?tab=discover|following|trending&userId=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") ?? "discover";
  const userId = searchParams.get("userId");

  const db = createServerClient();

  let query = db
    .from("projects")
    .select(`
      *,
      users!projects_user_id_fkey ( id, username, display_name, avatar )
    `)
    .eq("visibility", "Public");

  if (tab === "trending") {
    query = query.order("total_reactions", { ascending: false }).limit(20);
  } else if (tab === "following" && userId) {
    // Projects from users the current user follows
    const { data: follows } = await db
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);

    const followedIds = (follows ?? []).map((f) => f.following_id);
    if (followedIds.length === 0) {
      return NextResponse.json([]);
    }
    query = query.in("user_id", followedIds).order("updated_at", { ascending: false }).limit(20);
  } else {
    // discover — most recent
    query = query.order("updated_at", { ascending: false }).limit(20);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user id in session" }, { status: 401 });
  }

  const body = await req.json();
  const { title, tagline, description, categories, visibility, coverImage } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Generate a slug from the title
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" +
    Date.now();

  const db = createServerClient();

  const { data, error } = await db
    .from("projects")
    .insert({
      user_id: userId,
      title: title.trim(),
      slug,
      tagline: tagline?.trim() ?? "",
      description: description?.trim() ?? null,
      categories: categories ?? [],
      visibility: visibility ?? "Public",
      cover_image: coverImage ?? null,
      start_date: new Date().toISOString().split("T")[0],
      status: "Active",
      linked_urls: [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
