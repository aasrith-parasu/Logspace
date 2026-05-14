"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import AiSearchSidebar from "@/components/AiSearchSidebar";
import ProjectCard from "@/components/ProjectCard";
import NewPostModal from "@/components/NewPostModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = "following" | "discover" | "trending";

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("discover");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const userId = (session?.user as any)?.id;

  const fetchProjects = useCallback(async () => {
    if (tab === "following" && sessionStatus === "loading") return;

    setLoading(true);
    setFetchError(null);

    try {
      let data: any[] = [];
      let error: any = null;

      if (tab === "trending") {
        const res = await supabase
          .from("projects")
          .select("*, users!projects_user_id_fkey(id, username, display_name, avatar)")
          .eq("visibility", "Public")
          .order("total_reactions", { ascending: false })
          .limit(20);
        data = res.data ?? [];
        error = res.error;

      } else if (tab === "following") {
        if (!userId) {
          setProjects([]);
          setLoading(false);
          return;
        }
        const { data: follows } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", userId);

        const ids = (follows ?? []).map((f: any) => f.following_id);
        if (ids.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }
        const res = await supabase
          .from("projects")
          .select("*, users!projects_user_id_fkey(id, username, display_name, avatar)")
          .eq("visibility", "Public")
          .in("user_id", ids)
          .order("updated_at", { ascending: false })
          .limit(20);
        data = res.data ?? [];
        error = res.error;

      } else {
        // discover
        const res = await supabase
          .from("projects")
          .select("*, users!projects_user_id_fkey(id, username, display_name, avatar)")
          .eq("visibility", "Public")
          .order("updated_at", { ascending: false })
          .limit(20);
        data = res.data ?? [];
        error = res.error;
      }

      if (error) {
        setFetchError(error.message);
        setProjects([]);
      } else {
        setProjects(data);
      }
    } catch (e: any) {
      setFetchError(e.message ?? "Network error");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [tab, userId, sessionStatus]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  function handlePostCreated() {
    setPostOpen(false);
    setTab("discover");
    fetchProjects();
  }

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} onNewPost={() => setPostOpen(true)} />
      <AiSearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {session && (
        <NewPostModal
          isOpen={postOpen}
          onClose={() => setPostOpen(false)}
          onCreated={handlePostCreated}
        />
      )}

      <main className="max-w-4xl mx-auto px-5 pt-20 pb-16">
        {/* Tabs */}
        <div className="flex gap-6 mb-8" style={{ borderBottom: "1px solid var(--border)" }}>
          {(["following", "discover", "trending"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-3 text-sm -mb-px capitalize font-medium transition-colors"
              style={{
                borderBottom: tab === t ? "2px solid var(--text)" : "2px solid transparent",
                color: tab === t ? "var(--text)" : "var(--faint)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Not signed in nudge for following tab */}
        {!session && tab === "following" && sessionStatus !== "loading" && (
          <div
            className="rounded-2xl p-6 mb-6 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
              Sign in to see your feed
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Follow projects and creators you care about.
            </p>
            <a
              href="/login"
              className="inline-block text-sm px-4 py-2 rounded-lg font-medium"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Sign in with Google
            </a>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ height: 240, background: "var(--surface)", border: "1px solid var(--border)" }}
              />
            ))}
          </div>
        ) : fetchError ? (
          <p className="text-sm py-16 text-center" style={{ color: "#e55" }}>
            Error loading projects: {fetchError}
          </p>
        ) : projects.length === 0 ? (
          <p className="text-sm py-16 text-center" style={{ color: "var(--faint)" }}>
            Nothing here yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
