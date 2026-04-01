import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import saheliLogo from "./assets/saheli-logo.svg";

const localImageModules = import.meta.glob(
  "./assets/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
  {
    eager: true,
    import: "default",
  },
);

const pages = [
  { id: "executive", label: "Executive Summary" },
  { id: "delivery", label: "Delivery Overview" },
  { id: "case-study", label: "Case Study & Gallery" },
];

const executiveSummary = {
  title: "Saheli Hub",
  subtitle: "Annual Impact Report Experience",
  reportingPeriod: "Apr 2024 - Present",
  summary:
    "Community-led programmes expanded inclusive participation, improved wellbeing, and created more pathways into confidence, movement, and employment.",
  lens: "Reach - Impact - Growth",
  leadership:
    "Leadership note: sustained investment is translating into broad community reach, stronger wellbeing outcomes, and clearer progression routes into work.",
  kpis: [
    {
      label: "Total Attendances",
      value: 21777,
      suffix: "+",
      detail: "Across the reporting year",
      trend: "+12%",
    },
    {
      label: "Unique Participants",
      value: 1897,
      suffix: "",
      detail: "People reached",
      trend: "+9%",
    },
    {
      label: "New Registrations",
      value: 598,
      suffix: "",
      detail: "New people engaged",
      trend: "+15%",
    },
    {
      label: "Women Reached",
      value: 85,
      suffix: "%",
      detail: "Women participants",
      trend: "Sustained",
    },
    {
      label: "Ethnically Diverse",
      value: 95,
      suffix: "%",
      detail: "Community reach",
      trend: "High",
    },
    {
      label: "Most Deprived Areas",
      value: 77,
      suffix: "%",
      detail: "IMD quintiles 1-2",
      trend: "+6%",
    },
  ],
};

const executiveVisuals = {
  monthlyTrend: [58, 62, 66, 65, 73, 78, 83, 86, 90, 95, 101, 108],
  impactMix: [
    { label: "Women", value: 85, color: "#e6007e" },
    { label: "Ethnically Diverse", value: 95, color: "#702283" },
    { label: "Priority Areas", value: 77, color: "#0d679a" },
  ],
};

const rawActivities = [
  "Archery",
  "Bellboard",
  "Cycling",
  "Men's Cycling",
  "Squash",
  "Swimming",
  "Tennis",
  "Tennis - Term Time",
  "Walk / Jog / Run",
  "Body Conditioning",
  "Chair Based Exercise",
  "Chair Exercise",
  "Omnia Chair Exercise",
  "Circuit",
  "Circuit Training",
  "Circuits Class",
  "HIIT",
  "Innerva",
  "Keep Fit",
  "Pilate Floor Base",
  "Pilates",
  "Salsa / Belly Dancing",
  "Strength & Stretch",
  "Yoga",
  "Zumba",
  "Diabetes Prevention",
  "Men's Know Your Numbers",
  "Art & Craft Social Club",
  "EOSL",
  "ESOL",
  "Gardening & Growing",
  "South Yardley Lunch Club",
  "Workshops",
  "Men's Activity",
  "Men's Multisports",
  "Multisports & Games",
  "Test",
  "Salvation Army",
];

const activityCleaningMap = {
  Bellboard: "Bell Boating",
  "Chair Based Exercise": "Chair Exercise",
  "Omnia Chair Exercise": "Chair Exercise",
  Circuit: "Circuits",
  "Circuit Training": "Circuits",
  "Circuits Class": "Circuits",
  EOSL: "ESOL",
  "Pilate Floor Base": "Pilates",
  "Tennis - Term Time": "Tennis",
};

const removableActivities = new Set(["Test"]);
const partnerOrVenueEntries = new Set(["Salvation Army"]);

