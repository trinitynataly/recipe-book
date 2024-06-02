import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/context/ToastContext';
import { PhotoUploadProvider } from '@/context/PhotoUploadContext';
import { BlogProvider } from '@/context/BlogContext';
import Script from 'next/script';
import * as gtag from '@/lib/gtag';
import App from 'next/app';
import { fetchDatoCMS, GET_ALL_CATEGORIES } from '@/lib/datocms';
import '@/styles/scss/main.scss';

function MyApp({ Component, pageProps, blogCategories }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
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
      <SessionProvider session={pageProps.session}>
        <ToastProvider>
          <PhotoUploadProvider>
            <BlogProvider initialCategories={blogCategories}>
              <Component {...pageProps} />
            </BlogProvider>
          </PhotoUploadProvider>
        </ToastProvider>
      </SessionProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const data = await fetchDatoCMS(GET_ALL_CATEGORIES);
  const blogCategories = data?.allCategories;
  return { ...appProps, blogCategories };
};

export default MyApp;
