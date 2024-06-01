import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel from '@/models/User';
import { verifyPassword, generateTokens, verifyToken } from '@/lib/auth';
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

        return {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          name: `${user.firstName} ${user.lastName}`,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;

        const newTokens = generateTokens({ _id: user.id });
        token.accessToken = newTokens.access_token;
        token.refreshToken = newTokens.refresh_token;
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      }

      // Check if the access token has expired
      if (Date.now() >= token.accessTokenExpires) {
        try {
          const verifiedRefreshToken = verifyToken(token.refreshToken);
          if (verifiedRefreshToken) {
            const refreshedTokens = generateTokens({ _id: token.id });
            token.accessToken = refreshedTokens.access_token;
            token.refreshToken = refreshedTokens.refresh_token;
            token.accessTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
          } else {
            throw new Error('Invalid refresh token');
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      const tokens = generateTokens({ _id: user.id });
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
      return true;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
