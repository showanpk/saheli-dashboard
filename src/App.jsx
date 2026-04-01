import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import saheliLogo from "./assets/saheli-logo.svg";

const executiveSummary = {
  title: "Saheli Hub",
  subtitle: "Annual Impact Report Experience",
  reportingPeriod: "Apr 2024 - Present",
  summary:
    "Community-led programmes expanded inclusive participation, improved wellbeing, and created more pathways into confidence, movement, and employment.",
  lens: "Reach • Impact • Growth",
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
      value: 2000,
      suffix: "+",
      detail: "People reached",
      trend: "+9%",
    },
    {
      label: "New Registrations",
      value: 650,
      suffix: "+",
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

const pages = [
  { id: "executive", label: "Executive Summary" },
  { id: "delivery", label: "Delivery and Health Impact" },
  { id: "future", label: "Future Opportunity" },
];

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

const cleanedActivities = Array.from(
  new Set(
    rawActivities
      .map((item) => activityCleaningMap[item] || item)
      .filter(
        (item) =>
          !removableActivities.has(item) && !partnerOrVenueEntries.has(item),
      ),
  ),
).sort((a, b) => a.localeCompare(b));

const deliveryGroups = deliveryFamiliesConfig.map((family) => ({
  ...family,
  items: family.items.filter((item) => cleanedActivities.includes(item)),
}));

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

const caseStudy = {
  kicker: "Featured Case Study",
  title: "Real lives, measurable change",
  quote:
    "Community-led support helped me rebuild confidence, improve my wellbeing, and move toward work again.",
  story:
    "A participant progressed from social isolation to regular activity, renewed confidence, and practical employment readiness with tailored support.",
};

const healthImpactMetrics = [
  { label: "Total Participants Assessed", value: 896, tone: "pink" },
  { label: "Total Assessments", value: 1521, tone: "purple" },
  { label: "Average BMI", value: 31.3, tone: "amber", decimals: 1 },
  {
    label: "Average Weight",
    value: 83.1,
    tone: "slate",
    decimals: 1,
    unit: "kg",
  },
  { label: "Average BP", value: "124/82", tone: "blue" },
  { label: "Average Heart Age", value: 61.2, tone: "purple", decimals: 1 },
  { label: "Average HbA1c", value: 41.9, tone: "amber", decimals: 1 },
  { label: "Average Active Days / Week", value: 2, tone: "blue" },
  {
    label: "Average Confidence To Join",
    value: 7.5,
    tone: "pink",
    decimals: 1,
  },
];

const healthTrendCards = [
  { title: "BMI Trend", points: "8,22 25,23 42,21 59,20 76,18 93,17" },
  { title: "Weight Trend", points: "8,24 25,25 42,23 59,21 76,20 93,18" },
  {
    title: "Blood Pressure Trend",
    points: "8,20 25,20 42,19 59,18 76,18 93,17",
  },
  { title: "HbA1c Trend", points: "8,26 25,24 42,22 59,21 76,20 93,18" },
  { title: "Wellbeing Trend", points: "8,28 25,24 42,20 59,17 76,14 93,12" },
  { title: "Active Days Trend", points: "8,27 25,25 42,23 59,21 76,18 93,15" },
];

const healthMeaning = [
  "Stronger prevention through earlier risk visibility and tailored support.",
  "Improved understanding of long-term health risks across priority cohorts.",
  "Higher confidence to engage creates better sustained participation outcomes.",
  "Robust evidence base improves referral conversations and funding narratives.",
];

const futureTracks = [
  {
    title: "Health Referral Expansion",
    text: "Scale GP and NHS referral pathways to reach more residents earlier with preventative support.",
  },
  {
    title: "Women and Family Activity Growth",
    text: "Extend women-led sport and active travel opportunities into additional community venues.",
  },
  {
    title: "Employment and Wellbeing Integration",
    text: "Grow WorkWell-style support to connect wellbeing progress with skills and employability outcomes.",
  },
  {
    title: "Evidence and Funding Readiness",
    text: "Use impact storytelling and outcomes data to strengthen multi-year funding partnerships.",
  },
];

const sponsorshipCallout = {
  title: "Future Partnership Opportunity",
  value: "£250k",
  detail:
    "Target blended investment to scale inclusive delivery over the next 24 months.",
};

const sparklinePoints = "8,28 28,22 48,26 68,18 88,24 108,12";

const healthToneStyles = {
  pink: "border-[#f8c5de] bg-[#fff5fb]",
  purple: "border-[#d8b8ea] bg-[#faf6ff]",
  blue: "border-[#bfddee] bg-[#f4fbff]",
  amber: "border-[#f6dca7] bg-[#fffaf0]",
  slate: "border-slate-200 bg-white",
};

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

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

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
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 40 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : -28,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const fadeUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
        delayChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <div className="relative h-screen overflow-hidden bg-[#f7f4fa] p-4 text-slate-800 md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(230,0,126,0.13),transparent_38%),radial-gradient(circle_at_82%_18%,_rgba(13,103,154,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(246,166,35,0.11),transparent_35%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1450px] flex-col overflow-hidden rounded-[30px] border border-white/60 bg-white/85 p-4 shadow-[0_24px_70px_rgba(39,14,63,0.16)] backdrop-blur-sm md:p-6">
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={saheliLogo}
              alt="Saheli Hub logo"
              className="h-8 w-auto md:h-10"
            />
            <div className="hidden border-l border-slate-200 pl-3 md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#702283]">
                Annual Report Experience
              </p>
              <p className="text-xs text-slate-500">
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

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-[#fdfbff] to-[#f5f8fc] p-4 md:p-6">
          <AnimatePresence mode="wait">
            {currentPage === 0 && (
              <motion.section
                key="page-0"
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid h-full min-h-0 grid-rows-[auto_auto_auto_1fr_auto] gap-4"
              >
                <motion.div
                  variants={fadeUp}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.23em] text-[#0d679a]">
                      {executiveSummary.reportingPeriod}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
                      {executiveSummary.title}
                    </h1>
                    <p className="mt-1 text-base font-medium text-[#702283] md:text-lg">
                      {executiveSummary.subtitle}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-[#702283] to-[#e6007e] px-4 py-3 text-right text-white shadow-md">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/75">
                      Report Lens
                    </p>
                    <p className="text-sm font-semibold">
                      {executiveSummary.lens}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-[#ed6ea7]/30 bg-[#fff4fa] p-3 text-sm leading-relaxed text-slate-700"
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
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d679a]">
                        Monthly Delivery Trend
                      </p>
                      <p className="text-xs text-slate-500">Apr to Mar</p>
                    </div>
                    <div className="mt-3 flex h-16 items-end gap-1.5">
                      {executiveVisuals.monthlyTrend.map((point, index) => (
                        <div
                          key={`${point}-${index}`}
                          className="flex-1 rounded-t bg-gradient-to-t from-[#702283] via-[#e6007e] to-[#ed6ea7]"
                          style={{ height: `${Math.max(14, point * 0.55)}%` }}
                        />
                      ))}
                    </div>
                  </motion.article>

                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d679a]">
                      Inclusion Impact Mix
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div
                        className="h-20 w-20 rounded-full"
                        style={{
                          background:
                            "conic-gradient(#e6007e 0% 34%, #702283 34% 72%, #0d679a 72% 100%)",
                        }}
                      />
                      <div className="space-y-1.5">
                        {executiveVisuals.impactMix.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2 text-xs"
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
                  className="grid min-h-0 grid-cols-2 gap-3 md:grid-cols-3"
                >
                  {executiveSummary.kpis.map((kpi) => (
                    <motion.article
                      key={kpi.label}
                      variants={fadeUp}
                      className="flex min-h-[132px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_20px_rgba(53,40,65,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium uppercase tracking-[0.09em] text-slate-500">
                          {kpi.label}
                        </p>
                        <span className="rounded-full bg-[#fef0f8] px-2 py-0.5 text-[10px] font-semibold text-[#e6007e]">
                          {kpi.trend}
                        </span>
                      </div>
                      <div>
                        <p className="mt-1.5 text-2xl font-semibold leading-none text-slate-900 md:text-3xl">
                          <CountUp
                            value={kpi.value}
                            suffix={kpi.suffix || ""}
                            isActive={currentPage === 0}
                          />
                        </p>
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          {kpi.detail}
                        </p>
                      </div>
                      <svg
                        viewBox="0 0 116 36"
                        className="mt-2 h-6 w-full"
                        aria-hidden="true"
                      >
                        <polyline
                          fill="none"
                          stroke="#ed6ea7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          points={sparklinePoints}
                        />
                        <circle cx="108" cy="12" r="3" fill="#f59e0b" />
                      </svg>
                    </motion.article>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm text-slate-600"
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
                className="grid h-full min-h-0 gap-4 lg:grid-cols-[1.15fr_1fr]"
              >
                <div className="grid min-h-0 grid-rows-[auto_1fr] gap-4">
                  <motion.div
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0d679a]">
                      Page 2
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                      What We Delivered and Health Evidence
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Programme families are cleaned and deduplicated for
                      strategic reporting, with achievements and measurable
                      health outcomes side by side.
                    </p>
                  </motion.div>

                  <div className="grid min-h-0 gap-4 md:grid-cols-2">
                    <motion.article
                      variants={fadeUp}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-[#702283]">
                        Programme Families Delivered
                      </h3>
                      <div className="mt-3 grid gap-2">
                        {deliveryGroups.map((group) => (
                          <div
                            key={group.title}
                            className="rounded-xl border border-slate-200 bg-[#fbfaff] p-3"
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                              {group.title}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {group.items.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-[#ed6ea7]/40 bg-white px-2 py-0.5 text-[11px] text-slate-700"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.article>

                    <motion.article
                      variants={fadeUp}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-[#702283]">
                        What We Achieved
                      </h3>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {achievements.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-xl border border-slate-200 bg-[#fbfaff] p-3"
                          >
                            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xl font-semibold text-slate-900">
                              {item.value}
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                              {item.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.article>
                  </div>
                </div>

                <div className="grid min-h-0 grid-rows-[1fr_auto] gap-4">
                  <motion.article
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#702283] via-[#8b2ba4] to-[#e6007e] p-4 text-white shadow-[0_14px_30px_rgba(63,19,99,0.26)]"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {caseStudy.kicker}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">
                      {caseStudy.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/88">
                      {caseStudy.story}
                    </p>
                    <blockquote className="mt-4 rounded-xl border border-white/25 bg-white/12 p-3 text-sm leading-relaxed">
                      "{caseStudy.quote}"
                    </blockquote>
                    <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-[#f59e0b]/35 blur-xl" />
                  </motion.article>

                  <motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d679a]">
                      Health Impact Snapshot
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {healthImpactMetrics.slice(0, 6).map((metric) => (
                        <div
                          key={metric.label}
                          className={`rounded-lg border p-2.5 ${healthToneStyles[metric.tone]}`}
                        >
                          <p className="text-[10px] uppercase tracking-[0.06em] text-slate-500">
                            {metric.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {typeof metric.value === "number" ? (
                              <CountUp
                                value={metric.value}
                                decimals={metric.decimals || 0}
                                suffix={metric.unit ? ` ${metric.unit}` : ""}
                                isActive={currentPage === 1}
                              />
                            ) : (
                              metric.value
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
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
                className="grid h-full min-h-0 grid-rows-[auto_1fr_auto] gap-4"
              >
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0d679a]">
                    Page 3
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 md:text-3xl">
                    What We Can Achieve Next
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Future opportunity focuses on growth tracks, funding
                    readiness, and partnership value with evidence-led outcomes.
                  </p>
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid min-h-0 gap-3 md:grid-cols-2"
                >
                  {futureTracks.map((opportunity) => (
                    <motion.article
                      key={opportunity.title}
                      variants={fadeUp}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#e6007e]">
                        Growth Track
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {opportunity.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {opportunity.text}
                      </p>
                    </motion.article>
                  ))}
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="grid gap-3 rounded-2xl border border-[#f59e0b]/35 bg-gradient-to-r from-[#fff8ec] via-[#fff3fa] to-[#eef7ff] p-4 lg:grid-cols-[1.3fr_1fr]"
                >
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {healthTrendCards.map((trend) => (
                      <div
                        key={trend.title}
                        className="rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                          {trend.title}
                        </p>
                        <svg
                          viewBox="0 0 104 32"
                          className="mt-2 h-8 w-full"
                          aria-hidden="true"
                        >
                          <polyline
                            fill="none"
                            stroke="#0d679a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            points={trend.points}
                          />
                          <circle cx="93" cy="17" r="2.5" fill="#e6007e" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-slate-900 p-4 text-white shadow-inner">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                      Sponsorship and Investment
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {sponsorshipCallout.title}
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-[#f59e0b]">
                      {sponsorshipCallout.value}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                      {sponsorshipCallout.detail}
                    </p>
                    <div className="mt-3 border-t border-white/20 pt-2">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">
                        What This Means
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-white/85">
                        {healthMeaning.slice(0, 3).map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm">
          <div className="text-sm font-medium text-slate-600">
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
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous Page
            </button>
            <button
              type="button"
              onClick={nextPage}
              disabled={isLastPage}
              className="rounded-xl bg-[#0d679a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a5680] disabled:cursor-not-allowed disabled:opacity-40"
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
