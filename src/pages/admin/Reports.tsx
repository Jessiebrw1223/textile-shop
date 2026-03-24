import { DollarSign, ShoppingBag, TrendingUp, TrendingDown, Package, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const monthlyData = [
  { month: "Oct", ventas: 32000, pedidos: 112 },
  { month: "Nov", ventas: 38000, pedidos: 134 },
  { month: "Dic", ventas: 52000, pedidos: 189 },
  { month: "Ene", ventas: 41000, pedidos: 148 },
  { month: "Feb", ventas: 39000, pedidos: 131 },
  { month: "Mar", ventas: 45230, pedidos: 156 },
];

const topProducts = [
  { name: "Toalla de Baño Premium", sold: 234, revenue: "S/ 20,826", growth: 12.3 },
  { name: "Set Spa Luxury", sold: 89, revenue: "S/ 21,805", growth: 8.7 },
  { name: "Bata Spa Deluxe", sold: 67, revenue: "S/ 12,663", growth: -2.1 },
  { name: "Toalla Facial Suave", sold: 312, revenue: "S/ 10,920", growth: 15.4 },
];

const categoryData = [
  { name: "Toallas", value: 45 },
  { name: "Batas", value: 28 },
  { name: "Sets Spa", value: 18 },
  { name: "Accesorios", value: 9 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const current = payload[0].value;
    const idx = monthlyData.findIndex((d) => d.month === label);
    const prev = idx > 0 ? monthlyData[idx - 1].ventas : current;
    const change = ((current - prev) / prev * 100).toFixed(1);
    const isUp = current >= prev;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-display text-sm text-foreground mb-1">{label}</p>
        <p className="font-body text-sm text-foreground tabular-nums">S/ {current.toLocaleString()}</p>
        <p className={`font-body text-xs mt-1 flex items-center gap-1 ${isUp ? "text-accent" : "text-destructive"}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? "+" : ""}{change}% vs mes anterior
        </p>
      </div>
    );
  }
  return null;
};

const AdminReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Reportes de Ventas</h1>
        <span className="font-body text-sm text-muted-foreground">Últimos 6 meses</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Ventas Totales", value: "S/ 247,230", change: "+18.2%", up: true, icon: DollarSign },
          { label: "Pedidos Totales", value: "870", change: "+12.5%", up: true, icon: ShoppingBag },
          { label: "Ticket Promedio", value: "S/ 284.17", change: "+5.1%", up: true, icon: TrendingUp },
          { label: "Productos Vendidos", value: "702", change: "+9.8%", up: true, icon: Package },
        ].map((s) => (
          <div key={s.label} className="bg-background rounded-lg shadow-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wide">{s.label}</span>
              <div className="p-2 rounded-lg bg-primary/10">
                <s.icon size={16} className="text-primary" />
              </div>
            </div>
            <p className="font-display text-2xl text-foreground tabular-nums">{s.value}</p>
            <p className={`font-body text-xs mt-1 ${s.up ? "text-accent" : "text-destructive"}`}>
              {s.up ? "↑" : "↓"} {s.change} vs periodo anterior
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-background rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-foreground">Ventas Mensuales</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="font-body text-xs text-muted-foreground">Crecimiento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive/70" />
              <span className="font-body text-xs text-muted-foreground">Baja</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
              <Bar dataKey="ventas" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {monthlyData.map((entry, index) => {
                  const prev = index > 0 ? monthlyData[index - 1].ventas : entry.ventas;
                  const isUp = entry.ventas >= prev;
                  return <Cell key={index} fill={isUp ? "hsl(var(--primary))" : "hsl(var(--destructive) / 0.7)"} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-background rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-xl text-foreground">Productos Más Vendidos</h2>
          </div>
          <div className="p-5 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="font-display text-lg text-muted-foreground w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{p.sold} unidades vendidas</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm text-foreground tabular-nums">{p.revenue}</p>
                  <p className={`font-body text-xs ${p.growth >= 0 ? "text-accent" : "text-destructive"}`}>
                    {p.growth >= 0 ? "+" : ""}{p.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="bg-background rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-xl text-foreground">Ventas por Categoría</h2>
          </div>
          <div className="p-5 space-y-4">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-sm text-foreground">{c.name}</span>
                  <span className="font-body text-sm text-muted-foreground tabular-nums">{c.value}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
