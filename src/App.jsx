import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { flushSync } from "react-dom";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import saheliLogo from "./assets/saheli-logo.svg";

const Motion = motion;

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
      value: "2000+",
      suffix: "",
      detail: "People reached",
      trend: "+9%",
    },
    {
      label: "New Registrations",
      value: "700+",
      suffix: "",
      detail: "New people engaged",
      trend: "+15%",
    },
    {
      label: "Women Reached",
      value: "85",
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

const executiveHealthTrends = {
  bmi: [33.8, 33.2, 32.9, 32.4, 31.9, 31.5],
  weight: [86.4, 85.7, 85.1, 84.4, 83.6, 82.9],
  bloodPressureSystolic: [152, 149, 146, 142, 139, 136],
  bloodPressureDiastolic: [95, 93, 91, 89, 87, 85],
  wellbeing: [42, 47, 51, 56, 61, 67],
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
  disableAnimation = false,
}) {
  const [display, setDisplay] = useState(0);
  const shouldAnimate = isActive && !disableAnimation;

  useEffect(() => {
    if (!shouldAnimate || typeof value !== "number") {
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
  }, [value, duration, shouldAnimate]);

  if (typeof value !== "number") {
    return (
      <span>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }

  const renderValue = disableAnimation ? value : display;
  const formatted = renderValue.toLocaleString("en-GB", {
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

function buildTrendPoints(data, width, height, padding) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  return data
    .map((value, index) => {
      const x = padding + index * stepX;
      const normalized = (value - min) / range;
      const y = height - padding - normalized * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function MiniTrendCard({ title, data, stroke, fill, unit = "", changeLabel }) {
  const width = 240;
  const height = 78;
  const padding = 9;
  const linePoints = useMemo(
    () => buildTrendPoints(data, width, height, padding),
    [data],
  );
  const points = linePoints.split(" ");
  const pointCoords = points.map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });
  const lastPoint = pointCoords[pointCoords.length - 1];
  const firstX = points[0]?.split(",")[0] || padding;
  const lastX = points[points.length - 1]?.split(",")[0] || width - padding;
  const areaPath = `${linePoints} ${lastX},${height - padding} ${firstX},${height - padding}`;
  const latestValue = `${data[data.length - 1]}${unit}`;

  return (
    <article className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          {title}
        </p>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
          {changeLabel}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-0.5 h-12 w-full"
        aria-hidden="true"
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <path d={`M ${areaPath} Z`} fill={fill} />
        <polyline
          points={linePoints}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {lastPoint && (
          <circle cx={lastPoint.x} cy={lastPoint.y} r="2.9" fill={stroke} />
        )}
      </svg>
      <div className="mt-0.5 flex items-center justify-between text-[10px]">
        <span className="font-medium text-slate-500">Latest reading</span>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
          {latestValue}
        </span>
      </div>
    </article>
  );
}

function DualLineTrendCard({
  title,
  systolic,
  diastolic,
  systolicStroke,
  diastolicStroke,
}) {
  const width = 240;
  const height = 78;
  const padding = 9;
  const combined = [...systolic, ...diastolic];
  const min = Math.min(...combined);
  const max = Math.max(...combined);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / Math.max(systolic.length - 1, 1);

  const toPoints = (series) =>
    series
      .map((value, index) => {
        const x = padding + index * stepX;
        const normalized = (value - min) / range;
        const y = height - padding - normalized * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  const systolicPoints = toPoints(systolic);
  const diastolicPoints = toPoints(diastolic);
  const systolicPointList = systolicPoints.split(" ");
  const diastolicPointList = diastolicPoints.split(" ");
  const systolicFirstX = systolicPointList[0]?.split(",")[0] || padding;
  const systolicLastX =
    systolicPointList[systolicPointList.length - 1]?.split(",")[0] ||
    width - padding;
  const diastolicFirstX = diastolicPointList[0]?.split(",")[0] || padding;
  const diastolicLastX =
    diastolicPointList[diastolicPointList.length - 1]?.split(",")[0] ||
    width - padding;
  const systolicAreaPath = `${systolicPoints} ${systolicLastX},${height - padding} ${systolicFirstX},${height - padding}`;
  const diastolicAreaPath = `${diastolicPoints} ${diastolicLastX},${height - padding} ${diastolicFirstX},${height - padding}`;
  const systolicLast = systolicPoints.split(" ").pop()?.split(",").map(Number);
  const diastolicLast = diastolicPoints
    .split(" ")
    .pop()
    ?.split(",")
    .map(Number);

  return (
    <article className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
          {title}
        </p>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-700">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff1f5] px-1.5 py-0.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: systolicStroke }}
            />
            Systolic
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eff7fc] px-1.5 py-0.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: diastolicStroke }}
            />
            Diastolic
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-0.5 h-12 w-full"
        aria-hidden="true"
      >
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <path d={`M ${systolicAreaPath} Z`} fill="rgba(225, 29, 72, 0.12)" />
        <path d={`M ${diastolicAreaPath} Z`} fill="rgba(13, 103, 154, 0.12)" />
        <polyline
          points={systolicPoints}
          fill="none"
          stroke={systolicStroke}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={diastolicPoints}
          fill="none"
          stroke={diastolicStroke}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {systolicLast && (
          <circle
            cx={systolicLast[0]}
            cy={systolicLast[1]}
            r="2.4"
            fill={systolicStroke}
          />
        )}
        {diastolicLast && (
          <circle
            cx={diastolicLast[0]}
            cy={diastolicLast[1]}
            r="2.4"
            fill={diastolicStroke}
          />
        )}
      </svg>
      <div className="mt-0.5 flex items-center justify-between text-[10px]">
        <span className="font-medium text-slate-500">Latest reading</span>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
          {systolic[systolic.length - 1]}/{diastolic[diastolic.length - 1]} mmHg
        </span>
      </div>
    </article>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportError, setPdfExportError] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const reportContainerRef = useRef(null);
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

  const handleExportPdf = async () => {
    if (!reportContainerRef.current || isExportingPdf) {
      return;
    }

    const startPage = currentPage;

    try {
      flushSync(() => {
        setIsExportingPdf(true);
      });
      setPdfExportError("");

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let index = 0; index < pages.length; index += 1) {
        flushSync(() => {
          setCurrentPage(index);
        });

        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(reportContainerRef.current, {
          backgroundColor: "#ffffff",
          scale: Math.min(window.devicePixelRatio || 1, 1.5),
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedRoot = clonedDoc.getElementById("report-export-root");
            if (!clonedRoot) {
              return;
            }

            clonedRoot.classList.add("pdf-export-mode");
            const exportStyle = clonedDoc.createElement("style");
            exportStyle.textContent = `
              .pdf-export-mode {
                background: #ffffff !important;
                color: #1f2937 !important;
              }
              .pdf-export-mode * {
                box-shadow: none !important;
                text-shadow: none !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                border-color: #d1d5db !important;
                animation: none !important;
                transition: none !important;
              }
              .pdf-export-mode [class*="bg-"] {
                background-image: none !important;
              }
            `;
            clonedDoc.head.appendChild(exportStyle);
          },
        });

        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        const imageAspect = canvas.width / canvas.height;
        let renderWidth = pageWidth;
        let renderHeight = renderWidth / imageAspect;

        if (renderHeight > pageHeight) {
          renderHeight = pageHeight;
          renderWidth = renderHeight * imageAspect;
        }

        const offsetX = (pageWidth - renderWidth) / 2;
        const offsetY = (pageHeight - renderHeight) / 2;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imageData,
          "JPEG",
          offsetX,
          offsetY,
          renderWidth,
          renderHeight,
        );
      }

      const fileName = "saheli-report-full.pdf";

      try {
        pdf.save(fileName);
      } catch {
        const blob = pdf.output("blob");
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      }
    } catch (error) {
      console.error("Failed to export PDF", error);
      setPdfExportError("Export failed. Please try again.");
    } finally {
      flushSync(() => {
        setCurrentPage(startPage);
        setIsExportingPdf(false);
      });
    }
  };

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

  const pageVariants = isExportingPdf
    ? {
        initial: false,
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
      }
    : pageTransition;

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

      <div
        ref={reportContainerRef}
        id="report-export-root"
        className="relative mx-auto flex h-full w-full max-w-[1450px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/85 p-3 shadow-[0_20px_60px_rgba(39,14,63,0.16)] backdrop-blur-sm md:p-4"
      >
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
              <Motion.section
                key="page-0"
                variants={pageVariants}
                initial={isExportingPdf ? false : "initial"}
                animate="animate"
                exit={isExportingPdf ? undefined : "exit"}
                className="grid h-full min-h-0 grid-rows-[auto_auto_auto_minmax(0,0.92fr)_minmax(0,0.95fr)_auto] gap-2"
              >
                <Motion.div
                  variants={fadeUp}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0d679a]">
                      {executiveSummary.reportingPeriod}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
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
                </Motion.div>

                <Motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-[#ed6ea7]/30 bg-[#fff4fa] px-2.5 py-2 text-[11px] leading-relaxed text-slate-700"
                >
                  {executiveSummary.summary}
                </Motion.div>

                <Motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid gap-3 lg:grid-cols-[1.2fr_1fr]"
                >
                  <Motion.article
                    variants={fadeUp}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0d679a]">
                        Monthly Delivery Trend
                      </p>
                      <p className="text-[10px] text-slate-500">Apr to Mar</p>
                    </div>
                    <div className="mt-2.5 flex h-12 items-end gap-1">
                      {executiveVisuals.monthlyTrend.map((point, index) => (
                        <div
                          key={`${point}-${index}`}
                          className="flex-1 rounded-t bg-gradient-to-t from-[#702283] via-[#e6007e] to-[#ed6ea7]"
                          style={{ height: `${Math.max(15, point * 0.53)}%` }}
                        />
                      ))}
                    </div>
                  </Motion.article>

                  <Motion.article
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
                  </Motion.article>
                </Motion.div>

                <Motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid h-full min-h-0 grid-cols-2 auto-rows-fr gap-2 md:grid-cols-3"
                >
                  {executiveSummary.kpis.map((kpi) => (
                    <Motion.article
                      key={kpi.label}
                      variants={fadeUp}
                      className="flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_20px_rgba(53,40,65,0.08)]"
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
                        <p className="mt-1 text-[1.4rem] font-semibold leading-none text-slate-900 md:text-[1.55rem]">
                          <CountUp
                            value={kpi.value}
                            suffix={kpi.suffix || ""}
                            isActive={currentPage === 0 && !isExportingPdf}
                            disableAnimation={isExportingPdf}
                          />
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {kpi.detail}
                        </p>
                      </div>
                      <svg
                        viewBox="0 0 116 36"
                        className="mt-0.5 h-3.5 w-full"
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
                    </Motion.article>
                  ))}
                </Motion.div>

                <Motion.div
                  variants={fadeUp}
                  className="grid min-h-0 grid-rows-[auto_1fr] rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0d679a]">
                      Health Trend Highlights
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Assessment snapshots
                    </p>
                  </div>
                  <div className="grid h-full min-h-0 grid-cols-4 gap-1.5 auto-rows-fr">
                    <MiniTrendCard
                      title="BMI Trend"
                      data={executiveHealthTrends.bmi}
                      stroke="#e11d48"
                      fill="rgba(244, 63, 94, 0.2)"
                      changeLabel="Improving"
                    />
                    <MiniTrendCard
                      title="Weight Trend"
                      data={executiveHealthTrends.weight}
                      stroke="#0d679a"
                      fill="rgba(13, 103, 154, 0.2)"
                      unit=" kg"
                      changeLabel="Down"
                    />
                    <DualLineTrendCard
                      title="Blood Pressure Trend"
                      systolic={executiveHealthTrends.bloodPressureSystolic}
                      diastolic={executiveHealthTrends.bloodPressureDiastolic}
                      systolicStroke="#e11d48"
                      diastolicStroke="#0d679a"
                    />
                    <MiniTrendCard
                      title="Wellbeing Trend"
                      data={executiveHealthTrends.wellbeing}
                      stroke="#e6007e"
                      fill="rgba(230, 0, 126, 0.2)"
                      changeLabel="Up"
                    />
                  </div>
                </Motion.div>

                <Motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-200 bg-white/90 px-3 py-0.5 text-[10px] leading-relaxed text-slate-600"
                >
                  {executiveSummary.leadership}
                </Motion.div>
              </Motion.section>
            )}

            {currentPage === 1 && (
              <Motion.section
                key="page-1"
                variants={pageVariants}
                initial={isExportingPdf ? false : "initial"}
                animate="animate"
                exit={isExportingPdf ? undefined : "exit"}
                className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.2fr_1fr]"
              >
                <div className="grid min-h-0 grid-rows-[auto_auto_1fr] gap-3">
                  <Motion.div
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
                  </Motion.div>

                  <Motion.div
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
                  </Motion.div>

                  <Motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    className="grid min-h-0 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {deliveryGroups.map((group) => (
                      <Motion.article
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
                      </Motion.article>
                    ))}
                  </Motion.div>
                </div>

                <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
                  <Motion.article
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
                  </Motion.article>

                  <Motion.article
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
                  </Motion.article>
                </div>
              </Motion.section>
            )}

            {currentPage === 2 && (
              <Motion.section
                key="page-2"
                variants={pageVariants}
                initial={isExportingPdf ? false : "initial"}
                animate="animate"
                exit={isExportingPdf ? undefined : "exit"}
                className="grid h-full min-h-0 gap-3 lg:grid-cols-[1.25fr_1fr]"
              >
                <Motion.article
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
                </Motion.article>

                <Motion.article
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
                </Motion.article>
              </Motion.section>
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
            {pdfExportError && (
              <span className="ml-2 text-[10px] font-medium text-red-600">
                {pdfExportError}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isExportingPdf ? "Exporting..." : "Export PDF"}
            </button>
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
