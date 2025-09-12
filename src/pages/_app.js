// src/pages/_app.js
import "../styles/globals.css";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default MyApp;
