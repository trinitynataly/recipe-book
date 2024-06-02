/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A footer component for displaying the copyright notice and privacy policy link.
*/

// Import the Fragment component from React for grouping elements
import { Fragment } from 'react';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';

/**
 * Footer component to display the copyright notice and privacy policy link.
 * Footer component properties:
 * @returns a footer with the copyright notice and privacy policy link
 */
const Footer = () => {
  // Return the footer
  return (
    <Fragment>
      {/* Footer container */}
      <footer className="w-full py-4 bg-gray-800 text-gray-400 text-center mt-auto">
        {/* Copyright notice container */}
        <div className="container mx-auto px-4">
          {/* Copyright notice */}
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Recipe Book. All rights reserved. | 
            {/* Privacy policy link */}
            <Link href="/privacy-policy" className="text-gray-300 hover:underline ml-2">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </Fragment>
  );
};

// Export the Footer component
export default Footer;
