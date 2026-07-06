import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  MessageCircle,
  CalendarCheck,
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  Wrench,
  LineChart,
  Menu,
  X,
  ArrowRight,
  Check,
} from "lucide-react";
import heroImg from "@/assets/hero-venue.jpg";
import founderImg from "@/assets/founder.jpg";
import checkinImg from "@/assets/checkin.jpg";
import { Feature } from "@/components/ui/features-section-demo-2";
import { OptimizedImage } from "@/components/ui/optimized-image";

export const Route = createFileRoute("/")({
  component: Landing,
});

const WHATSAPP_URL = "https://wa.me/27817505346?text=Hi%20CellarStay%20AI%2C%20I%27d%20like%20a%20free%20Booking%20Leak%20Audit%20for%20my%20venue.";

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <DemoTeaser />
      <Founder />
      <Pricing />
      <Results />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Services", "#services"],
    ["How It Works", "#how"],
    ["Pricing", "#pricing"],
    ["Results", "#results"],
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[color:var(--cream)]/85 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight text-[color:var(--ink)]">CellarStay</span>
          <span className="font-display text-2xl italic text-[color:var(--gold)]">AI</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-[color:var(--ink)]/80 transition hover:text-[color:var(--gold)]"
            >
              {label}
            </a>
          ))}
          <a
            href="/demo"
            className="rounded-md border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-3 py-1.5 text-sm font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--gold)]/20"
          >
            See It In Action
          </a>
          <a
            href="#contact"
            className="rounded-md bg-[color:var(--ink)] px-4 py-2.5 text-sm font-semibold text-[color:var(--cream)] transition hover:bg-[color:var(--gold)]"
          >
            Free Booking Audit
          </a>
        </nav>
        <button
          className="rounded-md p-2 text-[color:var(--ink)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-[color:var(--cream)] md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[color:var(--ink)]"
              >
                {label}
              </a>
            ))}
            <a
              href="/demo"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md border border-[color:var(--gold)]/50 bg-[color:var(--gold)]/10 px-3 py-3 text-center text-base font-semibold text-[color:var(--ink)]"
            >
              See It In Action
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-[color:var(--ink)] px-4 py-3 text-center text-sm font-semibold text-[color:var(--cream)]"
            >
              Free Booking Audit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative z-0 overflow-hidden bg-[color:var(--ink)] pt-28 pb-20 md:pt-40 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <OptimizedImage
          src={heroImg}
          alt="Aerial view of a Cape Winelands vineyard at golden hour"
          priority
          quality={90}
          sizes="100vw"
          className="h-full w-full object-cover"
          width={1792}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/70 to-ink/40" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="max-w-2xl text-[color:var(--cream)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--ink)]/40 px-3 py-1 text-xs font-medium tracking-wider text-[color:var(--gold-soft)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
            For Cape Winelands venues
          </span>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-tight text-[color:var(--cream)] md:text-6xl lg:text-7xl">
            Stop losing bookings to a{" "}
            <span className="italic text-[color:var(--gold-soft)]">missed WhatsApp</span> message.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-cream/85 md:text-xl">
            We build the booking site, WhatsApp automation and owner dashboard that quietly recover
            the enquiries your venue is losing every weekend — set up in weeks, not months.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--gold)] px-6 py-4 text-base font-semibold text-[color:var(--ink)] transition hover:bg-[color:var(--gold-soft)]"
            >
              See It In Action <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md border border-[color:var(--cream)]/30 px-6 py-4 text-base font-medium text-[color:var(--cream)] transition hover:bg-[color:var(--cream)]/10"
            >
              Get Your Free Booking Leak Audit
            </a>
          </div>
        </div>
        <div className="hidden lg:block">
          <TicketPreview />
        </div>
      </div>
    </section>
  );
}

