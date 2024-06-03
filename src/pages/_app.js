/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
404 Error page displaying a message that the page was not found
*/

// Import the Fragment from React
import { Fragment } from "react";
// Import useEffect hook from React
import { useEffect } from 'react';
// Import useRouter hook from Next.js for routing
import { useRouter } from 'next/router';
// Import the SessionProvider component from the next-auth/react library
import { SessionProvider } from 'next-auth/react';
// Import the ToastProvider component from the ToastContext
import { ToastProvider } from '@/context/ToastContext';
// Import the PhotoUploadProvider component from the PhotoUploadContext
import { PhotoUploadProvider } from '@/context/PhotoUploadContext';
// Import the BlogProvider component from the BlogContext
import { BlogProvider } from '@/context/BlogContext';
// Import the Script component from Next.js for loading scripts
import Script from 'next/script';
// Import the gtag module from the gtag library
import * as gtag from '@/lib/gtag';
// Import the App component from Next.js
import App from 'next/app';
// Import the fetchDatoCMS function from the datocms library and queries for fetching data
import { fetchDatoCMS, GET_ALL_CATEGORIES } from '@/lib/datocms';
// Import the main stylesheet
import '@/styles/scss/main.scss';

/**
 * MyApp component to wrap the application with context providers.
 * @param Component - the component to render
 * @param pageProps - the page properties
 * @param blogCategories - the list of blog categories
 * @returns {JSX.Element}
 */
function MyApp({ Component, pageProps, blogCategories }) {
  // Get the router object
  const router = useRouter();

  // Track page views with Google Analytics
  useEffect(() => {
    // Function to handle route changes
    const handleRouteChange = (url) => {
      // Send the page view event to Google Analytics
      gtag.pageview(url);
    };
    // Add the route change event listener
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      // Remove the route change event listener
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]); // Only re-run the effect if the router events change
  return (
    <Fragment>
      {/* Google Analytics Gtag script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      {/* Google Analytics initialization script */}
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
            });
          `,
        }}
      />
      {/* Init session provider */}
      <SessionProvider session={pageProps.session}>
        {/* Init toast provider */}
        <ToastProvider>
          {/* Init photo upload provider */}
          <PhotoUploadProvider>
            {/* Init blog provider with initial categories */}
            <BlogProvider initialCategories={blogCategories}>
              {/* Render the component */}
              <Component {...pageProps} />
            </BlogProvider>
          </PhotoUploadProvider>
        </ToastProvider>
      </SessionProvider>
    </Fragment>
  );
}

// Fetch the initial props for the MyApp component
MyApp.getInitialProps = async (appContext) => {
  // Fetch the initial props from the App component
  const appProps = await App.getInitialProps(appContext);
  // Fetch all categories from DatoCMS
  const data = await fetchDatoCMS(GET_ALL_CATEGORIES);
  // Get the blog categories from the fetched data
  const blogCategories = data?.allCategories;
  // Return the app props and blog categories
  return { ...appProps, blogCategories };
};

// Export the MyApp component
export default MyApp;
