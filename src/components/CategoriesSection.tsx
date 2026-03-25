import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import categoryTowels from "@/assets/category-towels.jpg";
import categoryRobes from "@/assets/category-robes.jpg";
import categorySets from "@/assets/category-sets.jpg";

const categories = [
  {
    title: "Toalla de baño",
    subtitle: "700 g/m² · Suavidad y confort diario",
    image: categoryTowels,
  },
  {
    title: "Batas",
    subtitle: "Suavidad y elegancia",
    image: categoryRobes,
  },
  {
    title: "Pack de Baño",
    subtitle: "Conjunto de toallas y batas para el hogar",
    image: categorySets,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const CategoriesSection = () => {
  return (
    <section id="categorias" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Nuestras categorías
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Toallas pensadas para cada espacio
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={item}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-3xl text-primary-foreground mb-1">
                  {cat.title}
                </h3>
                <p className="font-body text-sm text-primary-foreground/80 mb-4">
                  {cat.subtitle}
                </p>
                <Link to="/catalogo" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.12em] rounded-md hover:bg-gold-dark transition-colors">
                  Ver productos
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
