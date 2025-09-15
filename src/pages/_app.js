// src/pages/_app.js
import { useRouter } from "next/router";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const hideFooterRoutes = ["/chat"]; // pages where footer should be hidden

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      {!hideFooterRoutes.includes(router.pathname) && <Footer />}
    </div>
  );
}
