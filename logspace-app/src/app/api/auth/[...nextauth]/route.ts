import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createServerClient } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.id || !user.email) return true;

      const db = createServerClient();

      // Derive a username from the email (before the @), lowercased, no special chars
      const baseUsername = user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_");

      // Upsert the user — on conflict (same id) update name/avatar only
      const { error } = await db.from("users").upsert(
        {
          id: user.id,
          username: baseUsername,
          display_name: user.name ?? baseUsername,
          avatar: user.image ?? null,
        },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error("[NextAuth] user upsert failed:", error.message);
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
