// Todos los datos de la clínica viven aquí.
import logoEmblem from "@/assets/leon-emblem.png.asset.json";
import logoFull from "@/assets/leon-logo.png.asset.json";
import rocioImg from "@/assets/dra-rocio.jpg";
import eliudImg from "@/assets/dr-eliud.jpg";

export type AreaId = "medica" | "odontologica";

export const config = {
  brand: {
    name: "Clínica León de Judá",
    fullName: "Clínica Médica y Odontológica León de Judá",
    slogan: "Tu salud, nuestra prioridad",
    // Para cambiar el logo: reemplaza estas URLs por la imagen nueva.
    logo: logoEmblem.url,
    logoFull: logoFull.url,
    credit: "Diseñado por JM Dev",
  },
  contact: {
    phone: "+504 9999 9999",
    whatsapp: "50499999999", // solo dígitos, con código de país (+504)
    email: "contacto@clinicaleondejuda.hn",
    calUrl: "https://cal.com/clinica-leon-de-juda",
  },
  location: {
    address: "Colonia Palmira, Avenida República de Chile, Edificio Médico, Local 3",
    city: "Tegucigalpa, Honduras",
    lat: 14.0943,
    lng: -87.1872,
  },
  // 0 = domingo ... 6 = sábado. null = cerrado. Formato 24h "HH:MM".
  hours: [
    { day: "Domingo", open: null, close: null },
    { day: "Lunes", open: "08:00", close: "18:00" },
    { day: "Martes", open: "08:00", close: "18:00" },
    { day: "Miércoles", open: "08:00", close: "18:00" },
    { day: "Jueves", open: "08:00", close: "18:00" },
    { day: "Viernes", open: "08:00", close: "17:00" },
    { day: "Sábado", open: "08:00", close: "12:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  areas: [
    {
      id: "medica" as AreaId,
      label: "Área Médica",
      bookingLabel: "Consulta Médica - Dra. Rocío",
      doctorId: "rocio",
      services: [
        { title: "Consulta general", desc: "Evaluación integral, diagnóstico y plan de tratamiento personalizado." },
        { title: "Chequeos preventivos", desc: "Exámenes periódicos y detección temprana." },
        { title: "Condiciones crónicas", desc: "Manejo de diabetes, hipertensión y colesterol." },
        { title: "Certificados médicos", desc: "Laborales, deportivos y de salud." },
      ],
    },
    {
      id: "odontologica" as AreaId,
      label: "Área Odontológica",
      bookingLabel: "Cita Odontológica - Dr. Eliud Murillo",
      doctorId: "eliud",
      services: [
        { title: "Odontología general", desc: "Diagnóstico, prevención y tratamiento para toda la familia." },
        { title: "Limpieza ultrasónica", desc: "Remoción profunda de sarro sin molestias." },
        { title: "Blanqueamiento", desc: "Una sonrisa más luminosa de forma segura." },
        { title: "Resinas estéticas", desc: "Restauraciones del color natural de tu diente." },
        { title: "Salud oral integral", desc: "Seguimiento y hábitos para encías y dientes sanos." },
      ],
    },
  ],
  doctors: [
    {
      id: "rocio",
      name: "Dra. Rocío Méndez",
      specialty: "Medicina General e Interna",
      photo: rocioImg,
      bio: "Atención cercana y sin prisas, con planes pensados para la vida real de cada paciente.",
      credentials: ["Doctora en Medicina y Cirugía — UNAH", "Especialidad en Medicina Interna", "Colegio Médico de Honduras No. 00000"],
      stats: [
        { value: "15+", label: "años de experiencia" },
        { value: "8,000+", label: "pacientes" },
      ],
    },
    {
      id: "eliud",
      name: "Dr. Eliud Murillo",
      specialty: "Odontología Integral y Estética Dental",
      photo: eliudImg,
      bio: "Tratamientos cómodos y modernos para que sonrías con confianza en cada etapa de tu vida.",
      credentials: ["Doctor en Cirugía Dental — UNAH", "Diplomado en Estética Dental", "Colegio de Cirujanos Dentistas de Honduras No. 0000"],
      stats: [
        { value: "10+", label: "años de experiencia" },
        { value: "5,000+", label: "sonrisas atendidas" },
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
