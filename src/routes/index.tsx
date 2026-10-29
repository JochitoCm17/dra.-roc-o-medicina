import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  motion, MotionConfig, useScroll, useTransform, useInView, animate, useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  CalendarCheck, Phone, MapPin, Navigation, Clock, Stethoscope, HeartPulse,
  ShieldCheck, Video, FileText, Award, GraduationCap, BadgeCheck, Users,
  MessageCircle, ArrowRight, ArrowUpRight, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { config, isOpenNow, buildWhatsAppMessage, waLink } from "@/config";
import drImg from "@/assets/dra-rocio.jpg";

const title = `${config.doctor.name} — ${config.doctor.specialty}`;
const desc = `Consultorio de la ${config.doctor.shortName} en ${config.location.city}. Atención cálida y profesional. Agenda tu cita por WhatsApp.`;

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
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const stagger = { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const;

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
        <Profile />
        <Booking />
        <Location />
      </main>
      <Footer />
      <FloatingWhatsApp />
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
        className={`animate-glow fixed bottom-5 transition-all duration-300 ${hidden ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
        data-x=" right-5 z-50 grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-soft md:hidden" 
      >
        <MessageCircle className="size-7" />
      </a>
  );
}

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#perfil", label: "Sobre mí" },
  { href: "#cita", label: "Citas" },
  { href: "#ubicacion", label: "Ubicación" },
];

function CtaButton({ children, href, type, className = "" }: { children: ReactNode; href?: string; type?: "submit"; className?: string }) {
  const cls = `btn-shimmer rounded-full ${className}`;
  return href ? (
    <Button asChild size="lg" className={cls}><a href={href}><span className="relative z-10 flex items-center gap-2">{children}</span></a></Button>
  ) : (
    <Button type={type} size="lg" className={cls}><span className="relative z-10 flex items-center gap-2">{children}</span></Button>
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
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease }}
      className="fixed inset-x-0 top-3 z-40 px-4"
    >
      <nav className={`glass mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-1.5 transition-all duration-500 ${scrolled ? "shadow-nav border-border" : "border-transparent"}`}>
        <a href="#" className="flex items-center gap-2 pl-1 font-display text-base font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-gradient-deep text-primary-foreground">
            <Stethoscope className="size-3.5" />
          </span>
          {config.doctor.shortName}
        </a>
        <ul className="hidden gap-1 text-sm font-medium text-muted-foreground md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a className="rounded-full px-3 py-1.5 transition-colors hover:bg-accent hover:text-foreground" href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="btn-shimmer h-8 rounded-full px-4">
            <a href="#cita"><span className="relative z-10">Agendar cita</span></a>
          </Button>
          <button className="p-1 md:hidden" aria-label="Menú" onClick={() => setOpen(!open)}>
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
        <span className={`size-3 rounded-full ${open ? "animate-glow bg-success" : "bg-coral"}`} />
        <p className="font-semibold">Atención inmediata disponible</p>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {!now ? "Consultando horario…" : open
          ? `Abierto ahora · hasta las ${today?.close}`
          : today?.open ? `Cerrado ahora · hoy de ${today.open} a ${today.close}` : "Cerrado hoy · escríbenos y te respondemos pronto"}
      </p>
      <a href={tel} className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <Phone className="size-4 transition-transform group-hover:rotate-12" /> {config.contact.phone}
      </a>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-24 pt-32 md:pt-40">
      <div className="pointer-events-none absolute -right-32 top-0 size-[32rem] rounded-full bg-accent blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[22rem] rounded-full bg-coral/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.2fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
            <HeartPulse className="size-4" /> {config.doctor.specialty}
          </motion.p>
          <motion.h1 variants={item} className="text-5xl font-medium leading-[1.03] md:text-7xl">
            Medicina que te <em className="text-primary">escucha</em>, cuidado que <span className="text-coral">acompaña</span>.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-lg text-muted-foreground">
            Soy la {config.doctor.shortName}. Te ofrezco una atención cercana, sin prisas y basada en evidencia para ti y tu familia.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <CtaButton href="#cita"><CalendarCheck className="size-4" /> Agendar cita</CtaButton>
            <Button asChild size="lg" variant="outline" className="group glass-card rounded-full">
              <a href="#servicios">Ver servicios <ArrowRight className="transition-transform group-hover:translate-x-1" /></a>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }} className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-soft">
            <motion.img style={{ y, scale }} src={drImg} alt={`Retrato de la ${config.doctor.name}`} width={896} height={1120} className="aspect-[4/5] w-full object-cover" />
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 }} className="absolute -bottom-8 -left-4 w-[85%] md:-left-12">
            <OpenCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const icons: (typeof Stethoscope)[] = [Stethoscope, HeartPulse, ShieldCheck, Video, FileText];

function SectionHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <motion.div {...stagger} className="mb-12 max-w-2xl">
      <motion.p variants={item} className="mb-3 text-sm font-semibold uppercase tracking-widest text-coral">{kicker}</motion.p>
      <motion.h2 variants={item} className="text-4xl font-medium md:text-5xl">{title}</motion.h2>
      {children && <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}

const hoverCard = { whileHover: { y: -8, scale: 1.02 }, transition: { type: "spring", stiffness: 300, damping: 22 } } as const;

function Services() {
  const [big, ...rest] = config.services as [(typeof config.services)[number], ...typeof config.services];
  return (
    <section id="servicios" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead kicker="Servicios" title="Cuidado integral, en un solo lugar" />
        <motion.div {...stagger} className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <motion.article variants={item} {...hoverCard}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-deep p-8 text-primary-foreground shadow-xl transition-shadow hover:shadow-glow md:col-span-2 md:row-span-2">
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary-foreground/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <span className="relative grid size-14 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur-md"><Stethoscope className="size-7" /></span>
            <div className="relative mt-16">
              <h3 className="text-3xl md:text-4xl">{big.title}</h3>
              <p className="mt-3 max-w-sm opacity-85">{big.desc}</p>
              <a href="#cita" className="mt-6 inline-flex items-center gap-2 font-semibold text-coral">
                Reservar ahora <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.article>
          {rest.map((s, i) => {
            const Icon = icons[i + 1] ?? Stethoscope;
            return (
              <motion.article key={s.title} variants={item} {...hoverCard}
                className="glass-card group rounded-3xl p-6 transition-shadow hover:shadow-glow">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.article>
            );
          })}
        </motion.div>
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
  const fmt = (n: number) => n.toLocaleString("es-GT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
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

const credIcons = [GraduationCap, Award, BadgeCheck, Users];

function Profile() {
  const d = config.doctor;
  return (
    <section id="perfil" className="relative scroll-mt-28 overflow-hidden bg-secondary px-4 py-24">
      <div className="pointer-events-none absolute right-0 top-1/3 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <motion.div {...stagger}>
          <motion.p variants={item} className="mb-3 text-sm font-semibold uppercase tracking-widest text-coral">Sobre mí</motion.p>
          <motion.h2 variants={item} className="text-4xl font-medium md:text-5xl">{d.name}</motion.h2>
          <motion.blockquote variants={item} className="mt-8 border-l-4 border-coral pl-6 font-display text-2xl italic leading-snug">
            “{d.philosophy}”
          </motion.blockquote>
          <motion.div variants={item} className="mt-10 grid grid-cols-3 gap-3">
            {d.stats.map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-4">
                <p className="font-display text-3xl text-primary md:text-4xl"><Counter value={s.value} /></p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <motion.ul {...stagger} className="space-y-3 self-center">
          {d.credentials.map((c, i) => {
            const Icon = credIcons[i % credIcons.length] ?? Award;
            return (
              <motion.li key={c} variants={item} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-card group flex cursor-default items-center gap-4 rounded-2xl p-4 transition-shadow hover:shadow-glow">
                <motion.span whileHover={{ rotate: -10, scale: 1.1 }}
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-deep text-primary-foreground">
                  <Icon className="size-5" />
                </motion.span>
                <span className="text-sm font-medium md:text-base">{c}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

function Booking() {
  const [form, setForm] = useState({ nombre: "", fecha: "", hora: "", servicio: config.services[0]!.title, mensaje: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(waLink(buildWhatsAppMessage(form)), "_blank", "noopener,noreferrer");
  };
  const field = "field-teal h-12 rounded-xl bg-background/60 text-base md:text-sm";
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => { const d = new Date(); setMinDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)); }, []);
  return (
    <section id="cita" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHead kicker="Agenda" title="Reserva tu cita en minutos">
            <p className="mt-4 text-muted-foreground">Completa el formulario y se abrirá WhatsApp con tu solicitud lista para enviar. También puedes elegir un horario directamente en mi calendario.</p>
          </SectionHead>
          <Button asChild variant="outline" size="lg" className="glass-card group -mt-4 rounded-full">
            <a href={config.contact.calUrl} target="_blank" rel="noopener noreferrer">
              <CalendarCheck /> Ver calendario en Cal.com <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>
        <motion.form {...stagger} onSubmit={submit} className="glass-card grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-8">
          <motion.div variants={item} className="space-y-2 md:col-span-2"><Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" required className={field} value={form.nombre} onChange={set("nombre")} /></motion.div>
          <motion.div variants={item} className="space-y-2"><Label htmlFor="fecha">Fecha</Label><Input id="fecha" type="date" required min={minDate} className={field} value={form.fecha} onChange={set("fecha")} /></motion.div>
          <motion.div variants={item} className="space-y-2"><Label htmlFor="hora">Hora</Label><Input id="hora" type="time" required className={field} value={form.hora} onChange={set("hora")} /></motion.div>
          <motion.div variants={item} className="space-y-2 md:col-span-2">
            <Label htmlFor="servicio">Servicio</Label>
            <select id="servicio" className={`${field} flex w-full border border-input px-3`} value={form.servicio} onChange={set("servicio")}>
              {config.services.map((s) => <option key={s.title}>{s.title}</option>)}
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

function Location() {
  const now = useNow();
  const { lat, lng, address, city } = config.location;
  const q = encodeURIComponent(`${address}, ${city}`);
  return (
    <section id="ubicacion" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead kicker="Ubicación" title="Te esperamos en el consultorio" />
        <motion.div {...stagger} className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <motion.div variants={item} className="overflow-hidden rounded-3xl border shadow-xl">
            <iframe title="Mapa del consultorio" className="h-[440px] w-full" loading="lazy"
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`} />
          </motion.div>
          <motion.div variants={item} className="glass-card rounded-3xl p-6">
            <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-primary" /> {address}, {city}</p>
            <h3 className="mt-6 flex items-center gap-2 text-xl"><Clock className="size-5 text-primary" /> Horarios</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {config.hours.map((h, i) => {
                const today = now?.getDay() === i;
                return (
                  <li key={h.day} className={`flex justify-between rounded-lg px-3 py-2 transition-colors ${today ? "bg-gradient-deep font-semibold text-primary-foreground shadow-glow" : "hover:bg-accent"}`}>
                    <span>{h.day}{today && " · hoy"}</span>
                    <span>{h.open ? `${h.open} – ${h.close}` : "Cerrado"}</span>
                  </li>
                );
              })}
            </ul>
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
      <motion.div {...stagger} className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <motion.div variants={item}>
          <p className="font-display text-2xl">{config.doctor.name}</p>
          <p className="mt-2 text-sm opacity-70">{config.doctor.specialty}</p>
        </motion.div>
        <motion.ul variants={item} className="space-y-2 text-sm">
          {links.map((l) => <li key={l.href}><a className="opacity-80 transition hover:text-coral hover:opacity-100" href={l.href}>{l.label}</a></li>)}
        </motion.ul>
        <motion.div variants={item} className="space-y-2 text-sm opacity-80">
          <p>{config.contact.phone}</p>
          <p>{config.contact.email}</p>
          <p>{config.location.city}</p>
        </motion.div>
      </motion.div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-primary-foreground/15 pt-6 text-xs opacity-60">
        Aviso legal: la información de este sitio es de carácter informativo y no sustituye una consulta médica. En caso de emergencia, acude al servicio de urgencias más cercano. © {new Date().getFullYear()} {config.doctor.name}.
      </p>
    </footer>
  );
}
