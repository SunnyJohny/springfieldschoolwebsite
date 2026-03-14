// src/components/Hero.jsx
import React, { useEffect, useMemo, useState } from "react";
import { BsList, BsX } from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { getAuth, signOut } from "firebase/auth";
import "swiper/css";
import "swiper/css/autoplay";
import schoolLogo from "../assets/springfield_golden_tulip_academy-removebg-preview.png";

import AuthModal from "./AuthModal";
import { useMyContext } from "../Context/MyContext";

const navLinks = [
  { label: "Home", to: "home" },
  { label: "News", to: "news" },
  { label: "Gallery", to: "gallery" },
  { label: "Academics", to: "academics" },
  { label: "About Us", to: "about" },
  { label: "FAQs", to: "faqs" },
  { label: "Contact", to: "contact" },
];

const fallbackSlides = [
  {
    image: "/images/school-hero-1.jpg",
    title: "Springfield Golden Tulip Academy",
    subtitle: "Journey to Excellence",
  },
  {
    image: "/images/school-hero-2.jpg",
    title: "Springfield Golden Tulip Academy",
    subtitle: "Learning with purpose",
  },
  {
    image: "/images/school-hero-3.jpg",
    title: "Springfield Golden Tulip Academy",
    subtitle: "A place to grow",
  },
];

