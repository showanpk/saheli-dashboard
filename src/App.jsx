import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const deliveryAreas = [
  {
    tag: "MOVE",
    title: "Physical Activity & Sport",
    activities: "Chair exercise, Innerva, Pilates, yoga, Zumba, tennis, cycling, swimming, walking and multisports.",
    benefit: "Improves mobility, strength and confidence while helping people build regular, enjoyable activity into everyday life.",
  },
  {
    tag: "HEALTH",
    title: "Health Prevention & Early Support",
    activities: "Know Your Numbers, blood pressure checks, health assessments, lifestyle conversations, diabetes prevention and signposting.",
    benefit: "Helps people understand health risks earlier, make informed choices and access further support when needed.",
  },
  {
    tag: "WELL",
    title: "Wellbeing & Social Connection",
    activities: "Lunch clubs, arts and crafts, gardening, wellbeing groups, community events and peer activities.",
    benefit: "Reduces isolation, creates friendships and belonging, and supports emotional wellbeing and positive routines.",
  },
  {
    tag: "LEARN",
    title: "Learning & Independence",
    activities: "ESOL, confidence workshops, health literacy, practical information sessions, digital and everyday skills.",
    benefit: "Builds communication, knowledge and practical confidence so people can access services and everyday opportunities more independently.",
  },
  {
    tag: "WORK",
    title: "Employment & Progression",
    activities: "Employment advice, job readiness, CV and application support, confidence for work, training and specialist referrals.",
    benefit: "Supports realistic steps towards training, volunteering and employment while linking health and wellbeing with progression.",
  },
  {
    tag: "INCLUDE",
    title: "Inclusive Community Support",
    activities: "Women’s and men’s programmes, older-adult and lower-mobility activities, culturally responsive outreach and one-to-one signposting.",
    benefit: "Removes barriers, reaches people who may not use mainstream services easily and creates trusted routes into wider support.",
  },
];

const outcomes = [
  "More active",
  "More health aware",
  "More connected",
  "More confident",
  "More independent",
  "Closer to opportunity",
];

function App() {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = async () => {
    if (!reportRef.current || isExporting) return;
    try {
      setIsExporting(true);
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;
      const imageRatio = canvas.width / canvas.height;
      const pageRatio = usableWidth / usableHeight;

      let width = usableWidth;
      let height = usableHeight;
      if (imageRatio > pageRatio) height = usableWidth / imageRatio;
      else width = usableHeight * imageRatio;

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.97),
        "JPEG",
        (pageWidth - width) / 2,
        (pageHeight - height) / 2,
        width,
        height,
      );
      pdf.save("saheli-one-page-service-overview.pdf");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0f6] px-3 py-5 text-slate-800 sm:px-6">
      <div className="mx-auto mb-3 flex max-w-[980px] justify-end print:hidden">
        <button
          onClick={exportPdf}
          disabled={isExporting}
          className="rounded-xl bg-[#702283] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#5e1c70] disabled:opacity-60"
        >
          {isExporting ? "Creating PDF..." : "Export one-page PDF"}
        </button>
      </div>

      <main
        ref={reportRef}
        id="saheli-one-page"
        className="mx-auto w-full max-w-[980px] overflow-hidden rounded-[26px] bg-white shadow-[0_20px_70px_rgba(66,33,78,0.14)] print:rounded-none print:shadow-none"
      >
        <header className="relative overflow-hidden bg-gradient-to-br from-[#642176] via-[#8b247f] to-[#e6007e] px-8 py-7 text-white">
          <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full border-[34px] border-white/10" />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-[#702283]">S</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">Saheli Hub</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ffd4ea]">One-page service overview</p>
              <h1 className="mt-1 text-4xl font-semibold leading-tight">What Saheli Delivers</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/90">
                Saheli combines physical activity, health prevention, wellbeing, learning, employment support and community connection in trusted, accessible settings.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Our purpose</p>
              <p className="mt-1 max-w-[250px] text-sm font-semibold leading-5">Help people become healthier, more confident, more connected and better able to progress.</p>
            </div>
          </div>
        </header>

        <section className="px-7 py-5">
          <div className="mb-4 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0d679a]">Core delivery</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Activities and participant benefits</h2>
            </div>
            <p className="hidden max-w-sm text-right text-xs leading-5 text-slate-500 md:block">
              People can enter through one activity and connect to wider support as their needs and confidence develop.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {deliveryAreas.map((area) => (
              <article key={area.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#702283] to-[#e6007e] text-[8px] font-black tracking-[0.08em] text-white">
                    {area.tag}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900">{area.title}</h3>
                    <p className="mt-1 text-[11px] leading-[1.45] text-slate-600"><span className="font-bold text-[#0d679a]">We deliver:</span> {area.activities}</p>
                    <p className="mt-1.5 rounded-lg bg-[#fff6fb] px-2.5 py-2 text-[11px] leading-[1.45] text-slate-700"><span className="font-bold text-[#e6007e]">Benefit:</span> {area.benefit}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-7 rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <div className="grid gap-4 md:grid-cols-[0.72fr_1.28fr] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8fd3f4]">How Saheli works</p>
              <h2 className="mt-1 text-lg font-semibold">One connected participant journey</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {["Welcome & understand", "Connect to support", "Build confidence & routine", "Progress or refer onward"].map((step, index) => (
                <div key={step} className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2.5">
                  <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#f6a623] text-[10px] font-black text-slate-900">{index + 1}</div>
                  <p className="mt-1.5 text-[10px] font-semibold leading-4 text-white/90">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-7 py-5">
          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#702283]">What changes for people</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-xl border border-[#702283]/10 bg-[#f8f3fa] px-3 py-2.5 text-center text-[11px] font-bold text-slate-800">
                    {outcome}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#0d679a]/15 bg-[#f4fafd] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0d679a]">The Saheli difference</p>
              <p className="mt-2 text-xs leading-5 text-slate-700">
                Saheli does more than run activities. It creates a trusted bridge between <strong>community participation, better health, social connection, learning and wider opportunity</strong>, with signposting and partnership referrals when additional support is needed.
              </p>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-100 bg-[#fcfbfd] px-7 py-3 text-[10px] text-slate-500">
          <p className="font-semibold text-slate-700">Saheli Hub — What We Deliver & Why It Matters</p>
          <p>Activity and benefit focused • No performance totals</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
