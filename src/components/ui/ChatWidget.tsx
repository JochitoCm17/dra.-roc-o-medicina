import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { config, buildWhatsAppMessage } from "@/config";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `¡Hola! 👋 Bienvenido a ${config.brand.name}. Soy el asistente virtual. ¿En qué te puedo ayudar hoy? Puedes preguntarme por horarios, ubicación, doctores o agendar una cita.`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMessages: Message[] = [...messages, { sender: "user", text: userMsg }];
    setMessages(newMessages);
    setInput("");

    // Lógica de respuestas contextuales de la clínica
    setTimeout(() => {
      let botResponse = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes("horario") || lower.includes("hora") || lower.includes("abierto")) {
        botResponse = "Atendemos de Lunes a Viernes de 8:00 AM a 5:00 PM, y los Sábados de 8:00 AM a 12:00 PM. Los Domingos permanecemos cerrados.";
      } else if (lower.includes("ubicacion") || lower.includes("donde") || lower.includes("direccion") || lower.includes("queda")) {
        botResponse = `Nos encontramos en ${config.location.address}, ${config.location.city}.`;
      } else if (lower.includes("doctor") || lower.includes("especialista") || lower.includes("medico") || lower.includes("rocio") || lower.includes("eliud")) {
        botResponse = "Contamos con dos especialistas principales:\n• Dra. Rocío Murillo — Medicina General\n• Dr. Eliud Estrada — Odontología Integral y Estética Dental";
      } else if (lower.includes("cita") || lower.includes("agendar") || lower.includes("reservar") || lower.includes("whatsapp")) {
        botResponse = `Puedes agendar tu cita directamente a nuestro WhatsApp ${config.contact.phone} haciendo clic en el botón de agendar en la página o indicándome tu área de interés.`;
      } else if (lower.includes("hola") || lower.includes("buenas")) {
        botResponse = "¿En qué te puedo colaborar hoy? Puedes consultarme sobre nuestras consultas médicas, tratamientos odontológicos, horarios o ubicación.";
      } else {
        botResponse = "Para consultas específicas o evaluaciones médicas personalizadas, te recomendamos comunicarte directamente a nuestro WhatsApp oficial.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
          aria-label="Abrir chat de asistencia"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden md:inline font-medium text-sm">¿Consultas? Habla con la IA</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[480px] rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden transition-all duration-300">
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Asistente {config.brand.name}</h3>
                <p className="text-[11px] text-blue-100">Responde al instante</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensajes */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu duda aquí..."
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
