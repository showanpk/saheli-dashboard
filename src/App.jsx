import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { flushSync } from "react-dom";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const Motion = motion;

const deliveryAreas = [
  {
    code: "MOVE",
    title: "Physical Activity & Sport",
    strapline: "Making movement accessible, enjoyable and sustainable.",
    activities: [
      "Chair Exercise",
      "Innerva Fitness",
      "Pilates",
      "Yoga & Zumba",
      "Circuits & Body Conditioning",
      "Tennis",
      "Cycling",
      "Swimming",
      "Walking, Jogging & Running",
      "Multisports",
      "Archery & Bell Boating",
    ],
    benefits: [
      "Improves strength, balance, mobility and everyday function",
      "Builds confidence to become and stay physically active",
      "Creates realistic routes into regular exercise for different abilities",
      "Supports healthier routines while making activity social and enjoyable",
    ],
  },
  {
    code: "HEALTH",
    title: "Health Prevention & Early Intervention",
    strapline: "Helping people understand their health before problems become bigger.",
    activities: [
      "Know Your Numbers",
      "Blood pressure checks",
      "Health and lifestyle conversations",
      "Diabetes prevention support",
      "Healthy weight and activity guidance",
      "Health assessments",
      "Referral and signposting where further support is needed",
    ],
    benefits: [
      "Increases awareness of personal health risks and protective behaviours",
      "Encourages earlier action and appropriate contact with health services",
      "Helps people understand blood pressure, diabetes risk and lifestyle factors",
      "Supports informed choices around movement, food, sleep and self-management",
    ],
  },
  {
    code: "WELL",
    title: "Wellbeing & Social Connection",
    strapline: "Creating trusted spaces where people feel welcome, connected and supported.",
    activities: [
      "Lunch clubs",
      "Art & craft social groups",
      "Gardening and growing",
      "Wellbeing activities",
      "Group workshops",
      "Community events",
      "Peer connection through regular activities",
    ],
    benefits: [
      "Reduces isolation by creating regular opportunities to meet others",
      "Builds belonging, friendships and informal peer support",
      "Supports emotional wellbeing, resilience and confidence",
      "Provides a positive routine and a reason to stay connected with the community",
    ],
  },
  {
    code: "LEARN",
    title: "Learning, Confidence & Independence",
    strapline: "Building practical skills that help people take the next step.",
    activities: [
      "ESOL",
      "Confidence-building workshops",
      "Health literacy",
      "Practical information sessions",
      "Digital and everyday skills support",
      "Community learning opportunities",
    ],
    benefits: [
      "Improves confidence communicating in everyday situations",
      "Helps people understand information and access services more independently",
      "Builds practical skills for home, work and community life",
      "Creates progression routes into volunteering, training and employment support",
    ],
  },
  {
    code: "WORK",
    title: "Employment, Skills & Progression",
    strapline: "Supporting people to move towards work in a way that reflects their circumstances.",
    activities: [
      "Employment and skills advice",
      "Job-readiness support",
      "CV and application guidance",
      "Confidence for work",
      "Referral to training and specialist services",
      "Health-related employment support",
      "Partnership working with local employment services",
    ],
    benefits: [
      "Helps participants identify realistic next steps towards work or training",
      "Builds confidence and readiness to engage with employers and services",
      "Connects health, wellbeing and employment support rather than treating them separately",
      "Improves access to wider opportunities through trusted referral routes",
    ],
  },
  {
    code: "INCLUDE",
    title: "Targeted & Inclusive Community Support",
    strapline: "Designing support around the people and communities Saheli works with.",
    activities: [
      "Women's health and activity support",
      "Men's health and multisport activity",
      "Activities suitable for older adults and lower mobility",
      "Culturally responsive delivery",
      "Community outreach",
      "One-to-one signposting",
      "Support to access wider local services",
    ],
    benefits: [
      "Removes practical, cultural and confidence barriers to participation",
      "Reaches people who may not engage with mainstream services easily",
      "Creates trusted routes into health, activity, learning and support",
      "Enables people to take part at a level that feels safe and achievable",
    ],
  },
];

const participantJourney = [
  {
    step: "1",
    title: "Welcome & Understand",
    text: "A participant joins through outreach, referral, a community activity or direct contact. Saheli starts by understanding what matters to them and what support would be useful.",
  },
  {
    step: "2",
    title: "Connect to the Right Activity",
    text: "They are connected to suitable physical activity, health prevention, wellbeing, learning, employment or social support rather than being offered the same pathway as everyone else.",
  },
  {
    step: "3",
    title: "Build Confidence & Routine",
    text: "Regular contact helps participants build trust, confidence, skills, healthier habits and stronger social connections over time.",
  },
  {
    step: "4",
    title: "Progress & Refer On",
    text: "Where needed, Saheli supports the next step through follow-up, signposting, referrals, training, employment support or wider health and community services.",
  },
];

