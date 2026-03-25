import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo2.png";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded px-3 py-1.5 inline-block mb-4">
              <img src={logo} alt="Corporación Textil Salas SAC" className="h-12 w-auto" />
            </div>
            <p className="font-body text-sm text-primary-foreground/60 text-pretty">
              Toallas premium para hogares y una sección especializada de compras corporativas para pedidos al por mayor.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-primary-foreground/40 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Inicio</Link></li>
              <li><Link to="/catalogo" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Catálogo</Link></li>
              <li><Link to="/compras-corporativas" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Compras Corporativas</Link></li>
              <li><Link to="/perfil" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Mi Cuenta</Link></li>
              <li><Link to="/carrito" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-primary-foreground/40 mb-4">
              Categorías
            </h4>
            <ul className="space-y-2">
              {["Toalla de baño", "Toalla de mano", "Toalla de piso", "Compras rápidas"].map((link) => (
                <li key={link}>
                  <Link to="/catalogo" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs uppercase tracking-[0.15em] text-primary-foreground/40 mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-primary" />
                <a href="tel:998482121" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">998 482 121</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-primary" />
                <a href="mailto:ventas@textilsalas.com" className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">ventas@textilsalas.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-primary mt-0.5" />
                <span className="font-body text-sm text-primary-foreground/70">Lima, Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/40">
            © 2026 Corporación Textil Salas SAC. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              Privacidad
            </a>
            <a href="#" className="font-body text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
