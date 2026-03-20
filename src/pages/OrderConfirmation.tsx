import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-6 text-center py-20 max-w-2xl">
        <CheckCircle2 className="mx-auto text-primary mb-6" size={64} />
        <h1 className="font-display text-4xl text-foreground mb-4">¡Compra confirmada!</h1>
        <p className="font-body text-muted-foreground mb-8">Tu pedido fue registrado correctamente en la base de datos. Puedes revisarlo desde tu perfil en la sección de pedidos.</p>
        <div className="flex items-center justify-center gap-4"><Link to="/perfil"><Button className="font-body uppercase tracking-wide">Ver mis pedidos</Button></Link><Link to="/catalogo"><Button variant="outline" className="font-body uppercase tracking-wide">Seguir comprando</Button></Link></div>
      </div>
    </div>
    <Footer />
  </div>
);

export default OrderConfirmation;
