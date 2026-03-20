import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-robe.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Toallas premium para el hogar"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-foreground/15" />
      </div>

      <div className="relative container mx-auto px-6 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-sm uppercase tracking-[0.2em] text-primary-foreground/80 mb-6"
          >
            Toallas para tu hogar
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl font-normal text-primary-foreground leading-[1.1] mb-6"
          >
            Suavidad y absorción premium para cada espacio de tu Hogar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-body text-lg text-primary-foreground/80 mb-10 max-w-xl text-pretty"
          >
            Descubre toallas de baño, mano y piso con acabados de calidad, diseñadas para brindar confort diario, alta absorción y larga duración.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-[0.1em] rounded-md hover:bg-gold-dark transition-all duration-200 hover:-translate-y-px shadow-card hover:shadow-card-hover"
            >
              Comprar ahora
            </Link>
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-body text-sm uppercase tracking-[0.1em] rounded-md border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-200"
            >
              Ver catálogo
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="font-body text-sm text-primary-foreground/70 mt-6"
          >
            ¿Buscas pedidos al por mayor? <Link to="/compras-corporativas" className="underline underline-offset-4 hover:text-primary-foreground">Ir a Compras Corporativas</Link>
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
