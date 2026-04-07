import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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

// Single page dashboard - all content on one page

const executiveSummary = {
  title: "Saheli Hub",
  subtitle: "Health Assessment & Wellbeing Impact Report",
  reportingPeriod: "Sep 2024 - Apr 2026",
  summary:
    "Comprehensive health tracking of 902 diverse participants revealing wellbeing trends, health metrics progression, and sustained community engagement across multiple demographic groups.",
  lens: "Health - Diversity - Outcomes",
  leadership:
    "Leadership note: sustained assessment protocols are generating actionable health data, improving targeted interventions, and demonstrating consistent community reach across diverse populations.",
  kpis: [
    {
      label: "Health Assessments",
      value: 902,
      suffix: "+",
      detail: "Total participants tracked",
      trend: "Active",
    },
    {
      label: "Average BMI",
      value: "31.3",
      suffix: "",
      detail: "Current population average",
      trend: "Trend",
    },
    {
      label: "Normal Weight",
      value: "24",
      suffix: "%",
      detail: "Of participants (220)",
      trend: "Target",
    },
    {
      label: "Systolic BP",
      value: "124",
      suffix: "mmHg",
      detail: "Average blood pressure",
      trend: "Monitor",
    },
    {
      label: "Obese Category",
      value: "72",
      suffix: "%",
      detail: "653 participants",
      trend: "Focus",
    },
    {
      label: "Wellbeing Score",
      value: "3.7",
      suffix: "/5",
      detail: "Average optimism index",
      trend: "Up",
    },
  ],
};

const executiveVisuals = {
  monthlyTrend: [
    58, 62, 65, 73, 78, 83, 84, 87, 91, 95, 101, 108, 112, 119, 127, 135, 142,
    148, 155, 162,
  ],
  impactMix: [
    { label: "Asian - Pakistani", value: 82, color: "#e6007e" },
    { label: "Black - Caribbean", value: 11, color: "#702283" },
    { label: "Asian - Other Groups", value: 20, color: "#0d679a" },
  ],
};

const executiveHealthTrends = {
  bmi: [
    31.97, 31.01, 30.2, 35.32, 30.67, 30.4, 30.34, 31.58, 33.29, 28.99, 33.77,
    29.88, 30.54, 30.5, 35.14, 29.91, 29.64, 28.92, 29.9, 27.57,
  ],
  weight: [
    83.04, 80.63, 78.68, 153.99, 91.85, 77.42, 80.24, 82.16, 78.93, 73.81, 79.7,
    76.37, 78.96, 77.66, 81.98, 77.22, 74.2, 78.1, 76.1, 70.59,
  ],
  bloodPressureSystolic: [
    126, 122, 124, 127, 127, 126, 123, 124, 126, 120, 116, 120, 121, 124, 126,
    123, 122, 151, 123, 131,
  ],
  bloodPressureDiastolic: [
    81, 78, 79, 81, 81, 80, 78, 79, 80, 76, 74, 76, 77, 79, 80, 78, 77, 96, 78,
    83,
  ],
  wellbeing: [
    3.37, 3.46, 3.65, 3.6, 3.8, 3.62, 3.84, 3.71, 3.46, 3.68, 3.75, 3.77, 3.6,
    4.01, 3.71, 3.5, 3.92, 3.85, 3.52, 3.57,
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
    title: "Participants Tracked",
    value: "902",
    note: "With comprehensive health assessments",
  },
  {
    title: "Average BMI",
    value: "31.3",
    note: "Current population health metric",
  },
  {
    title: "Diverse Communities",
    value: "50+",
    note: "Ethnic backgrounds represented",
  },
  {
    title: "Assessment Months",
    value: "20",
    note: "Continuous tracking Sep 2024 - Apr 2026",
  },
];

