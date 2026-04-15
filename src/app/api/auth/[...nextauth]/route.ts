import type { NextAuthOptions, Session } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';

interface Token extends JWT {
  role?: string;
}

const isProd = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'ID', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        const matched =
          credentials?.username === process.env.AUTH_USERNAME &&
          credentials?.password === process.env.AUTH_PASSWORD;

        if (matched) {
          // 現状のroleは飾り
          return {
            id: '1',
            name: '管理者',
            role: 'admin',
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: isProd ? 86400 : 300,
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: Token }) {
      session.user = {
        ...session.user,
        role: token.role ?? null,
      } as typeof session.user & { role?: string | null };
      return session;
    },
    async jwt({ token, user }: { token: Token; user?: unknown }) {
      if (user && typeof user === 'object' && 'role' in user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
