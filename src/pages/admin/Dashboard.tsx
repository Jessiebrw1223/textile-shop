import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Clock, CheckCircle, AlertTriangle, Truck } from "lucide-react";

const stats = [
  { label: "Ventas del Mes", value: "S/ 45,230", change: "+12.5%", up: true, icon: DollarSign, color: "bg-primary/10 text-primary" },
  { label: "Pedidos Activos", value: "42", change: "+8.2%", up: true, icon: ShoppingBag, color: "bg-accent/10 text-accent" },
  { label: "Productos en Stock", value: "48", change: "+3", up: true, icon: Package, color: "bg-gold-light/20 text-gold-dark" },
  { label: "Clientes Nuevos", value: "34", change: "-2.1%", up: false, icon: Users, color: "bg-destructive/10 text-destructive" },
];

const recentOrders = [
  { id: "TS-0342", client: "Juan Pérez", type: "B2C", date: "12 Mar", total: "S/ 333.00", status: "Enviado" },
  { id: "TS-0341", client: "Hotel Lima Premium", type: "B2B", date: "12 Mar", total: "S/ 2,450.00", status: "Procesando" },
  { id: "TS-0340", client: "María García", type: "B2C", date: "11 Mar", total: "S/ 89.00", status: "Entregado" },
  { id: "TS-0339", client: "Spa Wellness Center", type: "B2B", date: "11 Mar", total: "S/ 1,200.00", status: "Pendiente" },
  { id: "TS-0338", client: "Carlos López", type: "B2C", date: "10 Mar", total: "S/ 178.00", status: "Entregado" },
];

const statusColor: Record<string, string> = {
  Pendiente: "bg-gold-light/20 text-gold-dark",
  Procesando: "bg-primary/10 text-primary",
  Enviado: "bg-accent/10 text-accent",
  Entregado: "bg-accent/20 text-accent",
};

const statusIcon: Record<string, any> = {
  Pendiente: Clock,
  Procesando: AlertTriangle,
  Enviado: Truck,
  Entregado: CheckCircle,
};

const orderStatusSummary = [
  { label: "Pendientes", count: 8, color: "text-gold-dark", bg: "bg-gold-light/20" },
  { label: "Procesando", count: 12, color: "text-primary", bg: "bg-primary/10" },
  { label: "Enviados", count: 15, color: "text-accent", bg: "bg-accent/10" },
  { label: "Entregados", count: 121, color: "text-accent", bg: "bg-accent/20" },
];

const topClients = [
  { name: "Hotel Lima Premium", orders: 24, total: "S/ 32,400" },
  { name: "Spa Wellness Center", orders: 18, total: "S/ 21,600" },
  { name: "Gimnasio FitLife", orders: 12, total: "S/ 8,400" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Resumen general del negocio • Marzo 2026</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background rounded-lg shadow-card p-5 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.color}`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="font-display text-2xl text-foreground tabular-nums">{s.value}</p>
            <div className={`flex items-center gap-1 mt-1 font-body text-xs ${s.up ? "text-accent" : "text-destructive"}`}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.change} vs mes anterior
            </div>
          </div>
        ))}
      </div>

      {/* Order Status + Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-background rounded-lg shadow-card p-5 border border-border/50">
          <h2 className="font-display text-lg text-foreground mb-4">Estado de Pedidos</h2>
          <div className="space-y-3">
            {orderStatusSummary.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="font-body text-sm text-foreground">{s.label}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-body text-xs font-medium ${s.bg} ${s.color}`}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-background rounded-lg shadow-card p-5 border border-border/50">
          <h2 className="font-display text-lg text-foreground mb-4">Principales Clientes B2B</h2>
          <div className="space-y-3">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                <span className="font-display text-lg text-primary w-6">{i + 1}</span>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-foreground">{c.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{c.orders} pedidos realizados</p>
                </div>
                <span className="font-body text-sm text-foreground tabular-nums">{c.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-background rounded-lg shadow-card border border-border/50">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground">Pedidos Recientes</h2>
          <span className="font-body text-xs text-muted-foreground">Últimos 5 pedidos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Pedido</th>
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Cliente</th>
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Tipo</th>
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Fecha</th>
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Total</th>
                <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
                const Icon = statusIcon[o.status] || Clock;
                return (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-5 py-3 font-body text-sm font-medium text-foreground">{o.id}</td>
                    <td className="px-5 py-3 font-body text-sm text-muted-foreground">{o.client}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded font-body text-xs ${o.type === "B2B" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{o.type}</span>
                    </td>
                    <td className="px-5 py-3 font-body text-sm text-muted-foreground">{o.date}</td>
                    <td className="px-5 py-3 font-body text-sm text-foreground tabular-nums">{o.total}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs ${statusColor[o.status] || ""}`}>
                        <Icon size={12} />
                        {o.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
