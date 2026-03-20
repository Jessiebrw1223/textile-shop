import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="font-display text-4xl text-foreground mb-10">Carrito de compras</h1>
          {items.length === 0 ? (
            <div className="text-center py-20"><ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" /><p className="font-body text-muted-foreground mb-4">Tu carrito está vacío</p><Link to="/catalogo"><Button className="font-body uppercase tracking-wide">Ver catálogo</Button></Link></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-card rounded-lg shadow-card">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-1"><h3 className="font-display text-lg text-foreground">{item.name}</h3><p className="font-body text-xs text-muted-foreground">{item.material} · {item.size}</p><div className="flex items-center justify-between mt-3"><div className="inline-flex items-center border border-border rounded-md"><button onClick={() => updateQty(item.id, item.size, -1)} className="p-1.5 text-muted-foreground"><Minus size={14} /></button><span className="px-3 font-body text-sm tabular-nums">{item.qty}</span><button onClick={() => updateQty(item.id, item.size, 1)} className="p-1.5 text-muted-foreground"><Plus size={14} /></button></div><span className="font-body font-medium tabular-nums">S/ {(item.price * item.qty).toFixed(2)}</span></div></div>
                    <button onClick={() => removeItem(item.id, item.size)} className="text-muted-foreground hover:text-destructive self-start p-1"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="bg-card rounded-lg shadow-card p-6 h-fit"><h3 className="font-display text-xl text-foreground mb-6">Resumen del pedido</h3><div className="space-y-3 font-body text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">S/ {subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span className="text-primary text-xs">Calculado en checkout</span></div><div className="border-t border-border pt-3 flex justify-between font-medium text-base"><span>Total</span><span className="tabular-nums">S/ {subtotal.toFixed(2)}</span></div></div><Link to="/checkout"><Button className="w-full mt-6 font-body uppercase tracking-wide">Continuar compra</Button></Link></div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
