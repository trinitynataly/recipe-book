import '@/styles/scss/main.scss';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/context/ToastContext';
import { PhotoUploadProvider } from '@/context/PhotoUploadContext';
import { BlogProvider } from '@/context/BlogContext';
import App from 'next/app';
import { fetchDatoCMS, GET_ALL_CATEGORIES } from '@/lib/datocms';

function MyApp({ Component, pageProps, blogCategories }) {
    return (
        <SessionProvider session={pageProps.session}>
            <ToastProvider>
                <PhotoUploadProvider>
                    <BlogProvider initialCategories={blogCategories}>
                        <Component {...pageProps} />
                    </BlogProvider>
                </PhotoUploadProvider>
            </ToastProvider>
        </SessionProvider>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    const data = await fetchDatoCMS(GET_ALL_CATEGORIES);
    const blogCategories = data?.allCategories;
    return { ...appProps, blogCategories };
};

export default MyApp;
