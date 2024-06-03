/*
Version: 1.6
Last edited by: Natalia Pakhomova
Last edit date: 01/06/2024
NextAuth authentication configuration and API endpoints
*/

// Import the NextAuth library
import NextAuth from 'next-auth';
// Import the CredentialsProvider from the NextAuth providers
import CredentialsProvider from 'next-auth/providers/credentials';
// Import the User model
import User from '@/models/User';
// Import the verifyPassword, generateTokens, and verifyToken functions from the auth library
import { verifyPassword, generateTokens, verifyToken } from '@/lib/auth';
// Import the dbConnect function from the MongoDB connection library
import dbConnect from '@/lib/mongodb';

// Define the authentication options
export const authOptions = {
  // Define the authentication providers
  providers: [
    // Define the CredentialsProvider for email and password authentication
    CredentialsProvider({
      // Define the provider name
      name: 'Credentials',
      // Define the credentials fields
      credentials: {
        email: { label: 'Email', type: 'email' }, // Define the email field
        password: { label: 'Password', type: 'password' }, // Define the password field
      },
      // Define the authorize function for email and password authentication
      async authorize(credentials) {
        // Connect to the MongoDB database
        await dbConnect();
        // Find the user by email
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        // Check if the user exists
        if (!user) {
          // Throw an error if the user does not exist
          throw new Error('No user found with the provided email.');
        }
        // Verify the password
        const isValid = await verifyPassword(credentials.password, user.password);
        // Check if the password is valid
        if (!isValid) {
          // Throw an error if the password is invalid
          throw new Error('Invalid password.');
        }
        // Return the user data
        return {
          id: user._id, // User ID
          email: user.email,// User email
          firstName: user.firstName, // User first name
          lastName: user.lastName, // User last name
          isAdmin: user.isAdmin, // User admin flag
          name: `${user.firstName} ${user.lastName}`, // User full name
        };
      },
    }),
  ],
  // Define the session options
  session: {
    strategy: 'jwt', // Use the JWT strategy
  },
  // Define the callbacks
  callbacks: {
    // Define the JWT callback
    async jwt({ token, user }) {
      // If user object have been supplied this means this is a sign in
      if (user) {
        // Set token id, name, email, first name, last name, and admin flag
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;
        // Generate new tokens
        const newTokens = generateTokens({ _id: user.id });
        // Set the access token, refresh token, and access token expiry
        token.accessToken = newTokens.access_token;
        token.refreshToken = newTokens.refresh_token;
        token.accessTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      }
      // For token validation check if the access token has expired (it expires in 10 minutes unless refreshed)
      if (Date.now() >= token.accessTokenExpires) {
        // Attempt to refresh the tokens
        try {
          // Verify the refresh token
          const verifiedRefreshToken = verifyToken(token.refreshToken);
          // Check if the refresh token is valid
          if (verifiedRefreshToken) {
            // Generate new tokens
            const refreshedTokens = generateTokens({ _id: token.id });
            // Set the access token, refresh token, and access token expiry
            token.accessToken = refreshedTokens.access_token;
            token.refreshToken = refreshedTokens.refresh_token;
            token.accessTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
          } else {
            // Throw an error if the refresh token is invalid
            throw new Error('Invalid refresh token');
          }
        } catch (error) { // Catch any errors
          // Log the error
          console.error('Error refreshing token:', error);
        }
      }
      // Return the token
      return token;
    },
    // Define the session callback
    async session({ session, token }) {
        // Set the user id, name, email, first name, last name, and admin flag
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.isAdmin = token.isAdmin;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      // Return the session
      return session;
    },
  },
  // Define the events
  events: {
    // Define the signIn event
    async signIn({ user, account, profile, isNewUser }) {
      // Generate new tokens
      const tokens = generateTokens({ _id: user.id });
      // Set the access token and refresh token
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token;
      return true;
    },
  },
  // Define the custom page URLs
  pages: {
    signIn: '/login', // Sign in page
    signOut: '/logout', // Sign out page
  },
  // Define the secret for the NextAuth session token
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the NextAuth authentication options
export default NextAuth(authOptions);
