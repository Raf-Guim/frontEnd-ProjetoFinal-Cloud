import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/app/services/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.login(credentials.email, credentials.password);
          if (response.user) {
            return {
              id: response.user.id,
              email: response.user.email,
              name: response.user.name,
            };
          }
          return null;
        } catch {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login/email',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