const Hero = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [loggingOut, setLoggingOut] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const openAuth = (which = "signin") => {
    setMode(which);
    setAuthOpen(true);
  };

  const closeAuth = () => setAuthOpen(false);

  const { gallery, news, newsLoading, newsError, currentUser } = useMyContext();

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const swiperPointerEvents = authOpen ? "none" : "auto";

  const heroSlides = useMemo(() => {
    const items = Array.isArray(gallery) ? gallery : [];
    const clean = items
      .filter((x) => !!x?.src)
      .slice(0, 12)
      .map((x) => ({
        image: x.src,
        title: x.alt || "Springfield Golden Tulip Academy",
        subtitle: x.category || "Journey to Excellence",
      }));

    if (clean.length > 0) return clean;

    return fallbackSlides;
  }, [gallery]);

  const newsPairs = useMemo(() => {
    const items = Array.isArray(news) ? news : [];
    return items
      .map((n) => {
        const t = (n?.title || "").trim();
        const h = (n?.highlight || "").trim();
        if (!t && !h) return null;
        return { title: t, highlight: h };
      })
      .filter(Boolean)
      .slice(0, 10);
  }, [news]);

  const tickerText = useMemo(() => {
    if (newsPairs.length === 0) return "";
    const singleRun = newsPairs
      .map((x) => {
        if (x.title && x.highlight) return `${x.title} — ${x.highlight}`;
        if (x.title) return x.title;
        return x.highlight;
      })
      .join("   •   ");

    return `${singleRun}   •   ${singleRun}`;
  }, [newsPairs]);

  const autoplayConfig = authOpen
    ? false
    : {
        delay: 4500,
        disableOnInteraction: false,
      };

  const loggedInName = useMemo(() => {
    if (!currentUser) return "";
    return (
      currentUser.displayName ||
      currentUser.email ||
      currentUser.phoneNumber ||
      "User"
    );
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      closeMobile();
      closeAuth();
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header id="home" className="relative">
      <style>{`
        @keyframes heroMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className={isSticky ? "h-[118px] md:h-[110px]" : "h-0"} />

      <div
        className={[
          "w-full z-50",
          isSticky ? "fixed top-0 left-0 right-0" : "relative",
        ].join(" ")}
      >
        <div className="w-full bg-blue-900 text-white text-xs md:text-sm shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2 py-2 px-4">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="font-semibold tracking-wide uppercase">
                Questions?
              </span>
              <span>(+234) 803 335 3059</span>
              <span>springfieldshools12@gmail.com</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {currentUser ? (
                <>
                  <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
                    Logged in
                  </span>

                  <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] md:text-xs font-medium max-w-[220px] truncate">
                    {loggedInName}
                  </span>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="bg-red-500 text-white text-xs font-semibold tracking-wide px-4 py-1 rounded-sm uppercase hover:bg-red-600 transition disabled:opacity-70"
                    type="button"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] md:text-xs font-medium">
                    Not logged in
                  </span>

                  <button
                    onClick={() => openAuth("signin")}
                    className="bg-yellow-400 text-blue-900 text-xs font-semibold tracking-wide px-4 py-1 rounded-sm uppercase hover:bg-yellow-300 transition"
                    type="button"
                  >
                    Apply / Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={schoolLogo}
                alt="School Logo"
                className="h-12 w-12 object-contain"
              />
              <div className="leading-tight min-w-0">
                <p className="text-[10px] md:text-xs text-blue-600 tracking-[0.25em] uppercase">
                  Springfield
                </p>
                <p className="text-lg md:text-xl font-extrabold tracking-wide text-blue-900 truncate">
                  Golden Tulip Academy
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-blue-900">
              {navLinks.map((item) => (
                <ScrollLink
                  key={item.label}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-120}
                  duration={500}
                  className="cursor-pointer hover:text-yellow-400"
                >
                  {item.label}
                </ScrollLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-full">
                    Signed in
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition disabled:opacity-70"
                    type="button"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openAuth("signin")}
                  className="text-sm font-semibold text-blue-900 hover:text-yellow-500 transition"
                  type="button"
                >
                  Sign in
                </button>
              )}
            </div>

            <button
              className="md:hidden text-blue-900 text-2xl"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              type="button"
            >
              {mobileOpen ? <BsX /> : <BsList />}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-100">
              <nav className="flex flex-col py-3 px-4 text-sm font-semibold text-blue-900">
                {navLinks.map((item) => (
                  <ScrollLink
                    key={item.label}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-120}
                    duration={500}
                    onClick={closeMobile}
                    className="py-2 border-b border-gray-100 cursor-pointer hover:text-yellow-400"
                  >
                    {item.label}
                  </ScrollLink>
                ))}

                <div className="mt-3 mb-2">
                  {currentUser ? (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                      <span className="font-semibold">Logged in:</span>
                      <span className="truncate">{loggedInName}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      Not logged in
                    </div>
                  )}
                </div>

                {currentUser ? (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-2 w-full bg-red-500 text-white py-2 rounded text-xs font-semibold uppercase hover:bg-red-600 transition disabled:opacity-70"
                    type="button"
                  >
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuth("signin");
                      closeMobile();
                    }}
                    className="mt-2 w-full bg-yellow-400 text-blue-900 py-2 rounded text-xs font-semibold uppercase hover:bg-yellow-300 transition"
                    type="button"
                  >
                    Apply / Login
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>

      <section className="relative">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          autoplay={autoplayConfig}
          allowTouchMove={!authOpen}
          style={{ pointerEvents: swiperPointerEvents }}
          speed={1200}
          loop={true}
          className="h-[85vh] min-h-[520px]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={slide.image}
                alt={slide.title || "School hero"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 z-10 flex items-start justify-center px-4 pt-10 md:pt-8 lg:pt-6 pointer-events-none">
          <div className="max-w-2xl text-center pointer-events-auto">
            <div className="inline-flex flex-col items-center mb-5">
              <div className="bg-white/90 rounded-full p-4 shadow-xl">
                <img
                  src={schoolLogo}
                  alt="School Crest"
                  className="h-20 w-20 md:h-24 md:w-24 object-contain"
                />
              </div>

              <h1 className="mt-4 text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                Springfield Golden Tulip Academy
              </h1>

              <p className="mt-2 text-yellow-300 text-base md:text-xl font-semibold italic tracking-wide">
                Journey to Excellence
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <ScrollLink
                to="admissions"
                spy={true}
                smooth={true}
                offset={-120}
                duration={500}
                className="cursor-pointer"
              >
                <button
                  className="px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-full hover:bg-yellow-300 transition shadow-lg"
                  type="button"
                >
                  Apply
                </button>
              </ScrollLink>
              <div className="absolute left-0 right-0 bottom-0 z-20">
          <div className="max-w-6xl mx-auto px-4 pb-8 md:pb-10">
            <div className="bg-white/90 backdrop-blur rounded-xl border border-white/60 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-[11px] font-extrabold tracking-[0.25em] uppercase text-blue-900">
                  Latest
                </span>

                {newsLoading && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    Loading news…
                  </span>
                )}

                {newsError && !newsLoading && (
                  <span className="text-[11px] font-semibold text-red-600">
                    News load failed
                  </span>
                )}

                {!newsLoading && !newsError && tickerText && (
                  <div className="relative flex-1 overflow-hidden">
                    <div
                      className="whitespace-nowrap text-sm text-slate-700 font-semibold"
                      style={{
                        display: "inline-block",
                        paddingLeft: "100%",
                        animation: "heroMarquee 38s linear infinite",
                      }}
                      title="News highlights"
                    >
                      {tickerText}
                    </div>
                  </div>
                )}

                {!newsLoading && !newsError && !tickerText && (
                  <span className="text-[11px] font-semibold text-slate-500">
                    No news yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>

        
      </section>

      <AuthModal
        open={authOpen}
        mode={mode}
        setMode={setMode}
        onClose={closeAuth}
        onOpenChange={() => {}}
      />
    </header>
  );
};

export default Hero;