const outcomes = [
  {
    title: "More Active",
    text: "People have accessible opportunities to move more, build fitness and find activities they can continue.",
  },
  {
    title: "More Health Aware",
    text: "People better understand health risks, prevention and when to seek further help.",
  },
  {
    title: "More Connected",
    text: "Regular groups and activities create friendships, peer support and a stronger sense of belonging.",
  },
  {
    title: "More Confident",
    text: "Participants gain confidence to try new activities, communicate, make decisions and use local services.",
  },
  {
    title: "More Independent",
    text: "Learning, information and practical support help people navigate everyday life with greater independence.",
  },
  {
    title: "Closer to Opportunity",
    text: "Employment, skills and referral support help people move towards training, volunteering, work and wider opportunities.",
  },
];

const partnershipModel = [
  "Community organisations and local groups",
  "GP and health referral pathways",
  "Employment and skills services",
  "Funded health and activity programmes",
  "Local venues, coaches and delivery partners",
  "Outreach through trusted community networks",
];

function App() {
  const reportRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfExportError, setPdfExportError] = useState("");
  const shouldReduceMotion = useReducedMotion();

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
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
      },
    },
  };

  const handleExportPdf = async () => {
    if (!reportRef.current || isExportingPdf) return;

    try {
      flushSync(() => setIsExportingPdf(true));
      setPdfExportError("");

      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: Math.min(window.devicePixelRatio || 1, 1.6),
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const root = clonedDoc.getElementById("saheli-delivery-report");
          if (!root) return;
          root.classList.add("pdf-export-mode");
          const style = clonedDoc.createElement("style");
          style.textContent = `
            .pdf-export-mode * {
              animation: none !important;
              transition: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            .pdf-hide { display: none !important; }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const usableWidth = pageWidth - margin * 2;
      const renderedHeight = (canvas.height * usableWidth) / canvas.width;
      const pageContentHeight = pageHeight - margin * 2;
      const totalPages = Math.ceil(renderedHeight / pageContentHeight);
      const sourceSliceHeight = canvas.height / totalPages;

      for (let page = 0; page < totalPages; page += 1) {
        if (page > 0) pdf.addPage();

        const sliceCanvas = document.createElement("canvas");
        const y = Math.floor(page * sourceSliceHeight);
        const remaining = canvas.height - y;
        const sliceHeight = Math.min(Math.ceil(sourceSliceHeight), remaining);
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );

        const sliceHeightMm = (sliceHeight * usableWidth) / canvas.width;
        pdf.addImage(
          sliceCanvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          margin,
          margin,
          usableWidth,
          sliceHeightMm,
        );
      }

      pdf.save("saheli-what-we-deliver-and-benefits.pdf");
    } catch (error) {
      console.error("Failed to export PDF", error);
      setPdfExportError("Export failed. Please try again.");
    } finally {
      flushSync(() => setIsExportingPdf(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3f8] px-3 py-4 text-slate-800 md:px-6 md:py-7">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(230,0,126,0.10),transparent_32%),radial-gradient(circle_at_92%_16%,rgba(13,103,154,0.10),transparent_30%)]" />

      <main
        ref={reportRef}
        id="saheli-delivery-report"
        className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_80px_rgba(61,35,76,0.14)]"
      >
        <section className="relative overflow-hidden bg-gradient-to-br from-[#67217d] via-[#8b247f] to-[#e6007e] px-6 py-7 text-white md:px-10 md:py-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[46px] border-white/10" />
          <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-[#f6a623]/20 blur-2xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-black text-[#702283]">S</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/75">Saheli Hub</p>
                  <p className="text-xs font-semibold text-white">Community support that connects health, activity and opportunity</p>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ffd3ea]">Service Delivery Overview</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.04] md:text-6xl">
                What Saheli Delivers
                <span className="block text-[#ffe191]">and Why It Matters</span>
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/88 md:text-base">
                Saheli brings together physical activity, prevention, wellbeing, social connection, learning and progression support in trusted community settings. The focus is not simply on running activities — it is on helping people become healthier, more confident, more connected and better able to take their next step.
              </p>
            </div>

            <div className="pdf-hide shrink-0">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#702283] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExportingPdf ? "Creating PDF..." : "Export as PDF"}
              </button>
            </div>
          </div>
        </section>

        {pdfExportError && (
          <div className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:mx-10">
            {pdfExportError}
          </div>
        )}

        <Motion.div variants={stagger} initial="initial" animate="animate">
          <Motion.section variants={fadeUp} className="px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-3xl bg-[#f8f2fa] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#702283]">The Saheli approach</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Support the whole person, not just one issue.</h2>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Someone may first come to Saheli for an exercise class, a health check, ESOL, a social group or employment support. That first contact can open the door to wider help. Saheli's strength is connecting these needs rather than treating them as separate problems.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Accessible", "Activities are designed so people can take part at different starting points."],
                  ["Trusted", "Delivery takes place through familiar community relationships and settings."],
                  ["Connected", "Health, wellbeing, learning and progression support can link together."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-[#702283] to-[#e6007e]" />
                    <h3 className="text-base font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Motion.section>

          <Motion.section variants={fadeUp} className="border-y border-slate-100 bg-[#fcfbfd] px-6 py-9 md:px-10 md:py-11">
            <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0d679a]">Core delivery</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Activities and the benefits they create</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                These areas show the practical work Saheli delivers and the difference each type of support is intended to make for participants.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {deliveryAreas.map((area, index) => (
                <article key={area.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-start gap-4 border-b border-slate-100 p-5 md:p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#702283] to-[#e6007e] text-[10px] font-black tracking-[0.1em] text-white shadow-md">
                      {area.code}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Delivery area {String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">{area.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-slate-500">{area.strapline}</p>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
                    <div>
                      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#0d679a]">What we deliver</p>
                      <div className="flex flex-wrap gap-2">
                        {area.activities.map((activity) => (
                          <span key={activity} className="rounded-full border border-[#0d679a]/15 bg-[#f3f9fc] px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#fff7fb] p-4">
                      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#e6007e]">Participant benefits</p>
                      <ul className="space-y-2.5">
                        {area.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2.5 text-xs leading-5 text-slate-700">
                            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e6007e] text-[9px] font-bold text-white">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Motion.section>

          <Motion.section variants={fadeUp} className="px-6 py-9 md:px-10 md:py-11">
            <div className="rounded-[32px] bg-slate-900 p-6 text-white md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8fd3f4]">How support works</p>
              <h2 className="mt-2 text-3xl font-semibold">A participant journey, not a one-off activity</h2>

              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {participantJourney.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6a623] text-sm font-black text-slate-900">{item.step}</div>
                    <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Motion.section>

          <Motion.section variants={fadeUp} className="bg-[#f7f4fa] px-6 py-9 md:px-10 md:py-11">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.82fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#702283]">What changes for people</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">The benefits Saheli is working towards</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {outcomes.map((outcome) => (
                    <div key={outcome.title} className="rounded-2xl border border-white bg-white p-5 shadow-sm">
                      <h3 className="text-base font-bold text-slate-900">{outcome.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{outcome.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[28px] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0d679a]">Partnership delivery</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Saheli does not work in isolation.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Community impact is stronger when participants can move smoothly between Saheli and other local services. Partnership working expands access, improves referral routes and helps people receive the right support at the right time.
                </p>
                <div className="mt-5 space-y-2.5">
                  {partnershipModel.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#fbfafd] px-3 py-2.5 text-xs font-semibold text-slate-700">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#e6007e]" />
                      {item}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </Motion.section>

          <Motion.section variants={fadeUp} className="px-6 py-9 md:px-10 md:py-11">
            <div className="overflow-hidden rounded-[32px] border border-[#ed6ea7]/25 bg-gradient-to-r from-[#fff8fc] via-white to-[#f2f9fc] p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e6007e]">The overall value</p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900">Saheli creates a bridge between community participation and wider life improvement.</h2>
                </div>
                <p className="text-sm leading-7 text-slate-650">
                  The value of Saheli's delivery is in the combination: people can improve their physical health, understand health risks, meet others, build confidence, learn practical skills and move towards work or other opportunities through one trusted community organisation. A participant does not have to fit neatly into a single service — support can change as their needs and confidence change.
                </p>
              </div>
            </div>
          </Motion.section>
        </Motion.div>

        <footer className="flex flex-col gap-2 border-t border-slate-100 bg-white px-6 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="font-semibold text-slate-700">Saheli Hub — What We Deliver & Participant Benefits</p>
          <p>No performance totals shown • Activity and benefit focused overview</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
