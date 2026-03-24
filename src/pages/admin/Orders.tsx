import { useEffect, useMemo, useState } from "react";
import { Search, Eye, MapPin, Package, Phone, Truck, Store, Mail, WalletCards } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types/order";
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  Pending: "bg-gold-light/20 text-gold-dark",
  Pendiente: "bg-gold-light/20 text-gold-dark",
  Enviado: "bg-accent/10 text-accent",
  Entregado: "bg-accent/20 text-accent",
};

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    orderService.getAllAdmin().then(setOrders).catch((error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudieron cargar los pedidos.", variant: "destructive" });
    });
  }, []);

  const filtered = useMemo(
    () => orders.filter((o) => String(o.id).includes(search) || o.status.toLowerCase().includes(search.toLowerCase()) || o.customerFullName.toLowerCase().includes(search.toLowerCase())),
    [orders, search]
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-foreground">Pedidos</h1>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar pedido..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="bg-background rounded-lg shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Pedido</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Cliente</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Fecha</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Items</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Total</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Entrega</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
              <th className="text-right px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3 font-body text-sm font-medium text-foreground">TS-{o.id.toString().padStart(4, "0")}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{o.customerFullName}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground tabular-nums">{o.items.length}</td>
                <td className="px-5 py-3 font-body text-sm text-foreground tabular-nums">S/ {o.total.toFixed(2)}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{o.deliveryType === "pickup" ? "Recojo" : "Delivery"}</td>
                <td className="px-5 py-3"><span className={`px-3 py-1 rounded-full font-body text-xs ${statusColor[o.status] || "bg-secondary text-muted-foreground"}`}>{o.status}</span></td>
                <td className="px-5 py-3 text-right"><button onClick={() => setSelectedOrder(o)} className="p-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors" title="Ver detalle"><Eye size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Detalle del Pedido {selectedOrder ? `TS-${selectedOrder.id.toString().padStart(4, "0")}` : ""}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <p className="font-body text-xs uppercase tracking-wide text-muted-foreground">Cliente</p>
                  <p className="font-display text-lg text-foreground">{selectedOrder.customerFullName}</p>
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-2"><Mail size={14} /> {selectedOrder.customerEmail}</p>
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-2"><Phone size={14} /> {selectedOrder.customerPhoneNumber}</p>
                </div>
                <div className="rounded-lg border border-border p-4 space-y-2">
                  <p className="font-body text-xs uppercase tracking-wide text-muted-foreground">Entrega y pago</p>
                  <p className="font-body text-sm text-foreground flex items-center gap-2">{selectedOrder.deliveryType === "pickup" ? <Store size={14} className="text-primary" /> : <Truck size={14} className="text-primary" />} {selectedOrder.deliveryType === "pickup" ? "Recojo en tienda" : "Delivery"}</p>
                  <p className="font-body text-sm text-muted-foreground flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> {selectedOrder.shippingAddress}, {selectedOrder.shippingDistrict}, {selectedOrder.shippingCity}</p>
                  <p className="font-body text-sm text-muted-foreground flex items-center gap-2"><WalletCards size={14} /> {selectedOrder.paymentMethod} · {selectedOrder.paymentStatus}</p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-body text-sm text-muted-foreground">Fecha</p>
                  <p className="font-display text-lg text-foreground">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-body text-sm ${statusColor[selectedOrder.status] || "bg-secondary text-muted-foreground"}`}>{selectedOrder.status}</span>
              </div>
              <div>
                <h3 className="font-display text-sm text-foreground flex items-center gap-2 mb-3"><Package size={14} className="text-primary" /> Productos del Pedido</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border">
                        <th className="text-left px-4 py-2 font-body text-xs uppercase text-muted-foreground">Producto</th>
                        <th className="text-center px-4 py-2 font-body text-xs uppercase text-muted-foreground">Cant.</th>
                        <th className="text-right px-4 py-2 font-body text-xs uppercase text-muted-foreground">Precio</th>
                        <th className="text-right px-4 py-2 font-body text-xs uppercase text-muted-foreground">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={`${item.productId}-${item.productName}`} className="border-b border-border last:border-0">
                          <td className="px-4 py-2 font-body text-sm text-foreground">{item.productName}</td>
                          <td className="px-4 py-2 font-body text-sm text-center text-muted-foreground tabular-nums">{item.quantity}</td>
                          <td className="px-4 py-2 font-body text-sm text-right text-muted-foreground tabular-nums">S/ {item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 font-body text-sm text-right text-foreground tabular-nums">S/ {item.subTotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-secondary/20 border-t border-border">
                        <td colSpan={3} className="px-4 py-2 text-right font-body text-sm text-muted-foreground">Envío</td>
                        <td className="px-4 py-2 text-right font-body text-sm text-foreground tabular-nums">S/ {selectedOrder.shippingCost.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-body font-medium text-foreground">Total</td>
                        <td className="px-4 py-2 text-right font-body font-medium text-foreground tabular-nums">S/ {selectedOrder.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