const deliveryFamiliesConfig = [
  {
    title: "Sport & Active Travel",
    items: [
      "Archery",
      "Bell Boating",
      "Cycling",
      "Men's Cycling",
      "Squash",
      "Swimming",
      "Tennis",
      "Walk / Jog / Run",
    ],
  },
  {
    title: "Fitness & Movement",
    items: [
      "Body Conditioning",
      "Chair Exercise",
      "Circuits",
      "HIIT",
      "Innerva",
      "Keep Fit",
      "Pilates",
      "Salsa / Belly Dancing",
      "Strength & Stretch",
      "Yoga",
      "Zumba",
    ],
  },
  {
    title: "Health & Prevention",
    items: ["Diabetes Prevention", "Men's Know Your Numbers"],
  },
  {
    title: "Community & Learning",
    items: [
      "Art & Craft Social Club",
      "ESOL",
      "Gardening & Growing",
      "South Yardley Lunch Club",
      "Workshops",
    ],
  },
  {
    title: "Targeted Group Activities",
    items: ["Men's Activity", "Men's Multisports", "Multisports & Games"],
  },
];

const achievements = [
  {
    title: "Awards Won",
    value: "4",
    note: "Recognition across sport and inclusion leadership",
  },
  {
    title: "WorkWell Engaged",
    value: "213",
    note: "People supported through health and employment pathways",
  },
  {
    title: "Into Work",
    value: "16",
    note: "Participants moving back into work or gaining employment",
  },
  {
    title: "Innerva Users",
    value: "1,500+",
    note: "Community members accessing assisted exercise equipment",
  },
];

const managerCaseStudy = {
  title: "Community-led support improving mobility, confidence, and wellbeing",
  background: [
    "A 72-year-old woman of West Indian heritage managing diabetes and arthritis, living alone.",
    "Reduced mobility due to arthritis was affecting daily activities and independence.",
    "She joined seeking better mobility, joint health, and overall fitness.",
    "She speaks English but benefits from additional support with reading, writing, and forms.",
  ],
  intervention: [
    "Attended three sessions per week.",
    "Participated in Zumba, HIIT, Chair-Based Exercise, Pilates, Body Conditioning, and Bike Rides.",
    "Regular mix supported mobility, strength, diabetes control, and social connection.",
  ],
  outcomes: [
    "Improved knee mobility and better diabetes management with weight reduction.",
    "Greater joint flexibility and faster walking speed.",
    "Now attempts to run, previously not possible due to pain.",
    "Continues regular attendance with stronger confidence, wellbeing, and social engagement.",
    "Referred to GAIN for further advice and guidance.",
  ],
  quotes: [
    "I love coming to Saheli because it's warm and friendly. The staff make you feel comfortable and loved. I have come back after a while and it is like coming home.",
    "The Eid party was a lot of fun. It was nice to have the whole place to ourselves.",
    "As a volunteer I have grown and learnt a lot. This is a place where you can make improvements.",
  ],
};