function TicketPreview() {
  return (
    <div className="relative rounded-2xl bg-[color:var(--cream)] p-5 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between text-xs font-medium tracking-widest text-[color:var(--gold)] uppercase">
        <span>Booking · Confirmed</span>
        <span>#SAT–1942</span>
      </div>
      <div className="mt-4 font-display text-2xl text-[color:var(--ink)]">Weinberg Wine Estate</div>
      <div className="mt-1 text-sm text-muted-foreground">Sat 8pm · Table for 6 · Long-table dinner</div>
      <div className="perforated my-5" />
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Deposit</div>
          <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">Paid</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">WhatsApp</div>
          <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">Auto-sent</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Source</div>
          <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">Instagram</div>
        </div>
      </div>
      <div className="perforated my-5" />
      <div className="flex items-center gap-3 rounded-md bg-[color:var(--muted)] p-3 text-sm text-[color:var(--ink)]">
        <MessageCircle size={18} className="text-[color:var(--gold)]" />
        Guest asked about vegetarian menu — replied 12 sec ago.
      </div>
    </div>
  );
}

/* ---------------- Problem ---------------- */
function Problem() {
  const pains = [
    "The 9pm WhatsApp enquiry that gets answered three days late.",
    "The deposit that never gets chased, so the booking quietly falls away.",
    "Double-booked slots because everything lives in a notebook or someone's head.",
    "No visibility into which enquiries actually turn into paying guests.",
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <SectionEyebrow>The Problem</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            You're not short on interest. You're losing it after hours.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Most Western Cape venues we speak to don't have a marketing problem — they have a
            follow-up problem. Here's what quietly costs them bookings every single week.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {pains.map((p, i) => (
            <div
              key={p}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[color:var(--ink)]/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--burgundy)]/10 text-[color:var(--burgundy)] font-display text-lg">
                {i + 1}
              </div>
              <p className="text-[1.02rem] leading-relaxed text-[color:var(--ink)]">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Solution ---------------- */
