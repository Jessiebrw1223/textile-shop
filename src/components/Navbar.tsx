import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo2.jpg";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Compras Corporativas", href: "/compras-corporativas" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const handleNav = (href: string) => {
    navigate(href);
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-14">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Corporación Textil Salas SAC"
            className="h-14 w-auto object-contain md:h-16"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;

            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className={`font-body text-[15px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-slate-600 hover:text-[hsl(var(--gold-dark))]"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="p-2 text-slate-600 transition-colors hover:text-foreground"
            aria-label="Buscar"
          >
            <Search size={21} strokeWidth={1.8} />
          </button>

          <button
            className="p-2 text-slate-600 transition-colors hover:text-foreground"
            aria-label="Cuenta"
            onClick={() => navigate(isAuthenticated ? "/perfil" : "/login")}
          >
            <User size={21} strokeWidth={1.8} />
          </button>

          <button
            className="relative p-2 text-slate-600 transition-colors hover:text-foreground"
            aria-label="Carrito"
            onClick={() => navigate("/carrito")}
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="p-2 text-slate-600 transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X size={23} strokeWidth={1.8} /> : <Menu size={23} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;

                return (
                  <button
                    key={link.label}
                    className={`border-b border-border/70 py-3 text-left font-body text-[15px] font-medium uppercase tracking-[0.05em] ${
                      isActive ? "text-foreground" : "text-slate-700"
                    }`}
                    onClick={() => {
                      handleNav(link.href);
                      setMobileOpen(false);
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}

              <Link
                to={isAuthenticated ? "/perfil" : "/login"}
                className="border-b border-border/70 py-3 font-body text-[15px] font-medium uppercase tracking-[0.05em] text-slate-700"
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated ? "Mi Cuenta" : "Iniciar Sesión"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
