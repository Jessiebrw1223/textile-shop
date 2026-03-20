import { useEffect, useState } from "react";
import { User, Package, MapPin, LogOut, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";

const tabs = [
  { id: "profile", label: "Mi Perfil", icon: User },
  { id: "orders", label: "Mis Pedidos", icon: Package },
  { id: "addresses", label: "Direcciones", icon: MapPin },
];

const statusColor: Record<string, string> = {
  Pending: "bg-gold-light/20 text-gold-dark",
  Enviado: "bg-accent/10 text-accent",
  Entregado: "bg-accent/20 text-accent",
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { user, logout, isAuthenticated, refreshProfile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTab !== "orders" || !isAuthenticated) return;
    setLoadingOrders(true);
    orderService.getMyOrders().then(setOrders).finally(() => setLoadingOrders(false));
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || (!isAuthenticated && !user)) {
    return <div className="min-h-screen bg-background pt-24 text-center font-body text-muted-foreground">Cargando perfil...</div>;
  }

  if (!user) return null;

  const [nombre, ...rest] = user.fullName.split(" ");
  const apellido = rest.join(" ");
  const isAdmin = user.role === "Admin";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-4xl text-foreground mb-10">Mi Cuenta</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-lg shadow-card p-4 h-fit">
              <div className="px-4 py-3 mb-2">
                <p className="font-display text-lg text-foreground">{user.fullName}</p>
                <p className="font-body text-xs text-muted-foreground">{user.email}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full font-body text-[10px] uppercase tracking-wide ${isAdmin ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{isAdmin ? "Administrador" : "Cliente"}</span>
              </div>
              <div className="space-y-1">
                {tabs.map((t) => <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm transition-colors ${activeTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}><t.icon size={16} /> {t.label}</button>)}
                {isAdmin && <Link to="/admin" className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-muted-foreground hover:bg-secondary transition-colors"><Building2 size={16} /> Panel Admin</Link>}
                <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-body text-sm text-destructive hover:bg-destructive/5 transition-colors"><LogOut size={16} /> Cerrar Sesión</button>
              </div>
            </div>
            <div className="lg:col-span-3">
              {activeTab === "profile" && <div className="bg-card rounded-lg shadow-card p-6"><h2 className="font-display text-2xl text-foreground mb-6">Información Personal</h2><form className="space-y-4 max-w-lg"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label className="font-body">Nombre</Label><Input defaultValue={nombre} /></div><div className="space-y-2"><Label className="font-body">Apellido</Label><Input defaultValue={apellido} /></div></div><div className="space-y-2"><Label className="font-body">Correo</Label><Input defaultValue={user.email} type="email" /></div><div className="space-y-2"><Label className="font-body">Teléfono</Label><Input defaultValue={user.phoneNumber} /></div><div className="space-y-2"><Label className="font-body">Rol</Label><Input defaultValue={user.role} disabled className="bg-secondary" /></div><Button type="button" className="font-body uppercase tracking-wide">Guardar Cambios</Button></form></div>}
              {activeTab === "orders" && <div className="space-y-4"><h2 className="font-display text-2xl text-foreground mb-2">Historial de Pedidos</h2>{loadingOrders ? <div className="font-body text-muted-foreground">Cargando pedidos...</div> : orders.length === 0 ? <div className="bg-card rounded-lg shadow-card p-5 font-body text-muted-foreground">Aún no tienes pedidos registrados.</div> : orders.map((o) => <div key={o.id} className="bg-card rounded-lg shadow-card p-5 flex items-center justify-between"><div><p className="font-body text-sm font-medium text-foreground">TS-{o.id.toString().padStart(4, "0")}</p><p className="font-body text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} productos</p></div><div className="flex items-center gap-4"><span className={`px-3 py-1 rounded-full font-body text-xs ${statusColor[o.status] || "bg-secondary text-muted-foreground"}`}>{o.status}</span><span className="font-body text-sm font-medium tabular-nums">S/ {o.total.toFixed(2)}</span></div></div>)}</div>}
              {activeTab === "addresses" && <div className="bg-card rounded-lg shadow-card p-6"><h2 className="font-display text-2xl text-foreground mb-6">Mis Direcciones</h2><div className="border border-border rounded-md p-4 mb-4"><p className="font-body text-sm font-medium text-foreground">Casa</p><p className="font-body text-sm text-muted-foreground">Av. Javier Prado 1234, San Isidro, Lima</p></div><Button variant="outline" className="font-body text-sm">+ Agregar Dirección</Button></div>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