function Solution() {
  const pillars = [
    {
      icon: CalendarCheck,
      title: "Booking-First Website",
      body: "A site built to turn enquiries into paid bookings — not just look pretty at the top of Google.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Automation",
      body: "Instant replies, deposit reminders and confirmations sent on autopilot, in your voice.",
    },
    {
      icon: Sparkles,
      title: "AI Concierge",
      body: "Answers menu, pricing and availability questions 24/7 — and takes the booking when the guest is ready.",
    },
    {
      icon: LayoutDashboard,
      title: "Owner Dashboard",
      body: "Every enquiry, deposit and confirmed booking in one place. Finally see what's actually happening.",
    },
  ];
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <SectionEyebrow>What You Get</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            One system. Four working parts. Zero fiddling for you.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {pillars.map(({ icon: Icon, title, body }, index) => (
            <Feature
              key={title}
              title={title}
              description={body}
              icon={<Icon size={22} />}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How ---------------- */
function HowItWorks() {
  const steps = [
    {
      icon: ClipboardList,
      title: "Free Booking Leak Audit",
      body: "A short, no-obligation review of where enquiries are currently getting lost — and roughly what that's costing you a month.",
    },
    {
      icon: Wrench,
      title: "We Build Your System",
      body: "Booking site, WhatsApp automation and owner dashboard — live and taking real bookings, typically within 2–3 weeks.",
    },
    {
      icon: LineChart,
      title: "You Watch It Work",
      body: "Monthly reporting shows bookings recovered and revenue directly attributable to the system. No dashboards to learn.",
    },
  ];
  return (
    <section id="how" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <SectionEyebrow>How It Works</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            Three steps. Most venues are live inside a month.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="rounded-xl border border-border bg-card p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-[color:var(--gold)]">0{i + 1}</span>
                  <s.icon className="text-[color:var(--ink)]/70" size={22} />
                </div>
                <div className="perforated my-5" />
                <h3 className="font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 h-px w-6 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Demo Teaser ---------------- */
function DemoTeaser() {
  return (
    <section className="bg-[color:var(--cream)] py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
        <h2 className="font-display text-4xl leading-tight md:text-5xl text-[color:var(--ink)]">
          See Exactly How It Works
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Take our interactive tour to see the guest journey from the first WhatsApp message all the way to your owner dashboard.
        </p>
        <div className="mt-10 mb-12 flex justify-center text-left">
          <TicketPreview />
        </div>
        <a
          href="/demo"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--ink)] px-8 py-4 text-lg font-semibold text-[color:var(--cream)] transition hover:bg-[color:var(--gold)] hover:text-[color:var(--ink)] shadow-lg"
        >
          Try the Interactive Demo <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
}

/* ---------------- Founder ---------------- */
function Founder() {
  return (
    <section className="bg-[color:var(--ink)] py-20 text-[color:var(--cream)] md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative">
          <img
            src={founderImg}
            alt="Portrait of the CellarStay AI founder"
            width={1024}
            height={1280}
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl object-cover"
          />
          <div className="absolute -bottom-5 -right-5 hidden rounded-xl bg-[color:var(--gold)] px-5 py-4 text-sm font-medium text-[color:var(--ink)] shadow-lg md:block">
            Front desk, then dashboards.
          </div>
        </div>
        <div>
          <SectionEyebrow className="text-[color:var(--gold-soft)]">Who Builds This</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight text-[color:var(--cream)] md:text-5xl">
            Built by someone who's actually run the front desk.
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-[color:var(--cream)]/85">
            <p>
              Before CellarStay AI, I spent my weekends and evenings inside real Western Cape
              venues — a function venue and a family adventure park — chasing deposits on WhatsApp,
              taking last-minute bookings by phone, and watching enquiries slip through the cracks
              on a busy Saturday night.
            </p>
            <p>
              I'm now a data science student, and CellarStay AI is the system I wish we'd had back
              then. Everything we build is shaped by what I saw actually happen at the door — not
              by a template a marketing agency dressed up.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MiniStat label="Venues operated inside" value="2" />
            <MiniStat label="Peak-weekend bookings handled" value="150+" />
            <MiniStat label="Based in" value="Cape Winelands" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--cream)]/15 p-4">
      <div className="font-display text-2xl text-[color:var(--gold-soft)]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-[color:var(--cream)]/60">{label}</div>
    </div>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing() {
  const tiers = [
    {
      name: "Starter",
      idealFor: "For guesthouses & small venues taking most bookings by phone or DM.",
      once: "R 5 000",
      monthly: "R 1 000",
      features: [
        "Booking-first single-page website",
        "WhatsApp click-to-chat + auto-reply",
        "Enquiry form → your inbox",
        "Basic monthly report",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      idealFor: "For function venues and wine estates doing weekly events.",
      once: "R 14 900",
      monthly: "R 2 500",
      features: [
        "Full booking site with availability",
        "WhatsApp automation & deposit chasing",
        "AI concierge (menu, pricing, hours)",
        "Owner dashboard — every enquiry in one view",
        "Monthly bookings-recovered report",
      ],
      highlighted: true,
    },
    {
      name: "Growth",
      idealFor: "For multi-space venues and adventure parks with several offerings.",
      once: "R 30 000",
      monthly: "R 5 000",
      features: [
        "Everything in Professional",
        "Multi-space & multi-offering booking",
        "Deposit collection + reconciliation",
        "Team accounts + role permissions",
        "Priority WhatsApp support",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <SectionEyebrow>Pricing</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            Straight pricing. No lock-in beyond the build.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Once-off build fee, then a monthly retainer that covers hosting, automation credits and
            ongoing tweaks. Cancel with 30 days' notice, keep your site.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-7 transition ${
                t.highlighted
                  ? "border-[color:var(--gold)] bg-[color:var(--ink)] text-[color:var(--cream)] shadow-2xl shadow-[color:var(--ink)]/10 lg:-translate-y-2"
                  : "border-border bg-[color:var(--cream)]"
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-7 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--ink)] uppercase">
                  Most Popular
                </span>
              )}
              <h3
                className={`font-display text-2xl ${
                  t.highlighted ? "text-[color:var(--cream)]" : ""
                }`}
              >
                {t.name}
              </h3>
              <p
                className={`mt-2 text-sm ${
                  t.highlighted ? "text-[color:var(--cream)]/70" : "text-muted-foreground"
                }`}
              >
                {t.idealFor}
              </p>
              <div className="perforated my-5" />
              <div>
                <div
                  className={`text-xs uppercase tracking-wider ${
                    t.highlighted ? "text-[color:var(--gold-soft)]" : "text-[color:var(--gold)]"
                  }`}
                >
                  Once-off build
                </div>
                <div className="font-display text-4xl">{t.once}</div>
                <div
                  className={`mt-1 text-sm ${
                    t.highlighted ? "text-[color:var(--cream)]/70" : "text-muted-foreground"
                  }`}
                >
                  then {t.monthly} / month
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                    <Check
                      size={16}
                      className={`mt-1 shrink-0 ${
                        t.highlighted ? "text-[color:var(--gold-soft)]" : "text-[color:var(--gold)]"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${
                  t.highlighted
                    ? "bg-[color:var(--gold)] text-[color:var(--ink)] hover:bg-[color:var(--gold-soft)]"
                    : "bg-[color:var(--ink)] text-[color:var(--cream)] hover:bg-[color:var(--gold)]"
                }`}
              >
                Book a free audit
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Prices in ZAR, ex-VAT. Every engagement starts with a free Booking Leak Audit.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Results ---------------- */
function Results() {
  const stats = [
    { label: "Booking enquiries recovered / month", value: "40+", note: "illustrative" },
    { label: "Average time to go live", value: "2–3 wks", note: "typical" },
    { label: "Owner hours saved per week", value: "8h", note: "illustrative" },
  ];

  return (
    <section id="results" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <SectionEyebrow>Results</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
            Numbers that matter to an owner, not a marketer.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3 md:p-8">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl text-[color:var(--ink)]">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-2 inline-block rounded bg-[color:var(--muted)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    {
      q: "Can't I just use Wix AI or ChatGPT for this?",
      a: "You could, and some owners try. The difference is that CellarStay AI is built around how a real venue actually takes bookings — deposits, WhatsApp, no-shows, walk-ins. Generic tools don't know your Saturday.",
    },
    {
      q: "How long does it take to get set up?",
      a: "Most venues are live within 2–3 weeks of signing off the audit. You'll spend about two short calls' worth of time on it — we do the rest.",
    },
    {
      q: "What if I'm not techy at all?",
      a: "That's exactly who this is built for. The owner dashboard is designed to be read in 30 seconds on your phone between guests. There's nothing to install.",
    },
    {
      q: "Do I need to change how I currently take bookings?",
      a: "No. We slot in around what already works. If you love WhatsApp, we make WhatsApp faster. If you use a spreadsheet, we replace it quietly without disrupting a live weekend.",
    },
    {
      q: "What happens after the site is built — am I on my own?",
      a: "You're on the monthly retainer, which means we keep the automations running, tweak copy and flows as your season changes, and send you a monthly report. Real human on WhatsApp when you need us.",
    },
  ];
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionEyebrow>Straight Answers</SectionEyebrow>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
          The questions owners actually ask us.
        </h2>
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border bg-[color:var(--cream)]">
          {items.map((it, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={it.q}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-lg text-[color:var(--ink)]">{it.q}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--gold)] text-[color:var(--gold)] transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-[0.98rem] leading-relaxed text-muted-foreground">
                    {it.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA + Contact ---------------- */
function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative z-0 overflow-hidden bg-[color:var(--ink)] py-20 text-[color:var(--cream)] md:py-28"
    >
      <div className="absolute inset-0 -z-10 opacity-25">
        <img src={checkinImg} alt="" className="h-full w-full object-cover" loading="lazy" width={1280} height={960} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/70" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionEyebrow className="text-[color:var(--gold-soft)]">Free Booking Leak Audit</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight text-[color:var(--cream)] md:text-6xl">
            Find out what your venue is <span className="italic text-[color:var(--gold-soft)]">quietly losing</span> every weekend.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-cream/85">
            No cost. No sales script. A one-page report showing where your bookings are leaking
            and roughly what it's worth to plug it.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md border border-[color:var(--gold)]/50 px-5 py-3 text-sm font-medium text-[color:var(--gold-soft)] transition hover:bg-[color:var(--gold)] hover:text-[color:var(--ink)]"
          >
            <MessageCircle size={16} /> Rather chat on WhatsApp
          </a>
        </div>
        <AuditForm />
      </div>
    </section>
  );
}

function AuditForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "05f280da-807b-4c18-8a2a-95dd8d0dc964");
    formData.append("subject", "New booking audit request from CellarStay AI website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { success?: boolean; message?: string };

      if (data.success) {
        setSent(true);
        setMessage("");
      } else {
        setMessage(data.message ?? "Your message could not be sent. Please try again or contact us directly.");
      }
    } catch {
      setMessage("Something went wrong. Please try again or send us a WhatsApp message instead.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-[color:var(--cream)] p-8 text-[color:var(--ink)]">
        <h3 className="font-display text-2xl">Thanks — we'll be in touch within one working day.</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Prefer to skip the wait? Message us on WhatsApp and we'll start the audit today.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-[color:var(--cream)]"
        >
          <MessageCircle size={16} /> Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-[color:var(--cream)] p-6 text-[color:var(--ink)] shadow-2xl shadow-black/30 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
        <Field label="Venue name" name="venue" required />
        <Field label="Venue type" name="type" as="select" options={[
          "Wine estate",
          "Function / event venue",
          "Guesthouse",
          "Family / adventure venue",
          "Other",
        ]} />
        <Field label="Phone / WhatsApp" name="phone" type="tel" required />
        <Field
          label="How you take bookings now"
          name="method"
          as="select"
          options={[
            "WhatsApp / DMs",
            "Phone calls",
            "Spreadsheet or notebook",
            "Existing booking software",
            "Not really taking bookings yet",
          ]}
        />
        <Field label="Anything we should know" name="message" as="textarea" full />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--ink)] px-5 py-4 text-base font-semibold text-[color:var(--cream)] transition hover:bg-[color:var(--gold)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending..." : "Send me my free audit"} <ArrowRight size={18} />
      </button>
      {message ? (
        <p className="mt-3 text-center text-sm text-[color:var(--ink)]">{message}</p>
      ) : (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          We reply from a real WhatsApp number — usually within a few hours.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  as = "input",
  options = [],
  full,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "select" | "textarea";
  options?: string[];
  full?: boolean;
}) {
  const base =
    "mt-1.5 w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/20";
  return (
    <label className={`block text-sm font-medium text-[color:var(--ink)] ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {as === "input" && <input name={name} type={type} required={required} className={base} />}
      {as === "textarea" && <textarea name={name} rows={3} className={base} />}
      {as === "select" && (
        <select name={name} className={base} defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </label>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-[color:var(--cream)] py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3 md:px-8">
        <div>
          <div className="font-display text-2xl text-[color:var(--ink)]">
            CellarStay <span className="italic text-[color:var(--gold)]">AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The digital front desk for wine estates, function venues and guesthouses across the
            Cape Winelands.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-[color:var(--ink)]">Explore</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><a href="#services" className="hover:text-[color:var(--gold)]">Services</a></li>
            <li><a href="#how" className="hover:text-[color:var(--gold)]">How it works</a></li>
            <li><a href="#pricing" className="hover:text-[color:var(--gold)]">Pricing</a></li>
            <li><a href="#results" className="hover:text-[color:var(--gold)]">Results</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium text-[color:var(--ink)]">Talk to us</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><a href="mailto:cellarstayai@gmail.com" className="hover:text-[color:var(--gold)]">cellarstayai@gmail.com</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-[color:var(--gold)]">WhatsApp us</a></li>
            <li>Cape Winelands · Boland · Western Cape</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-border px-5 pt-6 text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} CellarStay AI. Built in the Cape Winelands.
      </div>
    </footer>
  );
}

/* ---------------- shared ---------------- */
function SectionEyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)] ${className}`}
    >
      <span className="h-px w-6 bg-current" />
      {children}
    </span>
  );
}
