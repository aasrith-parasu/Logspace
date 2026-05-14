"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Globe, Pencil, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import AiSearchSidebar from "@/components/AiSearchSidebar";
import ProjectsTimeline from "@/components/ProjectsTimeline";
import { createClient } from "@supabase/supabase-js";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

// Inline SVGs for platforms lucide-react doesn't include
function SocialIcon({ type }: { type: string }) {
  if (type === "github") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
  if (type === "twitter") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (type === "linkedin") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  return <Globe className="w-4 h-4" />;
}

function socialLabel(type: string, url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return type;
  }
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({
  user,
  onClose,
  onSaved,
}: {
  user: any;
  onClose: () => void;
  onSaved: (updated: any) => void;
}) {
  const [displayName, setDisplayName] = useState(user.display_name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [github, setGithub] = useState(user.social_links?.github ?? "");
  const [twitter, setTwitter] = useState(user.social_links?.twitter ?? "");
  const [linkedin, setLinkedin] = useState(user.social_links?.linkedin ?? "");
  const [website, setWebsite] = useState(user.social_links?.website ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const social_links: SocialLinks = {};
    if (github.trim())   social_links.github   = github.trim();
    if (twitter.trim())  social_links.twitter  = twitter.trim();
    if (linkedin.trim()) social_links.linkedin = linkedin.trim();
    if (website.trim())  social_links.website  = website.trim();

    const { data, error: err } = await supabase
      .from("users")
      .update({
        display_name: displayName.trim() || user.display_name,
        bio: bio.trim() || null,
        location: location.trim() || null,
        social_links,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }

    onSaved(data);
    onClose();
  }

  const inputStyle = {
    background: "var(--hover-bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  return (
    <>
      <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 sticky top-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>Edit profile</span>
          <button onClick={onClose} style={{ color: "var(--faint)" }}><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex flex-col gap-3">
          {/* Basic info */}
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--faint)" }}>Info</p>

          <input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg"
            style={inputStyle}
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full text-sm px-3 py-2 rounded-lg resize-none"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg"
            style={inputStyle}
          />

          {/* Social links */}
          <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: "var(--faint)" }}>
            Social links
          </p>

          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>, placeholder: "https://github.com/username", value: github, set: setGithub },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, placeholder: "https://x.com/username", value: twitter, set: setTwitter },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, placeholder: "https://linkedin.com/in/username", value: linkedin, set: setLinkedin },
            { icon: <Globe className="w-4 h-4" />, placeholder: "https://yourwebsite.com", value: website, set: setWebsite },
          ].map(({ icon, placeholder, value, set }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={inputStyle}
            >
              <span style={{ color: "var(--faint)" }}>{icon}</span>
              <input
                type="url"
                placeholder={placeholder}
                value={value}
                onChange={e => set(e.target.value)}
                className="flex-1 bg-transparent text-sm"
                style={{ color: "var(--text)" }}
              />
            </div>
          ))}

          {error && <p className="text-xs" style={{ color: "#e55" }}>{error}</p>}

          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 rounded-lg" style={{ color: "var(--muted)" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
export default function ProfilePage({ params }: { params: { username: string } }) {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sessionUserId = (session?.user as any)?.id;
  const isOwnProfile = user && sessionUserId && user.id === sessionUserId;

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("username", params.username)
        .single();

      if (!userData) { setLoading(false); return; }
      setUser(userData);

      const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userData.id)
        .eq("visibility", "Public")
        .order("updated_at", { ascending: false });

      setProjects(projectData ?? []);
      setLoading(false);
    }
    load();
  }, [params.username]);

  const socialLinks: SocialLinks = user?.social_links ?? {};
  const socialEntries = Object.entries(socialLinks).filter(([, v]) => v) as [string, string][];

  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <AiSearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      {editOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setUser(updated)}
        />
      )}

      <main className="max-w-3xl mx-auto px-5 pt-20 pb-16">
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm mb-8 transition-colors"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> back
        </a>

        {loading ? (
          <div
            className="rounded-2xl animate-pulse"
            style={{ height: 160, background: "var(--surface)", border: "1px solid var(--border)" }}
          />
        ) : !user ? (
          <p className="text-sm" style={{ color: "var(--faint)" }}>User not found.</p>
        ) : (
          <>
            {/* Profile card */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.display_name}
                      className="w-14 h-14 rounded-full"
                      style={{ background: "var(--border)" }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                      style={{ background: "var(--border)", color: "var(--text)" }}
                    >
                      {user.display_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-base" style={{ color: "var(--text)" }}>
                      {user.display_name}
                    </p>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>@{user.username}</p>
                    {user.bio && (
                      <p className="text-xs mt-1 max-w-xs" style={{ color: "var(--muted)" }}>{user.bio}</p>
                    )}
                    {user.location && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--faint)" }}>{user.location}</p>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {isOwnProfile ? (
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border font-medium transition-colors shrink-0"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setFollowing(!following)}
                    className="text-sm px-4 py-1.5 rounded-full border font-medium transition-colors shrink-0"
                    style={{
                      borderColor: following ? "var(--faint)" : "var(--text)",
                      color: following ? "var(--faint)" : "var(--text)",
                    }}
                  >
                    {following ? "following" : "follow"}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-5 mt-4 text-sm" style={{ color: "var(--muted)" }}>
                <span>
                  <strong style={{ color: "var(--text)" }}>
                    {formatNumber(user.followers_count + (following ? 1 : 0))}
                  </strong>{" "}
                  followers
                </span>
                <span>
                  <strong style={{ color: "var(--text)" }}>{user.total_projects}</strong> projects
                </span>
                <span>
                  <strong style={{ color: "var(--text)" }}>{user.total_entries}</strong> entries
                </span>
              </div>

              {/* Social links */}
              {socialEntries.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {socialEntries.map(([type, url]) => (
                    <a
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: "var(--muted)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      <SocialIcon type={type} />
                      {socialLabel(type, url)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Projects timeline */}
            <ProjectsTimeline projects={projects} username={params.username} />
          </>
        )}
      </main>
    </>
  );
}