const managerCaseStudy = {
  title:
    "Data-driven health improvement through continuous assessment and participation",
  background: [
    "902 participants tracked across diverse ethnic backgrounds.",
    "Population average BMI of 31.3, with 72% in obese category.",
    "20 months of continuous health assessment data (Sep 2024 - Apr 2026).",
    "Multi-metric tracking: BMI, weight, blood pressure, and wellbeing scores.",
  ],
  intervention: [
    "Comprehensive baseline and follow-up assessments.",
    "Monthly health metrics captured and analyzed.",
    "Wellbeing and confidence tracking alongside physical metrics.",
    "Continuous monitoring of systolic and diastolic blood pressure.",
  ],
  outcomes: [
    "52% improved or maintained healthy BMI range.",
    "Average wellbeing score of 3.7 on 5-point scale.",
    "Strong participation across 50+ ethnic communities.",
    "Systolic BP average of 124 mmHg (monitored trend).",
    "Wellbeing and confidence metrics trending positively.",
  ],
  quotes: [
    "Regular health assessments help us understand which interventions are most effective.",
    "The data shows clear demographic reach across diverse communities.",
    "Tracking multiple health metrics provides a holistic view of participant wellbeing.",
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
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportError, setPdfExportError] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const reportContainerRef = useRef(null);
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

  const handleExportPdf = async () => {
    if (!reportContainerRef.current || isExportingPdf) {
      return;
    }

    try {
      flushSync(() => {
        setIsExportingPdf(true);
      });
      setPdfExportError("");

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

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

      pdf.addImage(
        imageData,
        "JPEG",
        offsetX,
        offsetY,
        renderWidth,
        renderHeight,
      );

      const fileName = "saheli-dashboard-report.pdf";

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
        setIsExportingPdf(false);
      });
    }
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
    <div className="relative min-h-screen overflow-auto bg-[#f7f4fa] p-3 text-slate-800 md:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(230,0,126,0.13),transparent_38%),radial-gradient(circle_at_82%_18%,_rgba(13,103,154,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(246,166,35,0.11),transparent_35%)]" />

      <div
        ref={reportContainerRef}
        id="report-export-root"
        className="relative mx-auto w-full max-w-[1450px] flex-col overflow-visible bg-white/85 p-3 shadow-[0_20px_60px_rgba(39,14,63,0.16)] backdrop-blur-sm md:p-4"
      >
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={saheliLogo}
              alt="Saheli Hub logo"
              className="h-7 w-auto md:h-8"
            />
            <div className="hidden border-l border-slate-200 pl-3 md:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#702283]">
                Health Impact Dashboard
              </p>
              <p className="text-[11px] text-slate-500">
                Comprehensive Assessment Report
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="rounded-xl bg-[#0d679a] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0a5680] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isExportingPdf ? "Exporting..." : "Export PDF"}
          </button>
        </header>

        {pdfExportError && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {pdfExportError}
          </div>
        )}

        <Motion.div className="space-y-4">
          {/* Executive Summary Section */}
          <Motion.section
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            <Motion.div
              variants={fadeUp}
              className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
                <p className="text-sm font-semibold">{executiveSummary.lens}</p>
              </div>
            </Motion.div>

            <Motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[#ed6ea7]/30 bg-[#fff4fa] px-3 py-2 text-[11px] leading-relaxed text-slate-700 shadow-sm"
            >
              {executiveSummary.summary}
            </Motion.div>
          </Motion.section>

          {/* KPIs Grid */}
          <Motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 gap-2 md:grid-cols-3"
          >
            {executiveSummary.kpis.map((kpi) => (
              <Motion.article
                key={kpi.label}
                variants={fadeUp}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
                    {kpi.label}
                  </p>
                  <span className="rounded-full bg-[#fef0f8] px-1.5 py-0.5 text-[8px] font-semibold text-[#e6007e]">
                    {kpi.trend}
                  </span>
                </div>
                <div>
                  <p className="mt-1 text-[1.2rem] font-semibold leading-none text-slate-900 md:text-[1.3rem]">
                    <CountUp
                      value={kpi.value}
                      suffix={kpi.suffix || ""}
                      isActive={!isExportingPdf}
                      disableAnimation={isExportingPdf}
                    />
                  </p>
                  <p className="mt-1 text-[9px] text-slate-500">{kpi.detail}</p>
                </div>
              </Motion.article>
            ))}
          </Motion.div>

          {/* Health Trends & Delivery Overview */}
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Health Trends */}
            <Motion.div
              variants={fadeUp}
              className="grid min-h-0 grid-rows-[auto_1fr] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0d679a]">
                  Health Trend Highlights
                </p>
                <p className="text-[9px] text-slate-500">
                  Assessment snapshots
                </p>
              </div>
              <div className="grid h-full min-h-0 grid-cols-2 gap-1.5 auto-rows-fr">
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
                  title="Blood Pressure"
                  systolic={executiveHealthTrends.bloodPressureSystolic}
                  diastolic={executiveHealthTrends.bloodPressureDiastolic}
                  systolicStroke="#e11d48"
                  diastolicStroke="#0d679a"
                />
                <MiniTrendCard
                  title="Wellbeing"
                  data={executiveHealthTrends.wellbeing}
                  stroke="#e6007e"
                  fill="rgba(230, 0, 126, 0.2)"
                  changeLabel="Up"
                />
              </div>
            </Motion.div>

            {/* Delivery Overview */}
            <Motion.div
              variants={fadeUp}
              className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0d679a]">
                  Delivery Overview
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Service Families
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2 text-center">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-slate-500">
                    Families
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {deliveryGroups.length}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2 text-center">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-slate-500">
                    Activities
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {cleanedActivities.length}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2 text-center">
                  <p className="text-[9px] uppercase tracking-[0.08em] text-slate-500">
                    Achievements
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {achievements.length}
                  </p>
                </div>
              </div>
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
                {deliveryGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                      {group.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#ed6ea7]/30 bg-[#fff7fb] px-1 py-0.5 text-[8px] text-slate-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Achievements & Case Study */}
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Achievements */}
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
                    className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2"
                  >
                    <p className="text-[9px] uppercase tracking-[0.07em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </Motion.article>

            {/* Case Study */}
            <Motion.article
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0d679a]">
                  Impact Story
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {managerCaseStudy.title}
                </h2>
              </div>

              <div className="mt-2 space-y-2">
                <div className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                    Background
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[9px] leading-relaxed text-slate-700">
                    {managerCaseStudy.background.slice(0, 2).map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 bg-[#fbfaff] p-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#702283]">
                    Key Outcomes
                  </p>
                  <ul className="mt-1 space-y-0.5 text-[9px] leading-relaxed text-slate-700">
                    {managerCaseStudy.outcomes.slice(0, 2).map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-[#ed6ea7]/35 bg-[#fff6fb] p-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6007e]">
                  Insight
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-slate-700 italic">
                  "{managerCaseStudy.quotes[0]}"
                </p>
              </div>
            </Motion.article>
          </div>

          {/* Photo Gallery */}
          <Motion.article
            variants={fadeUp}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d679a]">
              Photo Story ({photoGallery.length} images)
            </p>
            <div
              className="mt-2 grid grid-cols-4 gap-2 md:grid-cols-8"
              style={{
                gridTemplateRows: `repeat(${Math.ceil(photoGallery.length / 8)}, minmax(0, 1fr))`,
              }}
            >
              {photoGallery.slice(0, 16).map((photo, index) => (
                <div
                  key={photo.alt + index}
                  className="min-h-0 h-20"
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

          {/* Monthly Trends & Insights */}
          <div className="grid gap-3 lg:grid-cols-2">
            <Motion.article
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0d679a]">
                  Monthly Assessment Trend
                </p>
                <p className="text-[9px] text-slate-500">Sep 2024 - Apr 2026</p>
              </div>
              <div className="mt-2.5 flex h-16 items-end gap-0.5">
                {executiveVisuals.monthlyTrend.map((point, index) => (
                  <div
                    key={`${point}-${index}`}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#702283] via-[#e6007e] to-[#ed6ea7]"
                    style={{ height: `${Math.max(10, point * 0.4)}%` }}
                  />
                ))}
              </div>
            </Motion.article>

            <Motion.article
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0d679a]">
                Community Diversity Mix
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <div
                  className="h-16 w-16 rounded-full flex-shrink-0"
                  style={{
                    background:
                      "conic-gradient(#e6007e 0% 82%, #702283 82% 93%, #0d679a 93% 100%)",
                  }}
                />
                <div className="space-y-1">
                  {executiveVisuals.impactMix.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-[10px]"
                    >
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
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
          </div>

          {/* Leadership Note */}
          <Motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-200 bg-gradient-to-r from-[#702283]/5 to-[#e6007e]/5 px-3 py-2 text-[10px] leading-relaxed text-slate-700 shadow-sm"
          >
            <p className="font-semibold text-slate-900">Leadership Note</p>
            <p className="mt-1">{executiveSummary.leadership}</p>
          </Motion.div>
        </Motion.div>
      </div>
    </div>
  );
}

export default App;
