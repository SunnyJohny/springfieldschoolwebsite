// src/Context/MyContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { db } from "../firebase";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";

const MyContext = createContext(null);

export const useMyContext = () => {
  const context = useContext(MyContext);
  return context;
};

const SCHOOL_ID = "main";

// =========================
// Browser cache settings
// =========================
const CACHE_KEYS = {
  gallery: `springfieldschool_${SCHOOL_ID}_gallery_cache`,
  news: `springfieldschool_${SCHOOL_ID}_news_cache`,
  role: (uid) => `springfieldschool_${SCHOOL_ID}_role_cache_${uid}`,
};

const CACHE_TTL = {
  gallery: 1000 * 60 * 10, // 10 mins
  news: 1000 * 60 * 5,     // 5 mins
  role: 1000 * 60 * 5,     // 5 mins
};

// =========================
// Safe browser storage helpers
// =========================
const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return parsed;
  } catch (err) {
    console.error("readCache error:", err);
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        savedAt: Date.now(),
        data,
      })
    );
  } catch (err) {
    console.error("writeCache error:", err);
  }
};

const isCacheFresh = (entry, ttl) => {
  if (!entry?.savedAt) return false;
  return Date.now() - entry.savedAt < ttl;
};

// =========================
// Normalize Firestore data
// =========================
const serializeDoc = (snap) => {
  const raw = snap.data() || {};

  let createdAtMs = 0;
  let createdAtISO = null;

  if (typeof raw?.createdAtMs === "number") {
    createdAtMs = raw.createdAtMs;
    createdAtISO = new Date(raw.createdAtMs).toISOString();
  } else if (raw?.createdAt?.toDate) {
    const d = raw.createdAt.toDate();
    createdAtMs = d.getTime();
    createdAtISO = d.toISOString();
  }

  return {
    id: snap.id,
    ...raw,
    createdAtMs,
    createdAtISO,
  };
};

const sortByCreatedDesc = (arr = []) => {
  return [...arr].sort((a, b) => {
    const aMs = typeof a?.createdAtMs === "number" ? a.createdAtMs : 0;
    const bMs = typeof b?.createdAtMs === "number" ? b.createdAtMs : 0;
    return bMs - aMs;
  });
};

