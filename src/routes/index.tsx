import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  CalendarCheck, Phone, MapPin, Navigation, Clock, Stethoscope, HeartPulse,
  ShieldCheck, Video, FileText, Award, MessageCircle, ArrowRight, Menu, X,
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

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

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
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-success text-primary-foreground shadow-soft md:hidden"
      >
        <MessageCircle className="size-7" />
      </a>
    </MotionConfig>
  );
}

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#perfil", label: "Sobre mí" },
  { href: "#cita", label: "Citas" },
  { href: "#ubicacion", label: "Ubicación" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-3 shadow-soft">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Stethoscope className="size-4" />
          </span>
          {config.doctor.shortName}
        </a>
        <ul className="hidden gap-7 text-sm font-medium text-muted-foreground md:flex">
          {links.map((l) => (
            <li key={l.href}><a className="transition-colors hover:text-primary" href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button asChild className="rounded-full"><a href="#cita">Agendar cita</a></Button>
          <button className="md:hidden" aria-label="Menú" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="glass mx-auto mt-2 max-w-6xl space-y-1 rounded-2xl border p-3 md:hidden">
          {links.map((l) => (
            <li key={l.href}><a onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-accent" href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}

function OpenCard() {
  const now = useNow();
  const open = now ? isOpenNow(now) : false;
  const today = now ? config.hours[now.getDay()] ?? null : null;
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="relative flex size-3">
          {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />}
          <span className={`relative inline-flex size-3 rounded-full ${open ? "bg-success" : "bg-coral"}`} />
        </span>
        <p className="font-semibold">Atención inmediata disponible</p>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {!now ? "Consultando horario…" : open
          ? `Abierto ahora · hasta las ${today?.close}`
          : today?.open ? `Cerrado ahora · hoy de ${today.open} a ${today.close}` : "Cerrado hoy · escríbenos y te respondemos pronto"}
      </p>
      <a href={`tel:${config.contact.phone.replace(/\s/g, "")}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <Phone className="size-4" /> {config.contact.phone}
      </a>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-36 md:pt-44">
      <div className="pointer-events-none absolute -right-32 top-10 size-[28rem] rounded-full bg-accent blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <motion.div {...fade}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
            <HeartPulse className="size-4" /> {config.doctor.specialty}
          </p>
          <h1 className="text-5xl font-medium leading-[1.05] md:text-7xl">
            Medicina que te <em className="text-primary">escucha</em>, cuidado que <span className="text-coral">acompaña</span>.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Soy la {config.doctor.shortName}. Te ofrezco una atención cercana, sin prisas y basada en evidencia para ti y tu familia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full"><a href="#cita"><CalendarCheck /> Agendar cita</a></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-transparent"><a href="#servicios">Ver servicios <ArrowRight /></a></Button>
          </div>
        </motion.div>
        <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }} className="relative">
          <img src={drImg} alt={`Retrato de la ${config.doctor.name}`} width={896} height={1120} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft" />
          <div className="absolute -bottom-8 -left-4 w-[85%] md:-left-12">
            <OpenCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const icons: typeof Stethoscope[] = [Stethoscope, HeartPulse, ShieldCheck, Video, FileText];

function SectionHead({ kicker, title }: { kicker: string; title: ReactNode }) {
  return (
    <motion.div {...fade} className="mb-12 max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-coral">{kicker}</p>
      <h2 className="text-4xl font-medium md:text-5xl">{title}</h2>
    </motion.div>
  );
}

function Services() {
  const [big, ...rest] = config.services as [typeof config.services[number], ...typeof config.services];
  const BigIcon = Stethoscope;
  return (
    <section id="servicios" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHead kicker="Servicios" title="Cuidado integral, en un solo lugar" />
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <motion.article {...fade} className="flex flex-col justify-between rounded-3xl bg-ink p-8 text-ink-foreground md:col-span-2 md:row-span-2">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary"><BigIcon className="size-7" /></span>
            <div className="mt-16">
              <h3 className="text-3xl md:text-4xl">{big.title}</h3>
              <p className="mt-3 max-w-sm opacity-80">{big.desc}</p>
              <a href="#cita" className="mt-6 inline-flex items-center gap-2 font-semibold text-coral">Reservar ahora <ArrowRight className="size-4" /></a>
            </div>
          </motion.article>
          {rest.map((s, i) => {
            const Icon = icons[i + 1] ?? Stethoscope;
            return (
              <motion.article key={s.title} {...fade} transition={{ ...fade.transition, delay: 0.08 * (i + 1) }}
                className="rounded-3xl border bg-card p-6 transition-transform hover:-translate-y-1">
                <Icon className="size-6 text-primary" />
                <h3 className="mt-6 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Profile() {
  const d = config.doctor;
  return (
    <section id="perfil" className="scroll-mt-28 bg-secondary px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <motion.div {...fade}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-coral">Sobre mí</p>
          <h2 className="text-4xl font-medium md:text-5xl">{d.name}</h2>
          <blockquote className="mt-8 border-l-4 border-coral pl-6 font-display text-2xl italic leading-snug">
            “{d.philosophy}”
          </blockquote>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {d.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.ul {...fade} className="space-y-3 self-center">
          {d.credentials.map((c) => (
            <li key={c} className="flex gap-4 rounded-2xl bg-card p-5">
              <Award className="size-5 shrink-0 text-primary" />
              <span>{c}</span>
            </li>
          ))}
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
  const selectCls = "flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <section id="cita" className="scroll-mt-28 px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHead kicker="Agenda" title="Reserva tu cita en minutos" />
          <p className="-mt-6 text-muted-foreground">Completa el formulario y se abrirá WhatsApp con tu solicitud lista para enviar. También puedes elegir un horario directamente en mi calendario.</p>
          <Button asChild variant="outline" size="lg" className="mt-8 rounded-full bg-transparent">
            <a href={config.contact.calUrl} target="_blank" rel="noopener noreferrer"><CalendarCheck /> Ver calendario en Cal.com</a>
          </Button>
        </div>
        <motion.form {...fade} onSubmit={submit} className="grid gap-5 rounded-3xl border bg-card p-6 shadow-soft md:grid-cols-2 md:p-8">
          <div className="space-y-2 md:col-span-2"><Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" required className="h-11" value={form.nombre} onChange={set("nombre")} /></div>
          <div className="space-y-2"><Label htmlFor="fecha">Fecha</Label><Input id="fecha" type="date" required className="h-11" value={form.fecha} onChange={set("fecha")} /></div>
          <div className="space-y-2"><Label htmlFor="hora">Hora</Label><Input id="hora" type="time" required className="h-11" value={form.hora} onChange={set("hora")} /></div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="servicio">Servicio</Label>
            <select id="servicio" className={selectCls} value={form.servicio} onChange={set("servicio")}>
              {config.services.map((s) => <option key={s.title}>{s.title}</option>)}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="mensaje">Mensaje (opcional)</Label><Textarea id="mensaje" rows={4} value={form.mensaje} onChange={set("mensaje")} /></div>
          <Button type="submit" size="lg" className="rounded-full md:col-span-2"><MessageCircle /> Agendar Cita</Button>
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
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-3xl border shadow-soft">
            <iframe title="Mapa del consultorio" className="h-[420px] w-full" loading="lazy"
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`} />
          </div>
          <div className="rounded-3xl border bg-card p-6">
            <p className="flex gap-3"><MapPin className="size-5 shrink-0 text-primary" /> {address}, {city}</p>
            <h3 className="mt-6 flex items-center gap-2 text-xl"><Clock className="size-5 text-primary" /> Horarios</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {config.hours.map((h, i) => {
                const today = now?.getDay() === i;
                return (
                  <li key={h.day} className={`flex justify-between rounded-lg px-3 py-2 ${today ? "bg-primary font-semibold text-primary-foreground" : ""}`}>
                    <span>{h.day}{today && " · hoy"}</span>
                    <span>{h.open ? `${h.open} – ${h.close}` : "Cerrado"}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <Button asChild variant="outline" className="rounded-full bg-transparent"><a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer"><MapPin /> Maps</a></Button>
              <Button asChild variant="outline" className="rounded-full bg-transparent"><a href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes&q=${q}`} target="_blank" rel="noopener noreferrer"><Navigation /> Waze</a></Button>
              <Button asChild className="rounded-full"><a href={`tel:${config.contact.phone.replace(/\s/g, "")}`}><Phone /> Llamar</a></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-4 pb-24 pt-16 text-ink-foreground md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">{config.doctor.name}</p>
          <p className="mt-2 text-sm opacity-70">{config.doctor.specialty}</p>
        </div>
        <ul className="space-y-2 text-sm">
          {links.map((l) => <li key={l.href}><a className="opacity-80 hover:text-coral hover:opacity-100" href={l.href}>{l.label}</a></li>)}
        </ul>
        <div className="space-y-2 text-sm opacity-80">
          <p>{config.contact.phone}</p>
          <p>{config.contact.email}</p>
          <p>{config.location.city}</p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-ink-foreground/15 pt-6 text-xs opacity-60">
        Aviso legal: la información de este sitio es de carácter informativo y no sustituye una consulta médica. En caso de emergencia, acude al servicio de urgencias más cercano. © {new Date().getFullYear()} {config.doctor.name}.
      </p>
    </footer>
  );
}
