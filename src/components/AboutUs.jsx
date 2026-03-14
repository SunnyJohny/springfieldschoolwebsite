// src/components/AboutUs.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BsArrowRight,
  BsShieldCheck,
  BsGlobe2,
  BsHeartPulse,
  BsStars,
  BsCheck2Circle,
  BsMusicNoteBeamed,
  BsTrophy,
  BsSun,
  BsController,
  BsBrush,
  BsPalette,
} from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";

import schoolLogo from "../assets/springfield_golden_tulip_academy-removebg-preview.png";

// ✅ IMPORTANT: this path MUST match your real file location + name
import ownerPic from "../assets/madam_semira.png";

const container = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const values = [
  { letter: "D", word: "Discipline" },
  { letter: "E", word: "Excellence" },
  { letter: "S", word: "Service" },
  { letter: "I", word: "Integrity" },
  { letter: "R", word: "Respect" },
  { letter: "E", word: "Equity" },
];

const paradigms = [
  { label: "Music", icon: <BsMusicNoteBeamed /> },
  { label: "Sports", icon: <BsTrophy /> },
  { label: "Outdoor Games", icon: <BsSun /> },
  { label: "Indoor Games", icon: <BsController /> },
  { label: "Art & Craft", icon: <BsBrush /> },
  { label: "Painting", icon: <BsPalette /> },
];

