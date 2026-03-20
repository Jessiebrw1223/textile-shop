import { motion } from "framer-motion";
import { Shield, Droplets, House, Clock3 } from "lucide-react";

const badges = [
  { icon: Shield, label: "Calidad premium", sub: "Acabado suave y durable" },
  { icon: Droplets, label: "Alta absorción", sub: "Ideal para uso diario" },
  { icon: House, label: "Para todo el hogar", sub: "Baño, mano y piso" },
  { icon: Clock3, label: "Envío rápido", sub: "Atención ágil y segura" },
];

const TrustBanner = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {badges.map((b) => (
            <div key={b.label} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background shadow-card flex items-center justify-center">
                <b.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{b.label}</p>
                <p className="font-body text-xs text-muted-foreground">{b.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBanner;