const photoGallery = Object.entries(localImageModules)
  .map(([path, src]) => {
    const fileName = path.split("/").pop() || "Community image";
    return {
      src,
      alt: fileName,
      label: fileName,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

const sparklinePoints = "8,28 28,22 48,26 68,18 88,24 108,12";

function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 900,
  isActive,
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isActive || typeof value !== "number") {
      return;
    }

    let frameId;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration, isActive]);

  if (typeof value !== "number") {
    return (
      <span>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }

  const formatted = display.toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function PhotoTile({ src, alt, className = "" }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 ${className}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`h-full w-full rounded-xl object-cover ${className}`}
    />
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;
  const photoGridColumns = 4;
  const photoGridRows = Math.max(
    1,
    Math.ceil(photoGallery.length / photoGridColumns),
  );

  const cleanedActivities = useMemo(
    () =>
      Array.from(
        new Set(
          rawActivities
            .map((item) => activityCleaningMap[item] || item)
            .filter(
              (item) =>
                !removableActivities.has(item) &&
                !partnerOrVenueEntries.has(item),
            ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const deliveryGroups = useMemo(
    () =>
      deliveryFamiliesConfig.map((family) => ({
        ...family,
        items: family.items.filter((item) => cleanedActivities.includes(item)),
      })),
    [cleanedActivities],
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextPage();
      }
      if (event.key === "ArrowLeft") {
        prevPage();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 32 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -24,
      transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const fadeUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f7f4fa] p-3 text-slate-800 md:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(230,0,126,0.13),transparent_38%),radial-gradient(circle_at_82%_18%,_rgba(13,103,154,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(246,166,35,0.11),transparent_35%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1450px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/85 p-3 shadow-[0_20px_60px_rgba(39,14,63,0.16)] backdrop-blur-sm md:p-4">
        <header className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={saheliLogo}
              alt="Saheli Hub logo"
              className="h-7 w-auto md:h-8"
            />
            <div className="hidden border-l border-slate-200 pl-3 md:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#702283]">
                Annual Report Experience
              </p>
              <p className="text-[11px] text-slate-500">
                Board and Funder Presentation View
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {pages.map((page, index) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setCurrentPage(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentPage === index
                    ? "w-7 bg-[#e6007e]"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${page.label}`}
              />
            ))}
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-[#fdfbff] to-[#f5f8fc] p-3 md:p-4">
          <AnimatePresence mode="wait">
            {currentPage === 0 && (
              <motion.section
                key="page-0"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid h-full min-h-0 grid-rows-[auto_auto_auto_1fr_auto] gap-3"
              >
                <motion.div
                  variants={fadeUp}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d679a]">
                      {executiveSummary.reportingPeriod}
                    </p>
                    <h1 className="mt-1 text-4xl font-semibold leading-tight text-slate-900">
                      {executiveSummary.title}
                    </h1>
                    <p className="mt-1 text-lg font-medium text-[#702283]">
                      {executiveSummary.subtitle}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-[#702283] to-[#e6007e] px-3 py-2 text-right text-white shadow-md">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/80">
                      Report Lens
                    </p>
                    <p className="text-sm font-semibold">
                      {executiveSummary.lens}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-[#ed6ea7]/30 bg-[#fff4fa] p-2.5 text-xs leading-relaxed text-slate-700"
                >
                  {executiveSummary.summary}
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid gap-3 lg:grid-cols-[1.2fr_1fr]"
                >
                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0d679a]">
                        Monthly Delivery Trend
                      </p>
                      <p className="text-[10px] text-slate-500">Apr to Mar</p>
                    </div>
                    <div className="mt-2.5 flex h-14 items-end gap-1">
                      {executiveVisuals.monthlyTrend.map((point, index) => (
                        <div
                          key={`${point}-${index}`}
                          className="flex-1 rounded-t bg-gradient-to-t from-[#702283] via-[#e6007e] to-[#ed6ea7]"
                          style={{ height: `${Math.max(15, point * 0.53)}%` }}
                        />
                      ))}
                    </div>
                  </motion.article>

                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0d679a]">
                      Inclusion Impact Mix
                    </p>
                    <div className="mt-2.5 flex items-center gap-3">
                      <div
                        className="h-16 w-16 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#e6007e 0% 34%, #702283 34% 72%, #0d679a 72% 100%)",
                        }}
                      />
                      <div className="space-y-1">
                        {executiveVisuals.impactMix.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 text-[11px]"
                          >
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-semibold text-slate-800">
                              {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid min-h-0 grid-cols-2 gap-2.5 md:grid-cols-3"
                >
                  {executiveSummary.kpis.map((kpi) => (
                    <motion.article
                      key={kpi.label}
                      variants={fadeUp}
                      className="flex min-h-[108px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_8px_20px_rgba(53,40,65,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                          {kpi.label}
                        </p>
                        <span className="rounded-full bg-[#fef0f8] px-1.5 py-0.5 text-[9px] font-semibold text-[#e6007e]">
                          {kpi.trend}
                        </span>
                      </div>
                      <div>
                        <p className="mt-1 text-[1.85rem] font-semibold leading-none text-slate-900">
                          <CountUp
                            value={kpi.value}
                            suffix={kpi.suffix || ""}
                            isActive={currentPage === 0}
                          />
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {kpi.detail}
                        </p>
                      </div>
                      <svg
                        viewBox="0 0 116 36"
                        className="mt-1 h-4.5 w-full"
                        aria-hidden="true"
                      >
                        <polyline
                          fill="none"
                          stroke="#ed6ea7"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          points={sparklinePoints}
                        />
                        <circle cx="108" cy="12" r="2.5" fill="#f59e0b" />
                      </svg>
                    </motion.article>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-1.5 text-[11px] leading-relaxed text-slate-600"
                >
                  {executiveSummary.leadership}
                </motion.div>
              </motion.section>
            )}

            {currentPage === 1 && (
              <motion.section
                key="page-1"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.2fr_1fr]"
              >
                <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-3">
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0d679a]">
                      Page 2
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                      Delivery Overview
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Cleaned and deduplicated service families presented for
                      board-level clarity.
                    </p>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                        Families
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        {deliveryGroups.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                        Activities
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        {cleanedActivities.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-500">
                        Achievements
                      </p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">
                        {achievements.length}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    className="grid min-h-0 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {deliveryGroups.map((group) => (
                      <motion.article
                        key={group.title}
                        variants={fadeUp}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                          {group.title}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#ed6ea7]/30 bg-[#fff7fb] px-1.5 py-0.5 text-[10px] text-slate-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </div>

                <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-[#702283]">
                      Headline Achievements
                    </h3>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {achievements.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl border border-slate-200 bg-[#fbfaff] p-2.5"
                        >
                          <p className="text-[10px] uppercase tracking-[0.07em] text-slate-500">
                            {item.title}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">
                            {item.value}
                          </p>
                          <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                            {item.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.article>

                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-[#702283]">
                      Service Breadth Note
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      Delivery has remained balanced across movement,
                      prevention, and community support pathways, with strong
                      inclusion outcomes and sustained participation.
                    </p>
                  </motion.article>
                </div>
              </motion.section>
            )}

            {currentPage === 2 && (
              <motion.section
                key="page-2"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.25fr_1fr]"
              >
                <motion.article
                  variants={fadeUp}
                  className="grid min-h-0 grid-rows-[auto_1fr] gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0d679a]">
                      Page 3
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                      Case Study and Photo Story
                    </h2>
                    <p className="mt-1 text-xs text-slate-600">
                      An anonymised participant journey showing lived impact and
                      progression.
                    </p>
                  </div>

                  <div className="grid min-h-0 gap-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-[#fbfaff] p-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                        Background
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-slate-700">
                        {managerCaseStudy.background.map((line) => (
                          <li key={line}>- {line}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#fbfaff] p-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                        Intervention
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-slate-700">
                        {managerCaseStudy.intervention.map((line) => (
                          <li key={line}>- {line}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-[#fbfaff] p-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                        Outcomes
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[11px] leading-relaxed text-slate-700">
                        {managerCaseStudy.outcomes.map((line) => (
                          <li key={line}>- {line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#ed6ea7]/35 bg-[#fff6fb] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#e6007e]">
                      Participant Voice
                    </p>
                    <div className="mt-1.5 grid gap-1.5 md:grid-cols-3">
                      {managerCaseStudy.quotes.map((quote) => (
                        <blockquote
                          key={quote}
                          className="rounded-lg bg-white p-2 text-[11px] leading-relaxed text-slate-700"
                        >
                          "{quote}"
                        </blockquote>
                      ))}
                    </div>
                  </div>
                </motion.article>

                <motion.article
                  variants={fadeUp}
                  className="grid min-h-0 grid-rows-[auto_1fr] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d679a]">
                    Photo Story ({photoGallery.length})
                  </p>
                  <div
                    className="mt-2 grid min-h-0 h-full grid-cols-4 gap-1.5"
                    style={{
                      gridTemplateRows: `repeat(${photoGridRows}, minmax(0, 1fr))`,
                    }}
                  >
                    {photoGallery.map((photo, index) => (
                      <div
                        key={photo.alt + index}
                        className={`min-h-0 ${photo.className || ""}`}
                        title={photo.label}
                      >
                        <PhotoTile
                          src={photo.src}
                          alt={photo.alt}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.article>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-2 shadow-sm">
          <div className="text-xs font-medium text-slate-600">
            <span className="font-semibold text-slate-800">
              {currentPage + 1}
            </span>{" "}
            / {pages.length}
            <span className="ml-2 text-slate-500">
              {pages[currentPage].label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevPage}
              disabled={isFirstPage}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous Page
            </button>
            <button
              type="button"
              onClick={nextPage}
              disabled={isLastPage}
              className="rounded-xl bg-[#0d679a] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0a5680] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Page
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
