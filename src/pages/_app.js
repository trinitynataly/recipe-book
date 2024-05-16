import "@/styles/scss/main.scss";
import useTokenRefresh from "@/hooks/useTokenRefresh";

export default function App({ Component, pageProps }) {
  useTokenRefresh();
  return <Component {...pageProps} />;
}
