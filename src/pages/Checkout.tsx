import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Landmark, Wallet, ShieldCheck, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";

const STORE_ADDRESS = "Jr. el Inca Nro. 1113";

const splitName = (fullName?: string) => {
  const parts = (fullName || "").split(" ").filter(Boolean);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
};

const Checkout = () => {
  const [payment, setPayment] = useState<"card" | "transfer" | "cash">("card");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
  const [submitting, setSubmitting] = useState(false);
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { firstName, lastName } = splitName(user?.fullName);
  const [form, setForm] = useState({
    firstName,
    lastName,
    address: "",
    district: "",
    city: "",
    phone: user?.phoneNumber || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: lastName || prev.lastName,
      phone: user?.phoneNumber || prev.phone,
      email: user?.email || prev.email,
    }));
  }, [firstName, lastName, user?.phoneNumber, user?.email]);

  const shipping = deliveryType === "pickup" || subtotal <= 0 ? 0 : 15;
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para completar la compra.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!items.length) {
      toast({ title: "Carrito vacío", description: "Agrega productos antes de continuar.", variant: "destructive" });
      return;
    }
    if (!form.firstName || !form.lastName || !form.phone || !form.email) {
      toast({ title: "Completa tus datos", description: "Nombre, apellido, correo y teléfono son obligatorios.", variant: "destructive" });
      return;
    }
    if (deliveryType === "delivery" && (!form.address || !form.district || !form.city)) {
      toast({ title: "Completa el envío", description: "Ingresa dirección, distrito y ciudad para delivery.", variant: "destructive" });
      return;
    }

    if (payment === "card") {
      toast({ title: "Pasarela Culqi", description: "La estructura quedó preparada. Falta configurar tus llaves de Culqi para cobrar en vivo.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const order = await orderService.create({
        items: items.map((item) => ({ productId: item.id, quantity: item.qty })),
        customerFullName: `${form.firstName} ${form.lastName}`.trim(),
        customerEmail: form.email,
        customerPhoneNumber: form.phone,
        shippingAddress: deliveryType === "pickup" ? STORE_ADDRESS : form.address,
        shippingDistrict: deliveryType === "pickup" ? "Cercado" : form.district,
        shippingCity: deliveryType === "pickup" ? "Lima" : form.city,
        deliveryType,
        paymentMethod: payment,
        shippingCost: shipping,
      });
      clearCart();
      toast({ title: "¡Pedido creado!", description: `Pedido #${order.id} registrado correctamente.` });
      navigate("/confirmacion");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo crear el pedido", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const paymentOptions = [
    { id: "card", label: "Tarjeta / Culqi", icon: CreditCard, help: "Preparado para Culqi (Visa, Mastercard, Yape, Plin)." },
    { id: "transfer", label: "Transferencia", icon: Landmark, help: "Confirma el pedido y coordina el pago con el asesor." },
    { id: "cash", label: "Efectivo / Contraentrega", icon: Wallet, help: "Válido para recojo en tienda o entregas coordinadas." },
  ] as const;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-4xl text-foreground mb-10">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-background rounded-lg shadow-card p-6">
                <h2 className="font-display text-2xl text-foreground mb-6">Datos de Envío</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Juan" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} readOnly={isAuthenticated} className={isAuthenticated ? "bg-secondary" : ""} /></div>
                  <div className="space-y-2"><Label>Apellido</Label><Input placeholder="Pérez" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} readOnly={isAuthenticated} className={isAuthenticated ? "bg-secondary" : ""} /></div>
                  <div className="space-y-2"><Label>Teléfono</Label><Input placeholder="999384593" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} readOnly={isAuthenticated} className={isAuthenticated ? "bg-secondary" : ""} /></div>
                  <div className="space-y-2"><Label>Correo</Label><Input placeholder="cliente@correo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} readOnly={isAuthenticated} className={isAuthenticated ? "bg-secondary" : ""} /></div>
                </div>

                <div className="mt-6 space-y-3">
                  <Label>Tipo de entrega</Label>
                  <RadioGroup value={deliveryType} onValueChange={(value) => setDeliveryType(value as "pickup" | "delivery")} className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryType === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Store size={18} className="text-primary" />
                      <div><span className="font-body text-sm text-foreground block">Recoger en tienda</span><span className="font-body text-xs text-muted-foreground">Jr. el Inca Nro. 1113 · envío S/ 0</span></div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${deliveryType === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Truck size={18} className="text-primary" />
                      <div><span className="font-body text-sm text-foreground block">Delivery</span><span className="font-body text-xs text-muted-foreground">Envío a domicilio S/ 15.00</span></div>
                    </label>
                  </RadioGroup>
                </div>

                {deliveryType === "pickup" ? (
                  <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="font-body text-sm font-medium text-foreground">Recojo en tienda</p>
                    <p className="font-body text-sm text-muted-foreground">Tu pedido estará disponible en: <span className="font-medium text-foreground">{STORE_ADDRESS}</span></p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2"><Label>Dirección</Label><Input placeholder="Av. Javier Prado 1234" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Distrito</Label><Input placeholder="San Isidro" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Ciudad</Label><Input placeholder="Lima" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  </div>
                )}
              </div>

              <div className="bg-background rounded-lg shadow-card p-6">
                <h2 className="font-display text-2xl text-foreground mb-6">Método de Pago</h2>
                <RadioGroup value={payment} onValueChange={(value) => setPayment(value as "card" | "transfer" | "cash")} className="space-y-4">
                  {paymentOptions.map((m) => (
                    <label key={m.id} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${payment === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <RadioGroupItem value={m.id} id={m.id} />
                      <m.icon size={18} className="text-primary" />
                      <div>
                        <span className="font-body text-sm text-foreground block">{m.label}</span>
                        <span className="font-body text-xs text-muted-foreground">{m.help}</span>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
                <div className="mt-6 rounded-md bg-secondary p-4 flex items-start gap-3 text-sm text-muted-foreground"><ShieldCheck size={18} className="text-primary mt-0.5" />La venta queda registrada en la base de datos. Para activar cobro real con tarjeta, solo falta configurar tus llaves de Culqi.</div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg shadow-card p-6 sticky top-28">
                <h3 className="font-display text-xl text-foreground mb-5">Resumen</h3>
                <div className="space-y-3 font-body text-sm">
                  {items.map((item) => <div key={`${item.id}-${item.size}`} className="flex justify-between gap-4"><span className="text-muted-foreground">{item.name} × {item.qty}</span><span className="tabular-nums">S/ {(item.price * item.qty).toFixed(2)}</span></div>)}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">S/ {subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Envío</span><span className="tabular-nums">S/ {shipping.toFixed(2)}</span></div>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-medium text-base"><span>Total</span><span className="tabular-nums">S/ {total.toFixed(2)}</span></div>
                </div>
                <Button className="w-full mt-6 py-5 font-body uppercase tracking-wide" onClick={handleConfirm} disabled={submitting}>{submitting ? "Procesando..." : payment === "card" ? "Continuar a Culqi" : "Confirmar Compra"}</Button>
                <Link to="/carrito" className="block text-center mt-3 font-body text-xs text-primary hover:underline">Volver al carrito</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
