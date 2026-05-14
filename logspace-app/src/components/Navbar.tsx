"use client";

import { Search, Sun, Moon, LogOut, Plus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "@/lib/useTheme";
import LogspaceLogo from "@/components/LogspaceLogo";

interface NavbarProps {
  onSearchOpen?: () => void;
  onNewPost?: () => void;
}

export default function Navbar({ onSearchOpen, onNewPost }: NavbarProps) {
  const { dark, toggle, mounted } = useTheme();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" style={{ color: "var(--text)" }}>
          <LogspaceLogo size={22} />
          <span className="text-sm font-bold tracking-tight">logspace</span>
        </a>

        <div className="flex items-center gap-3">
          <a href="/explore" className="text-sm" style={{ color: "var(--muted)" }}>explore</a>

          <button onClick={onSearchOpen} aria-label="Search" style={{ color: "var(--muted)" }}>
            <Search className="w-4 h-4" />
          </button>

          {mounted && (
            <button onClick={toggle} aria-label="Toggle theme" style={{ color: "var(--muted)" }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {session ? (
            <div className="flex items-center gap-2 relative">
              {/* New post button */}
              <button
                onClick={onNewPost}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                <Plus className="w-3.5 h-3.5" /> post
              </button>

              {/* Avatar menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="relative">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--border)", color: "var(--text)" }}
                  >
                    {session.user?.name?.[0]}
                  </div>
                )}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-10 w-44 rounded-xl shadow-lg z-50 py-1 overflow-hidden"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>
                        {session.user?.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "var(--faint)" }}>
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                      style={{ color: "var(--muted)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--hover-bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="text-sm px-3 py-1.5 rounded-lg font-medium"
              style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
