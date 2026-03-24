import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree, ClipboardList, Users, BarChart3, Menu, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-textil-salas.png";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Productos", path: "/admin/productos", icon: Package },
  { label: "Categorías", path: "/admin/categorias", icon: FolderTree },
  { label: "Pedidos", path: "/admin/pedidos", icon: ClipboardList },
  { label: "Usuarios", path: "/admin/usuarios", icon: Users },
  { label: "Reportes", path: "/admin/reportes", icon: BarChart3 },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-secondary flex items-center justify-center font-body text-muted-foreground">Cargando panel...</div>;
  }

  if (!isAuthenticated || user?.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-foreground text-primary-foreground transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 h-16 px-5 border-b border-primary-foreground/10">
          <div className="bg-white rounded px-2 py-1">
            <img src={logo} alt="Textil Salas" className="h-7 w-auto" />
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-body text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5"}`}
              >
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 rounded-md font-body text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
            <ArrowLeft size={14} /> Volver a la tienda
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-background border-b border-border flex items-center px-6 gap-4">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <h2 className="font-display text-xl text-foreground">Panel Administrativo</h2>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
