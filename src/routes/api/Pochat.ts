import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { config } from "@/config";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    try {
      const { message } = (await request.json()) as { message: string };

      if (!message) {
        return json({ error: "Mensaje vacío" }, { status: 400 });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return json({ error: "API Key no configurada en Vercel" }, { status: 500 });
      }

      // Prompt con todo el contexto oficial de la Clínica León de Judá
      const systemInstruction = `
Eres DocBot, el asistente médico virtual e inteligente de la ${config.brand.fullName}.
Tu tono es humano, sumamente amable, profesional, empático y respetuoso.

Información clave de la clínica:
- Nombre: ${config.brand.name} (${config.brand.fullName})
- Slogan: "${config.brand.slogan}"
- Ubicación: ${config.location.address}, ${config.location.city}.
- Teléfono / WhatsApp: ${config.contact.phone}
- Horarios de atención:
  • Lunes a Viernes: 8:00 AM a 5:00 PM
  • Sábados: 8:00 AM a 12:00 PM
  • Domingos: Cerrado

Especialistas de la clínica:
1. Dra. Rocío Murillo: Especialista en Medicina General. Ofrece evaluación integral, chequeos preventivos, control de condiciones crónicas (diabetes, hipertensión) y certificados médicos.
2. Dr. Eliud Estrada: Cirujano Dentista / Odontología Integral y Estética Dental. Ofrece limpieza ultrasónica, blanqueamiento dental, resinas estéticas y cuidado oral.

Instrucciones estrictas de comportamiento:
- Responde de forma clara, directa y en párrafos cortos (máximo 3 o 4 líneas).
- Si el usuario te saluda, salúdalo con calidez e indícale cómo puedes ayudarle.
- Si el usuario pregunta por síntomas (ej. dolor de garganta, dolor de muela, fiebre, etc.), dale recomendaciones preventivas generales muy breves y aclárale de forma empática que debe agendar una cita presencial con el especialista de la clínica para una evaluación oportuna. Jamás des diagnósticos médicos definitivos ni recetes medicamentos.
- Si el usuario muestra interés en agendar, indícale amablemente que puede usar el formulario de citas en la web o escribir directo al WhatsApp de la clínica (${config.contact.phone}).
- Mantén el formato de texto limpio.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nMensaje del paciente: ${message}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      const data = await response.json();
      const botText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Disculpa, tuve un pequeño parpadeo en mi conexión. ¿Podrías repetirme tu consulta o comunicarte a nuestro WhatsApp?";

      return json({ reply: botText });
    } catch (error) {
      return json(
        { reply: "Lo siento, ocurrió un error al procesar tu solicitud. Te invitamos a escribirnos directamente a nuestro WhatsApp." },
        { status: 500 }
      );
    }
  },
});
