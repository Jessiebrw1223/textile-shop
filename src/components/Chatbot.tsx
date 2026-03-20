import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

type ChatAction = {
  label: string;
  href?: string;
  external?: boolean;
  kind?: "link" | "action";
  action?: "catalogo" | "bano" | "mano" | "piso" | "paquete" | "corporativo" | "whatsapp" | "contacto";
};

interface Message {
  id: number;
  text: string;
  from: "bot" | "user";
  actions?: ChatAction[];
}

const WHATSAPP_NUMBER = "51998482121";

const quickReplies = [
  "¿Qué toallas venden?",
  "¿Hacen envíos a provincia?",
  "Consulta de compras corporativas",
  "Consultar mi pedido",
  "¿Cómo me comunico?",
];

const buildWhatsappUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const botReplies = {
  productos: {
    text: "Ofrecemos toallas de baño, mano y piso. Elige una opción para ver lo que necesitas.",
    actions: [
      { label: "Ver catálogo", href: "/catalogo" },
      { label: "Toalla de baño", action: "bano", kind: "action" },
      { label: "Toalla de mano", action: "mano", kind: "action" },
      { label: "Toalla de piso", action: "piso", kind: "action" },
    ],
  },
  envio: {
    text: "Sí, realizamos envíos a todo el Perú. Lima Metropolitana en 1-2 días hábiles y provincias en 3-5 días. Envío gratis en compras mayores a S/ 200.",
    actions: [
      { label: "Ver catálogo", href: "/catalogo" },
      { label: "Hablar por WhatsApp", href: buildWhatsappUrl("Hola, quiero consultar sobre envíos."), external: true },
    ],
  },
  b2b: {
    text: "Para compras corporativas atendemos pedidos al por mayor, hoteles, negocios y requerimientos personalizados.",
    actions: [
      { label: "Compras Corporativas", href: "/compras-corporativas" },
      { label: "WhatsApp asesor", href: buildWhatsappUrl("Hola, estoy interesado en compras corporativas de toallas."), external: true },
    ],
  },
  pedido: {
    text: "Puedes revisar el estado de tu pedido desde tu cuenta. Si necesitas ayuda, también puedes comunicarte con nosotros.",
    actions: [
      { label: "Mi cuenta", href: "/perfil" },
      { label: "WhatsApp soporte", href: buildWhatsappUrl("Hola, quiero consultar el estado de mi pedido."), external: true },
    ],
  },
  soporte: {
    text: "Puedes comunicarte con nosotros por WhatsApp o revisar Compras Corporativas si buscas atención por volumen.",
    actions: [
      { label: "WhatsApp", href: buildWhatsappUrl("Hola, necesito ayuda con una consulta."), external: true },
      { label: "Compras Corporativas", href: "/compras-corporativas" },
      { label: "Ver catálogo", href: "/catalogo" },
    ],
  },
  default: {
    text: "Puedo ayudarte con productos, envíos, compras corporativas, pedidos o contacto. Elige una opción para continuar.",
    actions: [
      { label: "Ver catálogo", href: "/catalogo" },
      { label: "Compras Corporativas", href: "/compras-corporativas" },
      { label: "WhatsApp", href: buildWhatsappUrl("Hola, necesito información sobre sus productos."), external: true },
    ],
  },
  bano: {
  text: "Aquí puedes revisar nuestras toallas de baño disponibles con precios, stock y detalles.",
  actions: [
    { label: "Ver catálogo", href: "/catalogo" },
    { label: "Ir a Toalla de baño", href: "/catalogo?tipo=bano" },
  ],
},
mano: {
  text: "Aquí puedes revisar nuestras toallas de mano disponibles con precios, stock y detalles.",
  actions: [
    { label: "Ver catálogo", href: "/catalogo" },
    { label: "Ir a Toalla de mano", href: "/catalogo?tipo=mano" },
  ],
},
piso: {
  text: "Aquí puedes revisar nuestras toallas de piso disponibles con precios, stock y detalles.",
  actions: [
    { label: "Ver catálogo", href: "/catalogo" },
    { label: "Ir a Toalla de piso", href: "/catalogo?tipo=piso" },
  ],
},
paquete: {
  text: "Aquí puedes revisar nuestros paquetes disponibles con precios y detalles.",
  actions: [
    { label: "Ver catálogo", href: "/catalogo" },
    { label: "Ir a Paquetes", href: "/catalogo?tipo=paquete" },
  ],
},
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const resolveBotReply = (msg: string) => {
  const lower = normalize(msg);

  if (lower.includes("toalla de mano") || lower.includes("mano")) {
    return botReplies.mano;
  }

  if (lower.includes("toalla de piso") || lower.includes("piso")) {
    return botReplies.piso;
  }

  if (lower.includes("toalla de bano") || lower.includes("bano")) {
    return botReplies.bano;
  }

  if (
    lower.includes("set") ||
    lower.includes("paquete") ||
    lower.includes("pack")
  ) {
    return botReplies.paquete;
  }

  if (
    lower.includes("producto") ||
    lower.includes("toalla") ||
    lower.includes("catalogo") ||
    lower.includes("que venden")
  ) {
    return botReplies.productos;
  }

  if (
    lower.includes("envio") ||
    lower.includes("provincia") ||
    lower.includes("delivery")
  ) {
    return botReplies.envio;
  }

  if (
    lower.includes("b2b") ||
    lower.includes("volumen") ||
    lower.includes("empresa") ||
    lower.includes("hotel") ||
    lower.includes("corporativ") ||
    lower.includes("mayorista") ||
    lower.includes("cotiza")
  ) {
    return botReplies.b2b;
  }

  if (
    lower.includes("pedido") ||
    lower.includes("orden") ||
    lower.includes("seguimiento") ||
    lower.includes("estado")
  ) {
    return botReplies.pedido;
  }

  if (
    lower.includes("soporte") ||
    lower.includes("hablar") ||
    lower.includes("agente") ||
    lower.includes("ayuda") ||
    lower.includes("contacto") ||
    lower.includes("comunicar")
  ) {
    return botReplies.soporte;
  }

  return botReplies.default;
};
const Chatbot = () => {
  const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([
  {
    id: 1,
    text: "¡Hola! 👋 Soy el asistente de Textil Salas. ¿En qué puedo ayudarte hoy?",
    from: "bot",
  },
]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(2);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushBotReply = (text: string) => {
    const reply = resolveBotReply(text);
    const botMsg: Message = {
      id: nextId.current++,
      text: reply.text,
      from: "bot",
      actions: reply.actions,
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const send = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: nextId.current++,
      text,
      from: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      pushBotReply(text);
    }, 500);
  };

  const handleAction = (action?: ChatAction["action"]) => {
  if (!action) return;

  const replyMap: Record<string, { text: string; actions?: ChatAction[] }> = {
    bano: botReplies.bano,
    mano: botReplies.mano,
    piso: botReplies.piso,
    paquete: botReplies.paquete,
    corporativo: botReplies.b2b,
    contacto: botReplies.soporte,
    catalogo: {
      text: "Puedes revisar todo nuestro catálogo aquí.",
      actions: [{ label: "Ver catálogo", href: "/catalogo" }],
    },
    whatsapp: {
      text: "Puedes escribirnos directamente por WhatsApp.",
      actions: [
        {
          label: "Abrir WhatsApp",
          href: buildWhatsappUrl("Hola, necesito información sobre sus productos."),
          external: true,
        },
      ],
    },
  };

  const reply = replyMap[action];

  if (!reply) return;

  const botMsg: Message = {
    id: nextId.current++,
    text: reply.text,
    from: "bot",
    actions: reply.actions,
  };

  setMessages((prev) => [...prev, botMsg]);
};

  const renderAction = (action: ChatAction, index: number) => {
    if (action.kind === "action" && action.action) {
      return (
        <button
          key={`${action.label}-${index}`}
          onClick={() => handleAction(action.action)}
          className="rounded-full bg-primary px-4 py-2 text-xs font-body text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          {action.label}
        </button>
      );
    }

    if (action.href && action.external) {
      return (
        <a
          key={`${action.label}-${index}`}
          href={action.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-primary px-4 py-2 text-xs font-body text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          {action.label}
        </a>
      );
    }

    if (action.href) {
      return (
        <button
          key={`${action.label}-${index}`}
          onClick={() => {
            navigate(action.href!);
            setOpen(false);
          }}
          className="rounded-full bg-primary px-4 py-2 text-xs font-body text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          {action.label}
        </button>
      );
    }

    return null;
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated transition-colors hover:bg-gold-dark"
            aria-label="Abrir chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[560px] max-h-[calc(100vh-6rem)] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-elevated"
          >
            <div className="flex items-center justify-between bg-foreground px-5 py-4 text-primary-foreground">
              <div>
                <p className="font-display text-lg">Textil Salas</p>
                <p className="font-body text-xs text-primary-foreground/60">
                  Asistente virtual • En línea
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:bg-primary-foreground/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[88%]">
                    <div
                      className={`rounded-lg px-4 py-2.5 font-body text-sm whitespace-pre-line ${
                        m.from === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.from === "bot" && m.actions?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.actions.map((action, index) => renderAction(action, index))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border px-3 py-1.5 font-body text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 border-t border-border p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-md bg-secondary px-3 py-2 font-body text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => send(input)}
                className="rounded-md bg-primary p-2.5 text-primary-foreground transition-colors hover:bg-gold-dark"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;