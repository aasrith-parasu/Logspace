"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { MOCK_PROJECTS, MOCK_USERS, aiSearch } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";

interface Props { isOpen: boolean; onClose: () => void; }

export default function AiSearchSidebar({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(MOCK_PROJECTS);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 60);
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults(MOCK_PROJECTS); return; }
    setSearching(true);
    setTimeout(() => {
      const found = aiSearch(q, MOCK_PROJECTS);
      setResults(found.length ? found : MOCK_PROJECTS);
      setSearching(false);
    }, 300);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)" }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-80 z-50 flex flex-col"
            style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="search projects…"
                className="flex-1 bg-transparent text-sm"
                style={{ color: "var(--text)" }}
              />
              {searching && (
                <div className="w-3 h-3 border-2 rounded-full animate-spin shrink-0"
                  style={{ borderColor: "var(--border)", borderTopColor: "var(--muted)" }} />
              )}
              <button onClick={onClose} className="transition-colors shrink-0" style={{ color: "var(--faint)" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {results.map((project) => {
                const creator = MOCK_USERS.find((u) => u.id === project.userId);
                return (
                  <a
                    key={project.id}
                    href={`/u/${creator?.username}/projects/${project.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--hover-bg)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {project.coverImage && (
                      <img
                        src={project.coverImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                        style={{ background: "var(--border)" }}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                        {project.title}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                        {creator?.username} · {project.tagline}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="px-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--faint)" }}>esc to close</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
