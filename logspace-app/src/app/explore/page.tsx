"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AiSearchSidebar from "@/components/AiSearchSidebar";
import { createClient } from "@supabase/supabase-js";
import { formatNumber } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExplorePage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("*, users!projects_user_id_fkey ( id, username, display_name, avatar )")
        .eq("visibility", "Public")
        .order("follower_count", { ascending: false })
        .limit(30);

      setProjects(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <AiSearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="max-w-5xl mx-auto px-5 pt-20 pb-16">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-6"
          style={{ color: "var(--faint)" }}
        >
          All projects
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ height: 220, background: "var(--surface)", border: "1px solid var(--border)" }}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: "var(--faint)" }}>
            No projects yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const creator = project.users;
              return (
                <a
                  key={project.id}
                  href={`/u/${creator?.username}/projects/${project.slug}`}
                  className="rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {project.cover_image && (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full object-cover"
                      style={{ height: 140 }}
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {creator?.avatar ? (
                        <img
                          src={creator.avatar}
                          alt={creator.display_name}
                          className="w-5 h-5 rounded-full"
                          style={{ background: "var(--border)" }}
                        />
                      ) : (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: "var(--border)", color: "var(--text)" }}
                        >
                          {creator?.display_name?.[0]}
                        </div>
                      )}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {creator?.username}
                      </span>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {project.title}
                    </p>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted)" }}>
                      {project.tagline}
                    </p>
                    <div
                      className="flex items-center justify-between mt-3 text-xs"
                      style={{ color: "var(--faint)" }}
                    >
                      <span>{formatNumber(project.follower_count)} followers</span>
                      <span>{project.entry_count} entries</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
