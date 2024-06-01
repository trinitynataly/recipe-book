import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel from '@/models/User';
import { verifyPassword, generateTokens, verifyToken } from '@/lib/auth'; // Changed import
import dbConnect from '@/lib/mongodb';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email.toLowerCase() });
        if (!user) {
          throw new Error('No user found with the provided email.');
        }

        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password.');
        }

        return { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin, name: `${user.firstName} ${user.lastName}` };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 10 * 60, // 10 minutes
  },
  callbacks: {
    async jwt({ token, user, account }) { // Updated callback
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;

        const tokens = generateTokens({ _id: user.id }); // New token generation
        token.accessToken = tokens.access_token;
        token.refreshToken = tokens.refresh_token;
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      try {
        const refreshedTokens = generateTokens({ _id: token.id }); // New token refresh logic
        token.accessToken = refreshedTokens.access_token;
        token.refreshToken = refreshedTokens.refresh_token;
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000;
      } catch (error) {
        console.error('Error refreshing token:', error);
        return token;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.isAdmin = token.isAdmin;
      session.accessToken = token.accessToken; // Updated session
      session.refreshToken = token.refreshToken; // Updated session
      return session;
    },
  },
  events: { // New event
    async signIn({ user, account, profile, isNewUser }) {
      const tokens = generateTokens({ _id: user.id });
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: { // New cookies section
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    refreshToken: {
      name: `next-auth.refresh-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
};

export default NextAuth(authOptions);
