import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ShoppingBag, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { productService } from "@/services/productService";
import type { Product } from "@/types/product";
import { getGramaje, getProductDisplayType } from "@/utils/productDisplay";

const categories = ["Todas", "Toalla de baño", "Toalla de mano", "Toalla de piso", "Batas", "Paquete"];
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setProducts(await productService.getAll());
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getFallbackImage = (productId: number) => {
    const fallbackImages = [
      `${API_BASE_URL}/images/product-1.jpg`,
      `${API_BASE_URL}/images/product-2.jpg`,
      `${API_BASE_URL}/images/product-3.jpg`,
      `${API_BASE_URL}/images/product-4.jpg`,
    ];
    return fallbackImages[productId % fallbackImages.length];
  };

  const catalogProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        displayType: getProductDisplayType(product),
        gramaje: getGramaje(product),
        image: product.imageUrl?.trim()
          ? `${API_BASE_URL}${product.imageUrl}`
          : getFallbackImage(product.id),
        fallbackImage: getFallbackImage(product.id),
      })),
    [products]
  );

  const filtered =
    selectedCategory === "Todas"
      ? catalogProducts
      : catalogProducts.filter((p) => p.displayType === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Nuestra colección
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground">
              Catálogo de toallas
            </h1>
            <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
              Encuentra toallas de baño, mano y piso con gramaje visible, precio claro y una compra simple desde cualquier dispositivo.
            </p>
          </div>

          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="hidden md:flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-md font-body text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-md font-body text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} /> Filtros
            </button>

            <p className="font-body text-sm text-muted-foreground whitespace-nowrap">
              {loading ? "Cargando..." : `${filtered.length} productos`}
            </p>
          </div>

          {showFilters && (
            <div className="md:hidden flex gap-2 mb-6 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-md font-body text-sm ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="text-center py-16 font-body text-muted-foreground">
              Cargando productos...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16 font-body text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-background rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <Link to={`/producto/${product.id}`}>
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = product.fallbackImage;
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 text-foreground font-body text-xs uppercase tracking-wide px-4 py-2 rounded-md flex items-center gap-2">
                          <Eye size={14} /> Ver producto
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <p className="font-body text-[11px] uppercase tracking-[0.16em] text-primary mb-2">
                      {product.displayType}
                    </p>
                    <Link to={`/producto/${product.id}`}>
                      <h3 className="font-display text-xl text-foreground mb-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-body text-xs text-muted-foreground mb-2">
                      Gramaje: {product.gramaje}
                    </p>
                    <p
                      className={`font-body text-xs mb-3 ${
                        product.stock > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-base font-medium text-foreground tabular-nums">
                        S/ {product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => navigate(`/producto/${product.id}`)}
                        className={`p-2.5 rounded-md transition-all duration-200 ${
                          product.stock === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-primary-foreground hover:bg-gold-dark hover:-translate-y-px"
                        }`}
                        aria-label={`Ver ${product.name}`}
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
