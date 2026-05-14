"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Entry {
  id: string;
  title?: string | null;
  body: string;
  date: string;
  is_milestone?: boolean;
  isMilestone?: boolean;
  mood_tag?: string | null;
  moodTag?: string | null;
  media_urls?: string[];
  mediaUrls?: string[];
  reactions?: { heart: number; fire: number; celebrate: number; inspired: number } | any;
  comment_count?: number;
  commentCount?: number;
}

interface ProjectLike {
  startDate?: string;
  start_date?: string;
  entries: Entry[];
}

export default function ProjectTimeline({ project }: { project: ProjectLike }) {
  const startDate = project.start_date ?? project.startDate ?? "";

  return (
    <div>
      {project.entries.map((entry, i) => (
        <Entry key={entry.id} entry={entry} isLast={i === project.entries.length - 1} />
      ))}

      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center" style={{ width: 16 }}>
          <div className="w-px h-3" style={{ background: "var(--border)" }} />
          <div className="w-2 h-2 rounded-full border" style={{ borderColor: "var(--border)" }} />
        </div>
        <p className="text-xs pb-1" style={{ color: "var(--faint)" }}>
          started {startDate}
        </p>
      </div>
    </div>
  );
}

function Entry({ entry, isLast }: { entry: Entry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const isMilestone = entry.is_milestone ?? entry.isMilestone ?? false;
  const mediaUrls = entry.media_urls ?? entry.mediaUrls ?? [];
  const commentCount = entry.comment_count ?? entry.commentCount ?? 0;

  // reactions can be a jsonb object from DB or a typed object from mock
  const r = entry.reactions ?? { heart: 0, fire: 0, celebrate: 0, inspired: 0 };
  const totalReactions =
    (r.heart ?? 0) + (r.fire ?? 0) + (r.celebrate ?? 0) + (r.inspired ?? 0);

  const long = entry.body.length > 280;
  const body = long && !expanded ? entry.body.slice(0, 280) + "…" : entry.body;

  return (
    <div className="flex gap-4">
      {/* Spine */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 16 }}>
        <div
          className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 border-2"
          style={{
            background: isMilestone ? "var(--text)" : "var(--surface)",
            borderColor: isMilestone ? "var(--text)" : "var(--border)",
          }}
        />
        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: "var(--border)" }} />}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 pb-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
        >
          {/* Image */}
          {mediaUrls.length > 0 && (
            <img
              src={mediaUrls[0]}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 200 }}
            />
          )}

          <div className="p-4">
            {/* Date + milestone badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs" style={{ color: "var(--faint)" }}>
                {entry.date}
              </span>
              {isMilestone && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--hover-bg)", color: "var(--muted)" }}
                >
                  milestone
                </span>
              )}
            </div>

            {entry.title && (
              <p className="font-semibold text-sm mb-1.5" style={{ color: "var(--text)" }}>
                {entry.title}
              </p>
            )}

            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {body}
            </p>

            {long && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-0.5 text-xs mt-1.5 transition-colors"
                style={{ color: "var(--faint)" }}
              >
                {expanded ? (
                  <><ChevronUp className="w-3 h-3" />show less</>
                ) : (
                  <><ChevronDown className="w-3 h-3" />show more</>
                )}
              </button>
            )}

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-3 pt-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: liked ? "#ff385c" : "var(--faint)" }}
              >
                <Heart
                  className="w-3.5 h-3.5"
                  style={{
                    fill: liked ? "#ff385c" : "transparent",
                    color: liked ? "#ff385c" : "var(--faint)",
                  }}
                />
                {formatNumber(totalReactions + (liked ? 1 : 0))}
              </button>
              {commentCount > 0 && (
                <span className="text-xs" style={{ color: "var(--faint)" }}>
                  {commentCount} comments
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
