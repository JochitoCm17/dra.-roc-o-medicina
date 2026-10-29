// Todos los datos del consultorio viven aquí.
export const config = {
  doctor: {
    name: "Dra. Rocío Méndez",
    shortName: "Dra. Rocío",
    specialty: "Medicina Interna y Familiar",
    credentials: [
      "Médica y Cirujana — Universidad de San Carlos de Guatemala",
      "Especialidad en Medicina Interna — Hospital Roosevelt",
      "Colegiado activo No. 12345",
      "Miembro de la Asociación de Medicina Interna de Guatemala",
    ],
    philosophy:
      "Creo en una medicina que escucha primero. Cada paciente merece tiempo, claridad y un plan pensado para su vida real, no solo para sus síntomas.",
    stats: [
      { value: "15+", label: "años de experiencia" },
      { value: "8,000+", label: "pacientes atendidos" },
      { value: "4.9", label: "calificación promedio" },
    ],
  },
  contact: {
    phone: "+502 5555 1234",
    whatsapp: "50255551234", // solo dígitos, con código de país
    email: "consultorio@drarocio.com",
    calUrl: "https://cal.com/dra-rocio",
  },
  location: {
    address: "6a Avenida 12-34, Zona 10, Edificio Médico Torre Sur, Of. 502",
    city: "Ciudad de Guatemala",
    lat: 14.5995,
    lng: -90.5125,
  },
  // 0 = domingo ... 6 = sábado. null = cerrado. Formato 24h "HH:MM".
  hours: [
    { day: "Domingo", open: null, close: null },
    { day: "Lunes", open: "08:00", close: "18:00" },
    { day: "Martes", open: "08:00", close: "18:00" },
    { day: "Miércoles", open: "08:00", close: "18:00" },
    { day: "Jueves", open: "08:00", close: "18:00" },
    { day: "Viernes", open: "08:00", close: "17:00" },
    { day: "Sábado", open: "09:00", close: "13:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  services: [
    { title: "Consulta general", desc: "Evaluación integral, diagnóstico y plan de tratamiento personalizado." },
    { title: "Enfermedades crónicas", desc: "Control de diabetes, hipertensión y colesterol." },
    { title: "Chequeo preventivo", desc: "Exámenes anuales y detección temprana." },
    { title: "Telemedicina", desc: "Consultas por videollamada desde casa." },
    { title: "Certificados médicos", desc: "Laborales, deportivos y de salud." },
  ],
};

export function isOpenNow(d = new Date()) {
  const h = config.hours[d.getDay()];
  if (!h) return false;
  if (!h.open || !h.close) return false;
  const mins = d.getHours() * 60 + d.getMinutes();
  const toM = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3);
  return mins >= toM(h.open) && mins < toM(h.close);
}

export function buildWhatsAppMessage(f: { nombre: string; fecha: string; hora: string; servicio: string; mensaje: string }) {
  return [
    `Hola ${config.doctor.shortName}, quisiera agendar una cita.`,
    ``,
    `*Nombre:* ${f.nombre}`,
    `*Fecha:* ${f.fecha}`,
    `*Hora:* ${f.hora}`,
    `*Servicio:* ${f.servicio}`,
    f.mensaje ? `*Mensaje:* ${f.mensaje}` : "",
  ].filter(Boolean).join("\n");
}

export const waLink = (text?: string) =>
  `https://wa.me/${config.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
