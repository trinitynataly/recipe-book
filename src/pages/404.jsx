/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
404 Error page displaying a message that the page was not found
*/

// Import the Fragment from React
import { Fragment } from "react";
// Import the Link component from Next.js for navigation
import Link from 'next/link';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Logo component from the public folder
import Logo from '../../public/recipe_book_logo.svg';

/**
 * Error404 component to display a 404 error page.
 * @returns {JSX.Element}
 */
export default function Error404() {
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>404 - Page Not Found | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Page not found" />
      </Head>
      {/* 404 error page */}
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        {/* Logo and error message */}
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            {/* Logo with link */}
            <Link href="/" passHref>
              <Logo className="mx-auto h-12 w-auto" />
            </Link>
            {/* Error message title */}
            <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404 - Page Not Found</h1>
            {/* Error message description */}
            <p className="mt-2 text-base text-gray-600">Sorry, the page you are looking for does not exist.</p>
          </div>
          <div>
            {/* Go back home button */}
            <Link href="/" className="mt-6 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Go back home
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
