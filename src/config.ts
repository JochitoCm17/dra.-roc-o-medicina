// Todos los datos de la clínica viven aquí //
import rocioImg from "@/assets/dra-rocio.jpg";
import eliudImg from "@/assets/dr-eliud.jpg";

export type AreaId = "medica" | "odontologica";

export const config = {
  brand: {
    name: "Clínica León de Judá",
    fullName: "Clínica Médica y Odontológica León de Judá",
    slogan: "Tu salud, nuestra prioridad",
    // Ponemos la ruta directa en texto sin usar .url
    logo: "/logo.png",
    logoFull: "/logo.png",
    credit: "Diseñado por JM Dev",
  },
  contact: {
    phone: "+504 9588-2611",
    whatsapp: "50495882611",
    email: "isaiestrda134@gmail.com",
    calUrl: "https://cal.com/clinica-leon-de-juda",
  },
  location: {
    address: "Aldea Cerro Grande, calle principal, una cuadra adelante del Césamo Cerro Grande",
    city: "Valle de Ángeles, Francisco Morazán, Honduras",
    lat: 14.1534,
    lng: -87.0356,
  },
  hours: [
    { day: "Domingo", open: null, close: null },
    { day: "Lunes", open: "08:00", close: "17:00" },
    { day: "Martes", open: "08:00", close: "17:00" },
    { day: "Miércoles", open: "08:00", close: "17:00" },
    { day: "Jueves", open: "08:00", close: "17:00" },
    { day: "Viernes", open: "08:00", close: "17:00" },
    { day: "Sábado", open: "08:00", close: "12:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  areas: [
    {
      id: "medica" as AreaId,
      label: "Área Médica",
      bookingLabel: "Consulta Médica - Dra. Rocío Murillo",
      doctorId: "rocio",
      services: [
        { title: "Consulta general", desc: "Evaluación integral, diagnóstico y plan de tratamiento personalizado." },
        { title: "Chequeos preventivos", desc: "Exámenes periódicos y detección temprana de padecimientos." },
        { title: "Condiciones crónicas", desc: "Manejo de diabetes, hipertensión y control metabólico." },
        { title: "Certificados médicos", desc: "Laborales, deportivos y de evaluación general." },
      ],
    },
    {
      id: "odontologica" as AreaId,
      label: "Área Odontológica",
      bookingLabel: "Cita Odontológica - Dr. Eliud Estrada",
      doctorId: "eliud",
      services: [
        { title: "Odontología general", desc: "Diagnóstico, prevención y tratamiento para toda la familia." },
        { title: "Limpieza ultrasónica", desc: "Remoción profunda de sarro sin molestias." },
        { title: "Blanqueamiento dental", desc: "Tratamientos estéticos para una sonrisa más luminosa." },
        { title: "Resinas estéticas", desc: "Restauraciones estéticas del color natural de tu diente." },
        { title: "Salud oral integral", desc: "Cuidado de encías y prevención de afecciones dentales." },
      ],
    },
  ],
  doctors: [
    {
      id: "rocio",
      name: "Dra. Rocío Méndez",
      specialty: "Medicina General e Interna",
      photo: "dra-rocio.jpg.png",
      bio: "Atención médica cercana, humana y sin prisas, enfocada en la prevención y bienestar integral.",
      credentials: ["Doctora en Medicina y Cirugía — UNAH", "Atención Médica Integral", "Colegio Médico de Honduras"],
      stats: [
        { value: "15+", label: "años de experiencia" },
        { value: "8,000+", label: "pacientes atendidos" },
      ],
    },
    {
      id: "eliud",
      name: "Dr. Eliud Estrada",
      specialty: "Odontología Integral y Estética Dental",
      photo: eliudImg,
      bio: "Tratamientos dentales modernos y cómodos para devolver la salud y la estética a tu sonrisa.",
      credentials: ["Doctor en Cirugía Dental — UNAH", "Estética y Salud Oral", "Colegio de Cirujanos Dentistas de Honduras"],
      stats: [
        { value: "10+", label: "años de experience" },
        { value: "5,000+", label: "sonrisas cuidadas" },
      ],
    },
  ],
};

export function isOpenNow(d = new Date()) {
  const h = config.hours[d.getDay()];
  if (!h || !h.open || !h.close) return false;
  const mins = d.getHours() * 60 + d.getMinutes();
  const toM = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3);
  return mins >= toM(h.open) && mins < toM(h.close);
}

export function getArea(id: string) {
  return config.areas.find((a) => a.id === id);
}

export function buildWhatsAppMessage(f: { nombre: string; area: string; fecha: string; hora: string; servicio: string; mensaje: string }) {
  const area = getArea(f.area);
  return [
    `Hola ${config.brand.name}, quisiera agendar una cita.`,
    `*Área:* ${area ? area.label.replace("Área ", "") : f.area}`,
    area ? `*Especialista:* ${area.bookingLabel.split(" - ")[1]}` : "",
    `*Nombre:* ${f.nombre}`,
    `*Fecha:* ${formatFecha(f.fecha)}`,
    `*Hora:* ${formatHora(f.hora)}`,
    `*Servicio:* ${f.servicio}`,
    f.mensaje ? `*Mensaje:* ${f.mensaje}` : "",
  ].filter(Boolean).join("\n");
}

export const waLink = (text?: string) =>
  `https://wa.me/${config.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("es-HN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function formatHora(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (h === undefined || m === undefined || isNaN(h)) return hhmm;
  const ap = h < 12 ? "a. m." : "p. m.";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ap}`;
}
