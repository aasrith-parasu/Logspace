"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

// One accent color per project (cycles through palette)
const ACCENT_COLORS = [
  "#4f8ef7", // blue
  "#34c77b", // green
  "#f7934f", // orange
  "#c44ff7", // purple
  "#f74f7a", // pink
  "#4fc9f7", // cyan
  "#f7d44f", // yellow
];

interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  status?: string;
  start_date?: string;
  startDate?: string;
  entry_count?: number;
  entryCount?: number;
  cover_image?: string;
  coverImage?: string;
  updated_at?: string;
}

interface Props {
  projects: Project[];
  username: string;
}

// ── Stacked (collapsed) view ──────────────────────────────────────────────────
function StackedView({ projects, onExpand }: { projects: Project[]; onExpand: () => void }) {
  const visible = projects.slice(0, 3);
  const STACK_OFFSET = 8;

  return (
    <button
      onClick={onExpand}
      className="relative w-full group"
      style={{ height: 120 + visible.length * STACK_OFFSET }}
      aria-label="Expand project timeline"
    >
      {/* Render cards back-to-front so top card is on top */}
      {[...visible].reverse().map((project, ri) => {
        const i = visible.length - 1 - ri; // actual index
        const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
        const isTop = i === 0;

        return (
          <div
            key={project.id}
            className="absolute left-0 right-0 rounded-2xl overflow-hidden transition-transform duration-300"
            style={{
              top: i * STACK_OFFSET,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderTop: `3px solid ${color}`,
              zIndex: visible.length - i,
              transform: isTop ? "scale(1)" : `scale(${1 - i * 0.015})`,
              transformOrigin: "top center",
              filter: isTop ? "none" : `brightness(${1 - i * 0.06})`,
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                  {project.title}
                </p>
                {isTop && (
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--muted)" }}>
                    {project.tagline}
                  </p>
                )}
              </div>
              {isTop && (
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className="text-xs" style={{ color: "var(--faint)" }}>
                    {projects.length} project{projects.length !== 1 ? "s" : ""}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--faint)" }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </button>
  );
}

// ── Horizontal timeline (expanded) view ───────────────────────────────────────
function HorizontalTimeline({
  projects,
  username,
  onCollapse,
}: {
  projects: Project[];
  username: string;
  onCollapse: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const CARD_W = 200;
  const CARD_H = 130;
  const COL_GAP = 80; // gap between node centers
  const NODE_R = 10;
  const LINE_Y = 180; // y-center of the spine line within the container
  const ABOVE_H = LINE_Y - NODE_R - 16; // space for cards above
  const BELOW_TOP = LINE_Y + NODE_R + 16;

  const totalWidth = Math.max(projects.length * (CARD_W + COL_GAP) + COL_GAP, 600);

  return (
    <div>
      {/* Collapse button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--faint)" }}>
          Projects
        </p>
        <button
          onClick={onCollapse}
          className="text-xs flex items-center gap-1 transition-colors"
          style={{ color: "var(--faint)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--muted)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--faint)")}
        >
          collapse
        </button>
      </div>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4"
        style={{ cursor: "grab" }}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          el.style.cursor = "grabbing";
          const startX = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX);
          };
          const onUp = () => {
            el.style.cursor = "grab";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        <div
          className="relative select-none"
          style={{ width: totalWidth, height: LINE_Y + CARD_H + 40 }}
        >
          {/* Spine line */}
          <div
            className="absolute"
            style={{
              top: LINE_Y,
              left: COL_GAP / 2,
              width: totalWidth - COL_GAP,
              height: 2,
              background: "var(--border)",
            }}
          />

          {projects.map((project, i) => {
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
            const nodeX = COL_GAP / 2 + i * (CARD_W + COL_GAP) + CARD_W / 2;
            const isAbove = i % 2 === 0;
            const startDate = project.start_date ?? project.startDate ?? "";
            const year = startDate ? new Date(startDate).getFullYear() : "";
            const entryCount = project.entry_count ?? project.entryCount ?? 0;
            const coverImage = project.cover_image ?? project.coverImage ?? "";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: isAbove ? -20 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
              >
                {/* Node circle */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: NODE_R * 2,
                    height: NODE_R * 2,
                    top: LINE_Y - NODE_R,
                    left: nodeX - NODE_R,
                    border: `2.5px solid ${color}`,
                    background: "var(--bg)",
                    zIndex: 2,
                  }}
                />

                {/* Connector line from node to card */}
                <div
                  className="absolute"
                  style={{
                    width: 2,
                    background: color,
                    left: nodeX - 1,
                    top: isAbove ? LINE_Y - NODE_R - 16 - 40 : LINE_Y + NODE_R,
                    height: 40 + 16,
                    opacity: 0.5,
                  }}
                />

                {/* Card */}
                <a
                  href={`/u/${username}/projects/${project.slug}`}
                  className="absolute rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    left: nodeX - CARD_W / 2,
                    top: isAbove ? LINE_Y - NODE_R - 16 - 40 - CARD_H : BELOW_TOP + 40,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderTop: `3px solid ${color}`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="w-full object-cover shrink-0"
                      style={{ height: 48 }}
                    />
                  )}
                  <div className="p-2.5 flex flex-col justify-between flex-1 min-h-0">
                    <div>
                      <p className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: "var(--text)" }}>
                        {project.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      {year && (
                        <span className="text-xs font-medium" style={{ color }}>
                          {year}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: "var(--faint)" }}>
                        {entryCount} entries
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProjectsTimeline({ projects, username }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (projects.length === 0) {
    return <p className="text-sm" style={{ color: "var(--faint)" }}>No public projects yet.</p>;
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.div
            key="stacked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--faint)" }}>
                Projects
              </p>
              <span className="text-xs" style={{ color: "var(--faint)" }}>click to expand</span>
            </div>
            <StackedView projects={projects} onExpand={() => setExpanded(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HorizontalTimeline
              projects={projects}
              username={username}
              onCollapse={() => setExpanded(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
