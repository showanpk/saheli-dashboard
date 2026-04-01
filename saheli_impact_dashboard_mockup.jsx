export default function SaheliImpactDashboardMockup() {
  const kpis = [
    { label: 'Total Attendances', value: '21,777', sub: 'Across the reporting year' },
    { label: 'Unique Participants', value: '1,897', sub: 'People reached' },
    { label: 'New Registrations', value: '598', sub: 'New people engaged' },
    { label: 'Women Reached', value: '85%', sub: 'Women participants' },
    { label: 'Ethnically Diverse', value: '95%', sub: 'Community reach' },
    { label: 'Most Deprived Areas', value: '77%', sub: 'IMD quintiles 1–2' },
  ];

  const delivery = [52, 58, 64, 62, 75, 82, 88, 84, 92, 97, 101, 108];
  const activityMix = [
    { name: 'Pilates', value: 28 },
    { name: 'Cycling', value: 22 },
    { name: 'Chair Exercise', value: 18 },
    { name: 'Dance Fitness', value: 16 },
    { name: 'Tennis & Other', value: 16 },
  ];

  const achievements = [
    { title: 'Awards Won', value: '4', note: 'Recognition across sport and inclusion' },
    { title: 'WorkWell Engaged', value: '213', note: 'People supported through health and employment' },
    { title: 'Into Work', value: '16', note: 'Returned to work or secured employment' },
    { title: 'Innerva Users', value: '1,500+', note: 'Accessed the power-assisted suite' },
  ];

  const future = [
    'Expand referral pathways with GP practices and NHS partners',
    'Scale women-only sport and active travel opportunities across more sites',
    'Grow employability and wellbeing support through WorkWell',
    'Use community evidence and case studies to strengthen future funding bids',
  ];

  const reasons = [
    { label: 'Increase exercise or mobility', width: '92%' },
    { label: 'Weight management', width: '78%' },
    { label: 'Long term health condition', width: '74%' },
    { label: 'Isolation or loneliness', width: '63%' },
    { label: 'Learning / employment', width: '48%' },
  ];

  return (
    <div className="min-h-screen bg-[#f6f3f7] p-6 md:p-10 text-slate-800">
      <div className="mx-auto max-w-7xl rounded-[28px] bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#b31273] via-[#d5428f] to-[#f18f01] px-8 py-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-white/80">Saheli Hub</div>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold leading-tight">Delivery, Impact & Future Opportunity Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm md:text-base text-white/90">
                A one-page executive dashboard showing what we delivered, what we achieved, and what we can grow next.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[320px]">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <div className="text-white/75">Reporting Period</div>
                <div className="mt-1 text-lg font-semibold">Apr 2024 – Mar 2025</div>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <div className="text-white/75">Theme</div>
                <div className="mt-1 text-lg font-semibold">Reach • Impact • Growth</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">Headline performance</h2>
              <span className="rounded-full bg-pink-50 px-4 py-1 text-sm font-medium text-pink-700">
                Executive overview
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {kpis.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
                  <div className="text-sm text-slate-500">{item.label}</div>
                  <div className="mt-3 text-3xl font-bold text-slate-900">{item.value}</div>
                  <div className="mt-2 text-xs text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7 rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">What we delivered</h3>
                  <p className="mt-1 text-sm text-slate-500">Illustrative monthly delivery trend for the reporting year</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">+ steady growth</div>
              </div>
              <div className="mt-8 flex h-72 items-end gap-3">
                {delivery.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-[#b31273] to-[#f18f01] shadow-sm"
                      style={{ height: `${v * 1.8}px` }}
                    />
                    <div className="text-xs text-slate-500">
                      {['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-5 rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold">Top activity mix</h3>
              <p className="mt-1 text-sm text-slate-500">A simple composition view for the mockup</p>
              <div className="mt-8 space-y-5">
                {activityMix.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-slate-500">{item.value}%</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#b31273] to-[#f18f01]"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                This panel is static on purpose, so it renders well as a presentation image even without a live dataset.
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">What we achieved</h3>
                  <p className="mt-1 text-sm text-slate-500">Programme outcomes and strategic highlights</p>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">Impact focus</div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {achievements.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
                    <div className="text-sm text-slate-500">{item.title}</div>
                    <div className="mt-2 text-4xl font-bold text-slate-900">{item.value}</div>
                    <div className="mt-2 text-sm text-slate-600">{item.note}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                <div className="text-sm uppercase tracking-[0.2em] text-white/60">Featured case study</div>
                <h4 className="mt-3 text-2xl font-bold">Real lives, real impact</h4>
                <p className="mt-3 text-sm leading-7 text-white/85">
                  A participant rebuilt confidence, improved wellbeing, reconnected socially, and moved closer to local, flexible employment with ongoing support.
                </p>
                <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/90">
                  “Community-led support helped me rebuild confidence, manage my wellbeing, and move towards work again.”
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xl font-bold">Why people join</h3>
              <p className="mt-1 text-sm text-slate-500">Illustrative demand profile</p>
              <div className="mt-8 space-y-5">
                {reasons.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-400">Priority</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#d5428f]"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-pink-50 p-5">
                  <div className="text-sm text-pink-700">Inclusion</div>
                  <div className="mt-2 text-3xl font-bold text-pink-900">High</div>
                </div>
                <div className="rounded-2xl bg-orange-50 p-5">
                  <div className="text-sm text-orange-700">Community trust</div>
                  <div className="mt-2 text-3xl font-bold text-orange-900">Strong</div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8 rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">What we can achieve next</h3>
                  <p className="mt-1 text-sm text-slate-500">Forward-looking growth story for funders, partners and leadership</p>
                </div>
                <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Future opportunity</div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {future.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#fff2f8] to-[#fff7ec] p-5 border border-pink-100">
                <div className="text-sm font-semibold text-slate-700">Suggested message for the dashboard footer</div>
                <p className="mt-2 text-sm text-slate-600 leading-7">
                  With sustained funding, stronger referral pathways, and continued community trust, the organisation is well placed to deepen health impact, widen reach, and create more pathways into wellbeing, confidence, and employment.
                </p>
              </div>
            </div>

            <div className="xl:col-span-4 rounded-3xl border border-slate-200 p-6 shadow-sm bg-slate-50">
              <h3 className="text-xl font-bold">Photo / story area</h3>
              <p className="mt-1 text-sm text-slate-500">Replace this with one strong programme image</p>
              <div className="mt-6 h-56 rounded-3xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-center px-6 text-slate-400">
                Add a participant photo, session photo, or site image here
              </div>
              <div className="mt-6 rounded-2xl bg-white p-5 border border-slate-200">
                <div className="text-sm font-semibold text-slate-700">Design note</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  For a presentation image, keep this dashboard to one page, use 1–2 photos only, and avoid overcrowding with too many tiny charts.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
