"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import AiSearchSidebar from "@/components/AiSearchSidebar";
import ProjectTimeline from "@/components/ProjectTimeline";
import { createClient } from "@supabase/supabase-js";
import { formatNumber } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProjectPage({ params }: { params: { username: string; slug: string } }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Get creator first
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("username", params.username)
        .single();

      if (!userData) { setLoading(false); return; }
      setCreator(userData);

      // Get project
      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userData.id)
        .eq("slug", params.slug)
        .single();

      if (!projectData) { setLoading(false); return; }
      setProject(projectData);

      // Get entries
      const { data: entryData } = await supabase
        .from("entries")
        .select("*")
        .eq("project_id", projectData.id)
        .order("date", { ascending: false });

      setEntries(entryData ?? []);
      setLoading(false);
    }
    load();
  }, [params.username, params.slug]);

  const linkedUrls: { label: string; url: string }[] =
    Array.isArray(project?.linked_urls) ? project.linked_urls : [];

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <AiSearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-2xl mx-auto px-5 pt-20 pb-16">
        <a
          href={`/u/${params.username}`}
          className="inline-flex items-center gap-1 text-sm mb-8 transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> back
        </a>

        {loading ? (
          <div
            className="rounded-2xl animate-pulse"
            style={{ height: 200, background: "var(--surface)", border: "1px solid var(--border)" }}
          />
        ) : !project ? (
          <p className="text-sm" style={{ color: "var(--faint)" }}>Project not found.</p>
        ) : (
          <>
            {/* Project header card */}
            <div
              className="rounded-2xl overflow-hidden mb-8"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              {project.cover_image && (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-full object-cover"
                  style={{ height: 200 }}
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <a
                      href={`/u/${creator?.username}`}
                      className="flex items-center gap-2 mb-2"
                    >
                      {creator?.avatar ? (
                        <img
                          src={creator.avatar}
                          alt={creator.display_name}
                          className="w-6 h-6 rounded-full"
                          style={{ background: "var(--border)" }}
                        />
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "var(--border)", color: "var(--text)" }}
                        >
                          {creator?.display_name?.[0]}
                        </div>
                      )}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {creator?.username}
                      </span>
                    </a>
                    <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                      {project.title}
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                      {project.tagline}
                    </p>
                  </div>
                  <button
                    onClick={() => setFollowing(!following)}
                    className="shrink-0 text-sm px-4 py-1.5 rounded-full border font-medium transition-colors"
                    style={{
                      borderColor: following ? "var(--faint)" : "var(--text)",
                      color: following ? "var(--faint)" : "var(--text)",
                    }}
                  >
                    {following ? "following" : "follow"}
                  </button>
                </div>

                {/* Stats row */}
                <div
                  className="flex items-center gap-4 pt-3 text-sm"
                  style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  <span>
                    <strong style={{ color: "var(--text)" }}>
                      {formatNumber(project.follower_count + (following ? 1 : 0))}
                    </strong>{" "}
                    followers
                  </span>
                  <span>
                    <strong style={{ color: "var(--text)" }}>{project.entry_count}</strong> entries
                  </span>
                  <span
                    className="ml-auto text-xs capitalize"
                    style={{ color: "var(--faint)" }}
                  >
                    {project.status?.toLowerCase()}
                  </span>
                </div>

                {linkedUrls.length > 0 && (
                  <div className="flex gap-3 mt-3">
                    {linkedUrls.map(({ label, url }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline underline-offset-2"
                        style={{ color: "var(--muted)" }}
                      >
                        {label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-5"
              style={{ color: "var(--faint)" }}
            >
              Updates
            </p>
            {entries.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--faint)" }}>No updates yet.</p>
            ) : (
              <ProjectTimeline
                project={{ ...project, entries }}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}
