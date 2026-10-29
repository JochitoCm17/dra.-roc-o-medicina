import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Stethoscope, Sparkles, Loader2 } from "lucide-react";
import { config } from "@/config";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `¡Hola! 👋 Soy **DocBot**, el asistente virtual con IA de ${config.brand.name}. ¿En qué te puedo colaborar hoy? Puedes consultarme sobre síntomas, especialistas, horarios o agendar una cita.`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();
      const botReply = data.reply || "Disculpa, tuvo un contratiempo mi sistema. ¿Podrías intentar de nuevo?";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Para una atención inmediata, te invitamos a comunicarte directamente a nuestro WhatsApp oficial ${config.contact.phone}.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Botón Flotante DocBot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce"
          aria-label="Abrir asistente robótico"
        >
          <div className="relative bg-white text-blue-600 p-2 rounded-full shadow-md">
            <Bot className="w-6 h-6" />
            <Stethoscope className="w-3.5 h-3.5 text-teal-600 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-teal-200" />
          </div>

          <div className="text-left hidden sm:block">
            <p className="font-bold text-xs leading-none flex items-center gap-1">
              DocBot <Sparkles className="w-3 h-3 text-yellow-300" />
            </p>
            <p className="text-[10px] text-blue-100">Asistente Médico IA</p>
          </div>
        </button>
      )}

      {/* Ventana del Chat */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[490px] rounded-3xl shadow-2xl flex flex-col border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-white/20 rounded-2xl backdrop-blur-md">
                <Bot className="w-6 h-6 text-white" />
                <Stethoscope className="w-3.5 h-3.5 text-teal-300 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  DocBot 🤖🩺
                </h3>
                <p className="text-[11px] text-blue-100">Atención con IA 24/7 — {config.brand.name}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de escritura pensando */}
            {isLoading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>DocBot está pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de envío */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isLoading ? "DocBot respondiendo..." : "Pregúntale a DocBot..."}
              className="flex-1 px-4 py-2.5 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:opacity-90 transition-opacity shrink-0 shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
