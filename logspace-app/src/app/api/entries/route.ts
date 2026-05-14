import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createServerClient } from "@/lib/supabase";

// POST /api/entries — create a new entry (log update)
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
  const { projectId, title, entryBody, isMilestone, moodTag, mediaUrls } = body;

  if (!projectId || !entryBody?.trim()) {
    return NextResponse.json({ error: "projectId and body are required" }, { status: 400 });
  }

  const db = createServerClient();

  // Verify the project belongs to this user
  const { data: project, error: projectError } = await db
    .from("projects")
    .select("id, user_id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found or not yours" }, { status: 404 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: entry, error: entryError } = await db
    .from("entries")
    .insert({
      project_id: projectId,
      user_id: userId,
      title: title?.trim() || null,
      body: entryBody.trim(),
      date: today,
      is_milestone: isMilestone ?? false,
      mood_tag: moodTag ?? "Grinding",
      media_urls: Array.isArray(mediaUrls) ? mediaUrls : [],
      reactions: { heart: 0, fire: 0, celebrate: 0, inspired: 0 },
      hashtags: [],
    })
    .select()
    .single();

  if (entryError) {
    return NextResponse.json({ error: entryError.message }, { status: 500 });
  }

  // Increment entry_count on the project
  await db.rpc("increment_entry_count", { project_id: projectId });

  return NextResponse.json(entry, { status: 201 });
}
