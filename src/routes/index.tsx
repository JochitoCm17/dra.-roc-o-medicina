import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  motion, MotionConfig, AnimatePresence, useScroll, useTransform, useInView, animate, useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  CalendarCheck, Phone, MapPin, Navigation, Clock, Stethoscope, HeartPulse, ShieldCheck,
  FileText, Award, Sparkles, Smile, Droplets, Gem, ShieldPlus, MessageCircle, ArrowRight,
  ArrowUpRight, Menu, X, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { config, isOpenNow, buildWhatsAppMessage, waLink, getArea, type AreaId } from "@/config";
import { ChatWidget } from "@/components/ui/ChatWidget";

const { brand } = config;
const title = `${brand.fullName} — ${brand.slogan}`;
const desc = `Medicina general y odontología integral en ${config.location.city}. Agenda tu cita por WhatsApp con la Dra. Rocío Murillo o el Dr. Eliud Estrada.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ease = [0.22, 1, 0.36, 1] as const;
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };
const stagger = { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const;
const hoverCard = { whileHover: { y: -8, scale: 1.02 }, transition: { type: "spring", stiffness: 300, damping: 22 } } as const;

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const tel = `tel:${config.contact.phone.replace(/\s/g, "")}`;

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Specialists />
        <Booking />
        <Location />
      </main>
      <Footer />
      <FloatingWhatsApp />
      {/* Mini Robot Asistente IA DocBot */}
      <ChatWidget />
    </MotionConfig>
  );
}

function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("cita");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(!!e?.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`animate-glow fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-soft transition-all duration-300 md:hidden ${hidden ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#especialistas", label: "Especialistas" },
  { href: "#cita", label: "Citas" },
  { href: "#ubicacion", label: "Ubicación" },
];

function Logo({ size = "size-9" }: { size?: string }) {
  return (
    <span className={`${size} shrink-0 overflow-hidden rounded-full bg-card ring-1 ring-gold/60`}>
      <img src={brand.logo} alt={`Logo ${brand.name}`} className="size-full object-cover" />
    </span>
  );
}

