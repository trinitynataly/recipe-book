import "@/styles/scss/main.scss";
import { useEffect } from 'react';
import App from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import axios from 'axios';
import { ToastProvider } from "@/context/ToastContext";
import { PhotoUploadProvider } from "@/context/PhotoUploadContext";
import { BlogProvider } from "@/context/BlogContext";
import { fetchDatoCMS, GET_ALL_CATEGORIES } from '@/lib/datocms';

function MyApp({ Component, pageProps, blogCategories }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastProvider>
        <PhotoUploadProvider>
          <BlogProvider initialCategories={blogCategories}>
            <Component {...pageProps} />;
          </BlogProvider>
        </PhotoUploadProvider>
      </ToastProvider>
    </SessionProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const data = await fetchDatoCMS(GET_ALL_CATEGORIES);
  const blogCategories = data?.allCategories;
  return { ...appProps, blogCategories };
};

function useAutoRefreshToken() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      const interval = setInterval(async () => {
        try {
          await axios.get('/api/auth/session?update');
        } catch (error) {
          console.error('Error refreshing session:', error);
        }
      }, 9 * 60 * 1000); // 9 minutes

      return () => clearInterval(interval);
    }
  }, [session]);
}

export default MyApp;