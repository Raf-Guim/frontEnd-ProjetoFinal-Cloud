import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock user for demonstration
const MOCK_USER = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
  password: "password123"
};

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

        // Mock authentication logic
        if (credentials.email === MOCK_USER.email && 
            credentials.password === MOCK_USER.password) {
          return {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            email: MOCK_USER.email
          };
        }
        return null;
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
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
