import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product";
import { getBenefitCopy, getGramaje, getPresentationOptions, getProductDisplayType } from "@/utils/productDisplay";

const API_BASE_URL = "http://127.0.0.1:10000";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    getProductById(Number(id))
      .then(setProduct)
      .catch(() => setError("No se pudo cargar el producto."))
      .finally(() => setLoading(false));
  }, [id]);

  const getFallbackImages = (productId: number) => {
    const fallbackImages = [
      `${API_BASE_URL}/images/product-1.jpg`,
      `${API_BASE_URL}/images/product-2.jpg`,
      `${API_BASE_URL}/images/product-3.jpg`,
      `${API_BASE_URL}/images/product-4.jpg`,
    ];
    return [fallbackImages[productId % fallbackImages.length]];
  };

  const productImages = useMemo(() => {
    if (!product) return [] as string[];

    const main = product.imageUrl?.trim()
      ? `${API_BASE_URL}${product.imageUrl}`
      : getFallbackImages(product.id)[0];

    return [main];
  }, [product]);

  const productSizes = useMemo(() => {
    if (!product) return [] as string[];
    return getPresentationOptions(product);
  }, [product]);

  useEffect(() => {
    if (productSizes.length) setSelectedSize(productSizes[0]);
  }, [productSizes]);

  useEffect(() => {
    setMainImage(0);
  }, [product?.id]);

  const totalPrice = product ? product.price * qty : 0;

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      material: getProductDisplayType(product),
      price: product.price,
      qty,
      size: selectedSize,
      image: productImages[0] || `${API_BASE_URL}/images/product-1.jpg`,
    });
    setAdded(true);
    toast({
      title: "¡Producto agregado!",
      description: `${qty}x ${product.name} añadido al carrito`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/carrito");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center py-20 font-body text-muted-foreground">
            Cargando producto...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center py-20">
            <p className="font-body text-red-500 mb-4">{error || "Producto no encontrado."}</p>
            <Link to="/catalogo" className="font-body text-sm text-primary hover:underline">
              Volver al catálogo
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayType = getProductDisplayType(product);
  const gramaje = getGramaje(product);
  const benefitCopy = getBenefitCopy(product);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <nav className="font-body text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden shadow-card mb-4">
                <img
                  src={productImages[mainImage]}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = `${API_BASE_URL}/images/product-1.jpg`;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      mainImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = `${API_BASE_URL}/images/product-1.jpg`;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-primary mb-2">
                {displayType}
              </p>
              <h1 className="font-display text-4xl text-foreground mb-4">{product.name}</h1>

              <div className="mb-6">
                <p className="font-display text-3xl text-primary tabular-nums">
                  S/ {totalPrice.toFixed(2)}
                </p>
                {qty > 1 && (
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    S/ {product.price.toFixed(2)} c/u
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg border border-border p-4 bg-secondary/50">
                  <p className="font-body text-xs uppercase tracking-wide text-muted-foreground mb-1">Gramaje</p>
                  <p className="font-body text-sm font-medium text-foreground">{gramaje}</p>
                </div>
                <div className="rounded-lg border border-border p-4 bg-secondary/50">
                  <p className="font-body text-xs uppercase tracking-wide text-muted-foreground mb-1">Suavidad</p>
                  <p className="font-body text-sm font-medium text-foreground">Acabado premium</p>
                </div>
                <div className="rounded-lg border border-border p-4 bg-secondary/50">
                  <p className="font-body text-xs uppercase tracking-wide text-muted-foreground mb-1">Durabilidad</p>
                  <p className="font-body text-sm font-medium text-foreground">Uso diario</p>
                </div>
              </div>

              <p className="font-body text-muted-foreground mb-4 text-pretty">{benefitCopy}</p>
              <p className="font-body text-sm text-muted-foreground mb-4">{product.description}</p>
              <p className={`font-body text-sm mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `Disponible: ${product.stock} unidades` : "Producto sin stock"}
              </p>

              <div className="mb-6">
                <p className="font-body text-sm font-medium text-foreground mb-3">Presentación</p>
                <div className="flex gap-2 flex-wrap">
                  {productSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-md font-body text-sm border transition-colors ${
                        selectedSize === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="font-body text-sm font-medium text-foreground mb-3">Cantidad</p>
                <div className="inline-flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 text-muted-foreground hover:text-foreground"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-5 font-body text-sm tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((current) => Math.min(product.stock || 1, current + 1))}
                    disabled={qty >= product.stock}
                    className="p-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  className="w-full py-6 font-body text-sm uppercase tracking-wide gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? (
                    <>Sin stock</>
                  ) : added ? (
                    <><Check size={18} /> ¡Agregado!</>
                  ) : (
                    <><ShoppingBag size={18} /> Agregar al carrito</>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-6 font-body text-sm uppercase tracking-wide"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Comprar ahora — S/ {totalPrice.toFixed(2)}
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "Envío a todo el Perú" },
                  { icon: Shield, label: "Garantía de calidad" },
                  { icon: RotateCcw, label: "Compra segura" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center text-center gap-2">
                    <b.icon size={18} className="text-primary" />
                    <span className="font-body text-xs text-muted-foreground">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;