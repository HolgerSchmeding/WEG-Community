import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Benutzer-Rollen aus Token hinzufügen
      if (session?.user?.email) {
        try {
          // Standard-Rolle für neue Benutzer
          (session.user as any).roles = ['resident'];
          (session.user as any).id = token.sub;
        } catch (error) {
          console.error('Fehler beim Laden der Benutzer-Rollen:', error);
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.id = user.id;
        // Hier könnten wir Rollen aus der Datenbank laden
        token.roles = ['resident'];
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