export const MyContextProvider = ({ children }) => {
  // ✅ auth
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ role
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ gallery (GLOBAL)
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);

  // ✅ news (GLOBAL)
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);

  // -------------------------
  // 1) Watch auth state
  // -------------------------
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u || null));
    return () => unsub();
  }, []);

  // -------------------------
  // 2) Load role ONCE: springfieldschool/main/users/{uid}
  //    Uses localStorage cache to reduce reads
  // -------------------------
  const loadUserRole = useCallback(async (uid, forceRefresh = false) => {
    if (!uid) {
      setIsAdmin(false);
      return;
    }

    const cacheKey = CACHE_KEYS.role(uid);
    const cached = readCache(cacheKey);

    // ✅ use fresh cache first
    if (!forceRefresh && cached && isCacheFresh(cached, CACHE_TTL.role)) {
      const role = cached?.data?.role || null;
      setIsAdmin(role === "admin");
      return;
    }

    try {
      const userRef = doc(db, "springfieldschool", SCHOOL_ID, "users", uid);
      const snap = await getDoc(userRef);

      const role = snap.exists() ? snap.data()?.role || null : null;

      setIsAdmin(role === "admin");
      writeCache(cacheKey, { role });
    } catch (err) {
      console.error("Role get error:", err);

      // fallback to any cached role if available
      const fallbackRole = cached?.data?.role || null;
      setIsAdmin(fallbackRole === "admin");
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) {
      setIsAdmin(false);
      return;
    }

    loadUserRole(currentUser.uid);
  }, [currentUser?.uid, loadUserRole]);

  // -------------------------
  // 3) Load gallery ONCE: springfieldschool/main/gallery
  //    Uses browser cache first to reduce reads
  // -------------------------
  const loadGallery = useCallback(async (forceRefresh = false) => {
    setGalleryError(null);

    const cached = readCache(CACHE_KEYS.gallery);

    // ✅ show cache immediately if fresh
    if (!forceRefresh && cached && isCacheFresh(cached, CACHE_TTL.gallery)) {
      setGallery(Array.isArray(cached.data) ? cached.data : []);
      setGalleryLoading(false);
      return;
    }

    // if stale cache exists, show it first while fetching fresh data
    if (!forceRefresh && cached && Array.isArray(cached.data)) {
      setGallery(cached.data);
      setGalleryLoading(false);
    } else {
      setGalleryLoading(true);
    }

    try {
      const galleryRef = collection(db, "springfieldschool", SCHOOL_ID, "gallery");
      const q = query(galleryRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const data = snap.docs.map(serializeDoc);
      const sorted = sortByCreatedDesc(data);

      setGallery(sorted);
      setGalleryLoading(false);
      setGalleryError(null);

      writeCache(CACHE_KEYS.gallery, sorted);
    } catch (err) {
      console.error("Gallery get error:", err);

      // fallback to cache if available
      if (cached && Array.isArray(cached.data)) {
        setGallery(cached.data);
      } else {
        setGallery([]);
      }

      setGalleryLoading(false);
      setGalleryError(err?.message || "Failed to load gallery");
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // -------------------------
  // 4) Load news ONCE: springfieldschool/main/news
  //    Strategy:
  //      A) Try orderBy(createdAtMs)
  //      B) Fallback orderBy(createdAt)
  //      C) Fallback no orderBy + client sort
  //    Uses browser cache first to reduce reads
  // -------------------------
  const loadNews = useCallback(async (forceRefresh = false) => {
    setNewsError(null);

    const cached = readCache(CACHE_KEYS.news);

    // ✅ use fresh cache first
    if (!forceRefresh && cached && isCacheFresh(cached, CACHE_TTL.news)) {
      setNews(Array.isArray(cached.data) ? cached.data : []);
      setNewsLoading(false);
      return;
    }

    // if stale cache exists, show it first while fetching fresh data
    if (!forceRefresh && cached && Array.isArray(cached.data)) {
      setNews(cached.data);
      setNewsLoading(false);
    } else {
      setNewsLoading(true);
    }

    const newsRef = collection(db, "springfieldschool", SCHOOL_ID, "news");

    try {
      // PRIMARY: createdAtMs
      const q1 = query(newsRef, orderBy("createdAtMs", "desc"));
      const snap = await getDocs(q1);

      const data = snap.docs.map(serializeDoc);
      const sorted = sortByCreatedDesc(data);

      setNews(sorted);
      setNewsLoading(false);
      setNewsError(null);

      writeCache(CACHE_KEYS.news, sorted);
      return;
    } catch (err1) {
      console.error("News primary get error (createdAtMs):", err1);

      try {
        // FALLBACK 1: createdAt
        const q2 = query(newsRef, orderBy("createdAt", "desc"));
        const snap2 = await getDocs(q2);

        const data2 = snap2.docs.map(serializeDoc);
        const sorted2 = sortByCreatedDesc(data2);

        setNews(sorted2);
        setNewsLoading(false);
        setNewsError(null);

        writeCache(CACHE_KEYS.news, sorted2);
        return;
      } catch (err2) {
        console.error("News fallback get error (createdAt):", err2);

        try {
          // FALLBACK 2: no orderBy + client sort
          const snap3 = await getDocs(newsRef);

          const data3 = snap3.docs.map(serializeDoc);
          const sorted3 = sortByCreatedDesc(data3);

          setNews(sorted3);
          setNewsLoading(false);
          setNewsError(null);

          writeCache(CACHE_KEYS.news, sorted3);
          return;
        } catch (err3) {
          console.error("News fallback get error (no order):", err3);

          if (cached && Array.isArray(cached.data)) {
            setNews(cached.data);
          } else {
            setNews([]);
          }

          setNewsLoading(false);
          setNewsError(err3?.message || "Failed to load news");
        }
      }
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // -------------------------
  // Optional manual refreshers
  // You can call these anywhere in the app
  // -------------------------
  const refreshGallery = useCallback(() => {
    return loadGallery(true);
  }, [loadGallery]);

  const refreshNews = useCallback(() => {
    return loadNews(true);
  }, [loadNews]);

  const refreshRole = useCallback(() => {
    if (!currentUser?.uid) {
      setIsAdmin(false);
      return Promise.resolve();
    }
    return loadUserRole(currentUser.uid, true);
  }, [currentUser?.uid, loadUserRole]);

  const value = useMemo(
    () => ({
      // auth
      currentUser,
      isAdmin,

      // gallery
      gallery,
      galleryLoading,
      galleryError,
      refreshGallery,

      // news
      news,
      newsLoading,
      newsError,
      refreshNews,

      // role
      refreshRole,
    }),
    [
      currentUser,
      isAdmin,
      gallery,
      galleryLoading,
      galleryError,
      news,
      newsLoading,
      newsError,
      refreshGallery,
      refreshNews,
      refreshRole,
    ]
  );

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};