function CtaButton({ children, href, type, className = "" }: { children: ReactNode; href?: string; type?: "submit"; className?: string }) {
  const cls = `btn-shimmer rounded-full ${className}`;
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;
  return href ? (
    <Button asChild size="lg" className={cls}><a href={href}>{inner}</a></Button>
  ) : (
    <Button type={type} size="lg" className={cls}>{inner}</Button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <motion.header initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }} className="fixed inset-x-0 top-3 z-40 px-4">
      <nav className={`glass mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border px-2 py-1.5 transition-all duration-500 ${scrolled ? "shadow-nav border-border" : "border-transparent"}`}>
        <a href="#" className="flex min-w-0 items-center gap-2">
          <Logo />
          <span className="truncate font-display text-base font-semibold">{brand.name}</span>
        </a>
        <ul className="hidden gap-1 text-sm font-medium text-muted-foreground md:flex">
          {links.map((l) => (
            <li key={l.href}><a className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent hover:text-foreground" href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-1">
          <Button asChild size="sm" className="btn-shimmer h-8 rounded-full px-4">
            <a href="#cita"><span className="relative z-10">Agendar cita</span></a>
          </Button>
          <button className="p-1.5 md:hidden" aria-label="Menú" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto mt-2 max-w-5xl space-y-1 rounded-2xl border p-3 shadow-nav md:hidden">
          {links.map((l) => (
            <li key={l.href}><a onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-accent" href={l.href}>{l.label}</a></li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}

function OpenCard() {
  const now = useNow();
  const open = now ? isOpenNow(now) : false;
  const today = now ? config.hours[now.getDay()] ?? null : null;
  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center gap-3">
        <span className={`size-3 shrink-0 rounded-full ${open ? "animate-glow bg-success" : "bg-gold"}`} />
        <p className="font-semibold">Atención inmediata disponible</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {!now ? "Consultando horario…" : open
          ? `Abierto ahora · hasta las ${today?.close}`
          : today?.open ? `Cerrado ahora · hoy de ${today.open} a ${today.close}` : "Cerrado hoy · escríbenos y te respondemos pronto"}
      </p>
      <a href={tel} className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <Phone className="size-4 text-gold transition-transform group-hover:rotate-12" /> {config.contact.phone}
      </a>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const [rocio, eliud] = config.doctors;
  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-24 pt-32 md:pt-40">
      <div className="pointer-events-none absolute -right-32 top-0 size-[32rem] rounded-full bg-accent blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[22rem] rounded-full bg-gold/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="size-4 text-gold" /> Clínica Médica y Odontológica
          </motion.p>
          <motion.h1 variants={item} className="text-5xl font-medium leading-[1.03] md:text-7xl">
            Tu salud, <em className="text-gold">nuestra</em> prioridad.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-lg text-muted-foreground">
            Medicina general y odontología integral en un mismo lugar, en {config.location.city}. Atención cálida, moderna y profesional para toda tu familia.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <CtaButton href="#cita"><CalendarCheck className="size-4" /> Agendar cita</CtaButton>
            <Button asChild size="lg" variant="outline" className="group glass-card rounded-full">
              <a href="#servicios">Ver servicios <ArrowRight className="transition-transform group-hover:translate-x-1" /></a>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }} className="relative pb-10">
          <div className="grid grid-cols-2 gap-4">
            {rocio && (
              <motion.div style={{ y: y1 }} className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-gold/40">
                <img src={rocio.photo} alt={`Retrato de la ${rocio.name}`} width={896} height={1120} className="aspect-[3/4] w-full object-cover" />
              </motion.div>
            )}
            {eliud && (
              <motion.div style={{ y: y2 }} className="mt-12 overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-gold/40">
                <img src={eliud.photo} alt={`Retrato del ${eliud.name}`} width={896} height={1120} className="aspect-[3/4] w-full object-cover" />
              </motion.div>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 }} className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 md:w-[80%]">
            <OpenCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.div {...stagger} className="mb-12 max-w-2xl">
      <motion.p variants={item} className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-gold">
        <span className="h-px w-8 bg-gold" /> {kicker}
      </motion.p>
      <motion.h2 variants={item} className="text-4xl font-medium md:text-5xl">{title}</motion.h2>
      {children && <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}

const serviceIcons: Record<AreaId, (typeof Stethoscope)[]> = {
  medica: [Stethoscope, ShieldCheck, HeartPulse, FileText],
  odontologica: [Smile, Droplets, Sparkles, Gem, ShieldPlus],
};

function Services() {
  const [tab, setTab] = useState<AreaId>("medica");
  const area = getArea(tab)!;
  const doctor = config.doctors.find((d) => d.id === area.doctorId);
  const [big, ...rest] = area.services as [(typeof area.services)[number], ...typeof area.services];
  const icons = serviceIcons[tab];
  return (
    <section id="servicios" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead kicker="Servicios" title="Dos especialidades, un mismo cuidado" />
          <div role="tablist" aria-label="Áreas de servicio" className="glass-card mb-12 inline-flex self-start rounded-full p-1 md:self-auto">
            {config.areas.map((a) => (
              <button key={a.id} role="tab" aria-selected={tab === a.id} onClick={() => setTab(a.id)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === a.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab === a.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-gradient-deep" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} variants={container} initial="hidden" animate="show" exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
            className="grid gap-4 md:grid-cols-4 md:grid-rows-2" role="tabpanel">
            <motion.article variants={item} {...hoverCard}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-deep p-8 text-primary-foreground shadow-xl transition-shadow hover:shadow-glow md:col-span-2 ${rest.length > 3 ? "md:row-span-2" : "md:row-span-2"}`}>
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gold/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative flex items-center justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary-foreground/15 text-gold backdrop-blur-md">
                  {(() => { const I = icons[0] ?? Stethoscope; return <I className="size-7" />; })()}
                </span>
                {doctor && <span className="rounded-full border border-gold/50 px-3 py-1 text-xs font-medium text-gold">{doctor.name}</span>}
              </div>
              <div className="relative mt-16">
                <p className="text-sm uppercase tracking-widest opacity-70">{area.label}</p>
                <h3 className="mt-2 text-3xl md:text-4xl">{big.title}</h3>
                <p className="mt-3 max-w-sm opacity-85">{big.desc}</p>
                <a href="#cita" className="mt-6 inline-flex items-center gap-2 font-semibold text-gold">
                  Reservar ahora <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.article>
            {rest.map((s, i) => {
              const Icon = icons[i + 1] ?? Stethoscope;
              const wide = rest.length === 4 && i === 3;
              return (
                <motion.article key={s.title} variants={item} {...hoverCard}
                  className={`glass-card group rounded-3xl p-6 transition-shadow hover:shadow-glow ${wide ? "md:col-span-2" : ""}`}>
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-gold">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const target = parseFloat(value.replace(/,/g, ""));
  const decimals = value.includes(".") ? 1 : 0;
  const suffix = value.replace(/[\d.,]/g, "");
  const fmt = (n: number) => n.toLocaleString("es-HN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const [display, setDisplay] = useState(fmt(0));
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(fmt(target)); return; }
    const c = animate(0, target, { duration: 2, ease, onUpdate: (v) => setDisplay(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <span ref={ref}>{display}</span>;
}

function Specialists() {
  return (
    <section id="especialistas" className="relative scroll-mt-28 overflow-hidden bg-secondary px-4 py-24">
      <div className="pointer-events-none absolute right-0 top-1/3 size-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHead kicker="Equipo médico" title="Nuestros Especialistas" />
        <motion.div {...stagger} className="grid gap-6 md:grid-cols-2">
          {config.doctors.map((d) => (
            <motion.article key={d.id} variants={item} {...hoverCard}
              className="glass-card group overflow-hidden rounded-3xl transition-shadow hover:shadow-glow">
              <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
                <div className="relative overflow-hidden">
                  <img src={d.photo} alt={`Retrato de ${d.name}`} width={896} height={1120} loading="lazy"
                    className="aspect-[4/5] size-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-auto" />
                </div>
                <div className="flex flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">{d.specialty}</p>
                  <h3 className="mt-2 text-2xl md:text-3xl">{d.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d.bio}</p>
                  <ul className="mt-5 space-y-2">
                    {d.credentials.map((c) => (
                      <motion.li key={c} whileHover={{ x: 4 }} className="flex items-start gap-2 text-sm">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" /> {c}
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                    {d.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl bg-background/70 p-3">
                        <p className="font-display text-2xl text-primary"><Counter value={s.value} /></p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Booking() {
  const [form, setForm] = useState({ nombre: "", area: "", fecha: "", hora: "", servicio: "", mensaje: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const area = getArea(form.area);
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => { const d = new Date(); setMinDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)); }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(waLink(buildWhatsAppMessage(form)), "_blank", "noopener,noreferrer");
  };
  const field = "field-teal h-12 rounded-xl bg-background/60 text-base md:text-sm";
  const selectCls = `${field} flex w-full border border-input px-3 disabled:opacity-60`;
  return (
    <section id="cita" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHead kicker="Agenda" title="Reserva tu cita en minutos">
            <p className="mt-4 text-muted-foreground">Elige el área, completa tus datos y se abrirá WhatsApp con tu solicitud lista para enviar. También puedes reservar directamente en nuestro calendario.</p>
          </SectionHead>
          <Button asChild variant="outline" size="lg" className="glass-card group -mt-4 rounded-full">
            <a href={config.contact.calUrl} target="_blank" rel="noopener noreferrer">
              <CalendarCheck /> Ver calendario en Cal.com <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>
        <motion.form {...stagger} onSubmit={submit} className="glass-card grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-8">
          <motion.div variants={item} className="space-y-2 md:col-span-2">
            <Label htmlFor="area">Especialidad / Médico</Label>
            <select id="area" required className={selectCls} value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value, servicio: "" }))}>
              <option value="" disabled>Selecciona una opción</option>
              {config.areas.map((a) => <option key={a.id} value={a.id}>{a.bookingLabel}</option>)}
            </select>
          </motion.div>
          <motion.div variants={item} className="space-y-2 md:col-span-2"><Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" required autoComplete="name" className={field} value={form.nombre} onChange={set("nombre")} /></motion.div>
          <motion.div variants={item} className="space-y-2"><Label htmlFor="fecha">Fecha</Label><Input id="fecha" type="date" required min={minDate} className={field} value={form.fecha} onChange={set("fecha")} /></motion.div>
          <motion.div variants={item} className="space-y-2"><Label htmlFor="hora">Hora</Label><Input id="hora" type="time" required className={field} value={form.hora} onChange={set("hora")} /></motion.div>
          <motion.div variants={item} className="space-y-2 md:col-span-2">
            <Label htmlFor="servicio">Servicio</Label>
            <select id="servicio" required disabled={!area} className={selectCls} value={form.servicio} onChange={set("servicio")}>
              <option value="" disabled>{area ? "Selecciona un servicio" : "Primero elige la especialidad"}</option>
              {area?.services.map((s) => <option key={s.title}>{s.title}</option>)}
            </select>
          </motion.div>
          <motion.div variants={item} className="space-y-2 md:col-span-2"><Label htmlFor="mensaje">Mensaje (opcional)</Label><Textarea id="mensaje" rows={4} className="field-teal rounded-xl bg-background/60 text-base md:text-sm" value={form.mensaje} onChange={set("mensaje")} /></motion.div>
          <motion.div variants={item} className="md:col-span-2">
            <CtaButton type="submit" className="h-12 w-full"><MessageCircle className="size-4" /> Agendar Cita</CtaButton>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}

function Hours({ compact = false }: { compact?: boolean }) {
  const now = useNow();
  return (
    <ul className="space-y-1 text-sm">
      {config.hours.map((h, i) => {
        const today = now?.getDay() === i;
        return (
          <li key={h.day} className={`flex justify-between gap-4 rounded-lg px-3 py-2 transition-colors ${today
            ? compact ? "bg-gold/15 font-semibold text-gold" : "bg-gradient-deep font-semibold text-primary-foreground shadow-glow"
            : compact ? "" : "hover:bg-accent"}`}>
            <span>{h.day}{today && " · hoy"}</span>
            <span>{h.open ? `${h.open} – ${h.close}` : "Cerrado"}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Location() {
  const { lat, lng, address, city } = config.location;
  const q = encodeURIComponent(`${address}, ${city}`);
  return (
    <section id="ubicacion" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead kicker="Ubicación" title="Te esperamos en la clínica" />
        <motion.div {...stagger} className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <motion.div variants={item} className="overflow-hidden rounded-3xl border shadow-xl">
            <iframe title="Mapa de la clínica" className="h-[440px] w-full" loading="lazy"
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`} />
          </motion.div>
          <motion.div variants={item} className="glass-card rounded-3xl p-6">
            <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-gold" /> {address}, {city}</p>
            <h3 className="mt-6 flex items-center gap-2 text-xl"><Clock className="size-5 text-gold" /> Horarios</h3>
            <div className="mt-3"><Hours /></div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button asChild variant="outline" className="rounded-full bg-transparent transition-transform hover:-translate-y-0.5"><a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer"><MapPin /> Maps</a></Button>
              <Button asChild variant="outline" className="rounded-full bg-transparent transition-transform hover:-translate-y-0.5"><a href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes&q=${q}`} target="_blank" rel="noopener noreferrer"><Navigation /> Waze</a></Button>
              <Button asChild className="btn-shimmer rounded-full"><a href={tel}><span className="relative z-10 flex items-center gap-2"><Phone className="size-4" /> Llamar</span></a></Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-deep px-4 pb-24 pt-16 text-primary-foreground md:pb-10">
      <motion.div {...stagger} className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr_1fr_1.1fr]">
        <motion.div variants={item}>
          <div className="flex items-center gap-3">
            <Logo size="size-12" />
            <div>
              <p className="font-display text-xl">{brand.name}</p>
              <p className="text-xs text-gold">{brand.slogan}</p>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-70">Medicina general y odontología integral en {config.location.city}.</p>
        </motion.div>
        <motion.div variants={item}>
          <p className="mb-3 text-sm font-semibold text-gold">Navegación</p>
          <ul className="space-y-2 text-sm">
            {links.map((l) => <li key={l.href}><a className="opacity-80 transition hover:text-gold hover:opacity-100" href={l.href}>{l.label}</a></li>)}
          </ul>
        </motion.div>
        <motion.div variants={item}>
          <p className="mb-3 text-sm font-semibold text-gold">Contacto</p>
          <ul className="space-y-2 text-sm opacity-90">
            <li><a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold"><MessageCircle className="size-4" /> WhatsApp {config.contact.phone}</a></li>
            <li><a href={tel} className="inline-flex items-center gap-2 hover:text-gold"><Phone className="size-4" /> Llamar</a></li>
            <li className="flex gap-2"><MapPin className="size-4 shrink-0" /> {config.location.city}</li>
            <li>{config.contact.email}</li>
          </ul>
        </motion.div>
        <motion.div variants={item}>
          <p className="mb-3 text-sm font-semibold text-gold">Horarios</p>
          <div className="-mx-3 opacity-90"><Hours compact /></div>
        </motion.div>
      </motion.div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs opacity-70 md:flex-row md:justify-between">
        <p>Aviso legal: la información de este sitio es de carácter informativo y no sustituye una consulta médica. En caso de emergencia, acude al servicio de urgencias más cercano. © {new Date().getFullYear()} {brand.fullName}.</p>
        <p className="shrink-0">{brand.credit}</p>
      </div>
    </footer>
  );
}

// Keep Award imported icon referenced for future credential badges.
void Award;
