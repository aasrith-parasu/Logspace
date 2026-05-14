"use client";

import { useState, useRef } from "react";
import { X, Image } from "lucide-react";
import { useSession } from "next-auth/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewPostModal({ isOpen, onClose, onCreated }: Props) {
  const { data: session } = useSession();

  // Project fields
  const [projectName, setProjectName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Entry fields
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [entryImageUrl, setEntryImageUrl] = useState("");
  const [entryPreview, setEntryPreview] = useState<string | null>(null);

  // UI state
  const [showExtras, setShowExtras] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const entryInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setCoverImageUrl(url); // in a real app you'd upload to Supabase Storage first
  }

  function handleEntryFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEntryPreview(url);
    setEntryImageUrl(url);
  }

  function reset() {
    setProjectName(""); setGithubUrl(""); setCoverImageUrl(""); setCoverPreview(null);
    setTitle(""); setBody(""); setEntryImageUrl(""); setEntryPreview(null);
    setShowExtras(false); setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const linkedUrls: { label: string; url: string }[] = [];
      if (githubUrl.trim()) linkedUrls.push({ label: "GitHub", url: githubUrl.trim() });

      // 1. Create project
      const projectRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectName.trim() || "Untitled Project",
          tagline: title.trim() || body.slice(0, 80),
          visibility: "Public",
          coverImage: coverImageUrl || null,
          linkedUrls,
        }),
      });

      if (!projectRes.ok) {
        const err = await projectRes.json();
        throw new Error(err.error ?? "Failed to create project");
      }

      const project = await projectRes.json();

      // 2. Create first entry
      const entryRes = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          title: title.trim() || null,
          entryBody: body.trim(),
          moodTag: "Just Getting Started",
          mediaUrls: entryImageUrl ? [entryImageUrl] : [],
        }),
      });

      if (!entryRes.ok) {
        const err = await entryRes.json();
        throw new Error(err.error ?? "Failed to create entry");
      }

      reset();
      onCreated();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 sticky top-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2">
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
            )}
            <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {session?.user?.name}
            </span>
          </div>
          <button onClick={() => { reset(); onClose(); }} style={{ color: "var(--faint)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">

          {/* ── Project section ── */}
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--faint)" }}>
            Project
          </p>

          <input
            type="text"
            placeholder="Project name *"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg"
            style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          />

          {/* Cover image */}
          <div>
            {coverPreview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setCoverPreview(null); setCoverImageUrl(""); }}
                  className="absolute top-2 right-2 p-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-colors"
                style={{ border: "1px dashed var(--border)", color: "var(--faint)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--muted)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <Image className="w-4 h-4" />
                Add cover image
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverFile}
            />
          </div>

          {/* GitHub link */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "var(--hover-bg)", border: "1px solid var(--border)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--faint)", flexShrink: 0 }}>
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <input
              type="url"
              placeholder="GitHub repo URL (optional)"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="flex-1 bg-transparent text-sm"
              style={{ color: "var(--text)" }}
            />
          </div>

          {/* ── Entry section ── */}
          <p className="text-xs font-semibold uppercase tracking-wide mt-1" style={{ color: "var(--faint)" }}>
            First update
          </p>

          <input
            type="text"
            placeholder="Update title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg"
            style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          />

          <textarea
            placeholder="What did you work on? *"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full text-sm px-3 py-2 rounded-lg resize-none"
            style={{ background: "var(--hover-bg)", border: "1px solid var(--border)", color: "var(--text)" }}
          />

          {/* Entry image */}
          <div>
            {entryPreview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ height: 120 }}>
                <img src={entryPreview} alt="entry" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setEntryPreview(null); setEntryImageUrl(""); }}
                  className="absolute top-2 right-2 p-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => entryInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: "var(--faint)" }}
              >
                <Image className="w-3.5 h-3.5" />
                Attach image to update
              </button>
            )}
            <input
              ref={entryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleEntryFile}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#e55" }}>{error}</p>
          )}

          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ color: "var(--muted)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              {submitting ? "Posting…" : "Post update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
