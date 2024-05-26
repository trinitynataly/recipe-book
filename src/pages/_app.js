import "@/styles/scss/main.scss";
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from "@/context/ToastContext";
import { PhotoUploadProvider } from "@/context/PhotoUploadContext";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <ToastProvider>
        <PhotoUploadProvider>
          <Component {...pageProps} />;
        </PhotoUploadProvider>
      </ToastProvider>
    </UserProvider>
  )
}