const AboutUs = ({
  schoolName = "Springfield Golden Tulip Academy",
  tagline = "Journey to Excellence",
  ownerName = "Madam Semira",
  ownerRole = "School Proprietress",
}) => {
  const breadcrumbs = useMemo(() => ["Home", "About us"], []);

  return (
    <section
      id="about"
      className="bg-white py-16 md:py-20 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top title + breadcrumb */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-blue-700 mb-2">
            About us
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {breadcrumbs.map((b, i) => (
              <span key={b} className="inline-flex items-center gap-2">
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-blue-900 font-semibold"
                      : ""
                  }
                >
                  {b}
                </span>
                {i !== breadcrumbs.length - 1 && (
                  <span className="text-slate-300">/</span>
                )}
              </span>
            ))}
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-blue-900 leading-tight">
            The Journey
          </h2>
        </motion.div>

        {/* ✅ SIDE-BY-SIDE (BIG SCREEN): Owner picture + write-up */}
        {/* ✅ Uses md breakpoint so it becomes side-by-side earlier */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-5 items-start mb-10"
        >
          {/* Left: Image (2/5) */}
          <motion.div
            variants={itemVar}
            className="md:col-span-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="relative">
              <img
                src={ownerPic}
                alt={`${ownerName} - ${ownerRole}`}
                className="w-full h-[380px] md:h-[520px] object-cover object-top"
                onError={(e) => {
                  console.error("Owner image failed to load:", ownerPic);
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-sm md:text-base font-extrabold drop-shadow">
                  {ownerName}
                </p>
                <p className="text-white/90 text-xs md:text-sm drop-shadow mt-1">
                  {ownerRole} • Building a culture of excellence, discipline, and
                  care.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Write-up (3/5) */}
          <motion.div
            variants={itemVar}
            className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100">
                <BsStars className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-blue-900">
                  Who we are
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Purpose-driven education with strong values.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
              {schoolName} is known for providing quality education for children
              across different age groups. We are committed to raising confident
              learners who are prepared for the future — academically, morally,
              and socially.
            </p>

            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              Integrity remains one of our strongest pillars. We keep our
              promises, uphold standards, and maintain excellence without
              compromise. Our learners are guided to build strong academic
              foundations, discipline, and independent thinking — producing
              results they can be proud of.
            </p>

            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              We also ensure proper orientation for every member of our
              community — students, parents, and staff — so everyone understands
              the culture and expectations that shape success at {schoolName}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-blue-50 text-blue-900 border border-blue-100">
                Academic Excellence
              </span>
              <span className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-yellow-50 text-yellow-800 border border-yellow-100">
                Character Formation
              </span>
              <span className="px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                Safe Environment
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* 2-column layout: logo + core values / mission / vision */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Logo card */}
          <motion.div
            variants={itemVar}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-3">
              <img
                src={schoolLogo}
                alt="School logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-blue-900">
              {schoolName}
            </h3>
            <p className="mt-1 text-sm font-semibold text-yellow-600 italic">
              {tagline}
            </p>

            <div className="mt-5 w-full rounded-xl bg-white border border-slate-200 p-4">
              <div className="flex items-center justify-center gap-2 text-blue-900 font-extrabold">
                <BsStars />
                <span>Core Values</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {values.map((v) => (
                  <div
                    key={v.letter}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-extrabold">
                      {v.letter}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-extrabold text-blue-900">
                        {v.word}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mission + Vision + Why us */}
          <div className="lg:col-span-2 grid gap-6">
            {/* Mission & Vision */}
            <motion.div
              variants={itemVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl border border-blue-100">
                    <BsShieldCheck />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-900">
                      Our Mission
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      What we exist to achieve.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
                  To raise a complete child who is morally grounded, spiritually
                  guided, and academically sound — in a happy, safe, and
                  supportive environment.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-700 flex items-center justify-center text-xl border border-yellow-100">
                    <BsGlobe2 />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-900">
                      Our Vision
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Where we are headed.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
                  To be recognized worldwide as a school that nurtures excellent,
                  God-fearing future leaders with strong character and competence.
                </p>
              </div>
            </motion.div>

            {/* Why us */}
            <motion.div
              variants={itemVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center text-2xl border border-blue-100">
                  <BsHeartPulse />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-extrabold text-blue-900">
                    Why {schoolName}?
                  </h3>

                  <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
                    We are a co-educational private school committed to building
                    the full potential of every child. We recognize that each
                    learner has unique spiritual, emotional, intellectual, social,
                    and physical needs.
                  </p>

                  <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
                    When children feel secure and supported, they learn better.
                    Our teachers are caring, professional, and intentional about
                    guiding pupils through meaningful learning experiences that
                    strengthen curiosity, confidence, and long-term success.
                  </p>

                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {[
                      "Safe, nurturing learning environment",
                      "Strong academics + character formation",
                      "Professional, caring teachers",
                      "Balanced learning & play experiences",
                      "Individualized support for each learner",
                      "Confidence-building and leadership grooming",
                    ].map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 text-yellow-500">
                          <BsCheck2Circle />
                        </span>
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Teaching paradigm */}
            <motion.div
              variants={itemVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8"
            >
              <h3 className="text-xl md:text-2xl font-extrabold text-blue-900">
                The Teaching Paradigm
              </h3>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-3xl">
                Beyond the classroom, we build creativity, coordination, and
                confidence through structured co-curricular activities.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {paradigms.map((x) => (
                  <div
                    key={x.label}
                    className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center text-lg">
                      {x.icon}
                    </div>
                    <p className="text-sm font-extrabold text-blue-900">
                      {x.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVar}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm bg-gradient-to-r from-blue-900 via-blue-700 to-yellow-400"
            >
              <div className="p-6 md:p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/90">
                    Join Us Today
                  </p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-extrabold leading-tight">
                    Make your child’s journey special — enroll in our academy
                  </h3>
                  <p className="mt-2 text-sm md:text-base text-white/90">
                    Take the next step toward a supportive environment that builds
                    excellence, values, and confidence.
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <ScrollLink
                    to="academics"
                    smooth={true}
                    offset={-90}
                    duration={500}
                    className="cursor-pointer"
                  >
                    <button
                      type="button"
                      className="px-6 py-3 rounded-full bg-white text-blue-900 font-extrabold hover:bg-slate-100 transition inline-flex items-center gap-2"
                    >
                      Explore Academics <BsArrowRight />
                    </button>
                  </ScrollLink>

                  <ScrollLink
                    to="contact"
                    smooth={true}
                    offset={-90}
                    duration={500}
                    className="cursor-pointer"
                  >
                    <button
                      type="button"
                      className="px-6 py-3 rounded-full border-2 border-white text-white font-extrabold hover:bg-white hover:text-blue-900 transition"
                    >
                      Contact Us
                    </button>
                  </ScrollLink>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;