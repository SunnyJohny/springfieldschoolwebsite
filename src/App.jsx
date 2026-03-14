import React from "react";
import "./App.css";

import AboutUs from "./components/AboutUs"; // ✅ make sure this path matches your file name
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
// import Navbar from "./components/Navbar";
import WhatsAppIcon from "./components/watsappComponent";
import NewsSection from "./components/NewsSection";

// ✅ Gallery
import GallerySection from "./components/GallerySection";

// ✅ Academics (Curriculum + Admissions)
import AcademicSection from "./components/Academics";

function App() {
  return (
    <>
      <div>
        {/* <Navbar /> */}
        <Hero />

        <NewsSection />

        <GallerySection />

        <AcademicSection />

        {/* ✅ About Us */}
        <AboutUs />

        <Contact />
        <WhatsAppIcon />
        <Footer />
      </div>
    </>
  );
}

export default App;

