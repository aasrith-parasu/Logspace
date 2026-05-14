"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { formatRelativeTime, formatNumber } from "@/lib/utils";

interface ProjectCardProps {
  project: any; // supports both DB shape and legacy mock shape
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [liked, setLiked] = useState(false);

  // DB shape: project.users is the joined user row
  // Mock shape: project.userId string + separate lookup (legacy, fading out)
  const creator = project.users ?? null;
  const creatorName = creator?.username ?? creator?.display_name ?? "unknown";
  const creatorAvatar = creator?.avatar ?? "";
  const creatorHref = creator?.username ? `/u/${creator.username}` : "/";

  // Entries: DB returns them separately via a second query; for now use entry_count
  const entryCount = project.entry_count ?? project.entryCount ?? 0;
  const totalReactions = project.total_reactions ?? project.totalReactions ?? 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow hover:shadow-md flex flex-col"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Cover image */}
      {project.cover_image || project.coverImage ? (
        <a
          href={`/u/${creator?.username}/projects/${project.slug}`}
          className="block relative shrink-0"
        >
          <img
            src={project.cover_image ?? project.coverImage}
            alt={project.title}
            className="w-full object-cover"
            style={{ height: 160 }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <Heart
              className="w-3.5 h-3.5"
              style={{
                color: liked ? "#ff385c" : "#fff",
                fill: liked ? "#ff385c" : "transparent",
              }}
            />
          </button>
        </a>
      ) : null}

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Creator */}
        <div className="flex items-center justify-between">
          <a href={creatorHref} className="flex items-center gap-1.5">
            {creatorAvatar ? (
              <img src={creatorAvatar} alt={creatorName} className="w-5 h-5 rounded-full" />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--border)", color: "var(--text)" }}
              >
                {creatorName[0]}
              </div>
            )}
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {creatorName}
            </span>
          </a>
          <span className="text-xs" style={{ color: "var(--faint)" }}>
            {formatRelativeTime(project.updated_at ?? project.startDate ?? "")}
          </span>
        </div>

        {/* Title + tagline */}
        <a href={`/u/${creator?.username}/projects/${project.slug}`}>
          <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text)" }}>
            {project.title}
          </p>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted)" }}>
            {project.tagline}
          </p>
        </a>

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-1 text-xs"
          style={{ color: "var(--faint)" }}
        >
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1"
            style={{ color: liked ? "#ff385c" : "var(--faint)" }}
          >
            <Heart
              className="w-3 h-3"
              style={{ fill: liked ? "#ff385c" : "transparent" }}
            />
            {formatNumber(totalReactions + (liked ? 1 : 0))}
          </button>
          <span>{entryCount} entries</span>
        </div>
      </div>
    </div>
  );
}
