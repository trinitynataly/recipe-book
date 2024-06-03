/*
Version: 1.6
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Home page displaying a list of recipes
*/

// Import the Fragment component and useState hook from React
import { Fragment, useState } from "react";
// Import the signIn function and useSession hook from next-auth/react
import { signIn, useSession } from 'next-auth/react';
// Import the useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the Logo component from the public folder
import Logo from '../../public/recipe_book_logo.svg';
import Head from "next/head";

/**
 * Login component to display a login form.
 * @returns {JSX.Element}
 */
export default function Login() {
  // Define the email and password state variables
  const [email, setEmail] = useState('');
  // Define the password state variable
  const [password, setPassword] = useState('');
  // Define the error state variable
  const [error, setError] = useState('');
  // Get the router object
  const router = useRouter();
  // Get the session object
  const { data: session, status } = useSession();
  // Check if the session is loading
  const loading = status === 'loading';

  // Handle the form submission
  const handleSubmit = async (event) => {
    // Prevent the default form submission
    event.preventDefault();
    // Reset the error message
    setError('');

    // Convert the email to lowercase
    const lowerCaseEmail = email.toLowerCase();
    // Sign in with the email and password
    const res = await signIn('credentials', { redirect: false, email: lowerCaseEmail, password });
    // Check if there is an error
    if (res.error) {
      // Set the error message if there is an error
      setError(res.error);
    } else {
      // Redirect to the home page if there is no error
      router.push('/');
    }
  };

  // Return the login form
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Please Login | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Welcome to Recipe Book App" />
      </Head>
      {/* Login form container */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Login form block */}
        <div className="max-w-md w-full space-y-8">
          {/* Logo and title */}
          <div>
            {/* Logo with link */}
            <Link href="/" passHref>
              <Logo className="text-gray-900" />
            </Link>
            {/* Login form title */}
            <h2 className="mt-6 text-center text-3xl font-medium text-gray-600">
              Sign in to your account
            </h2>
            {/* Error message */}
            {error && <p className="text-center text-red-500">{error}</p>}
          </div>
          {/* Login form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              {/* Email address input */}
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password input */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {/* Sign in button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-tertiary focus:bg-tertiary bg-primary"
              >
                Sign in
              </button>
            </div>
          </form>
          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/register" className="text-gray-600 hover:text-tertiary">
                Don&apos;t have an account? Click here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
