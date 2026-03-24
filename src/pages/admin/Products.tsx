import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import type { Category } from "@/types/category";
import type { CreateProductDto, Product, UpdateProductDto } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const emptyForm: CreateProductDto = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  material: "",
  isFeatured: false,
  categoryId: 0,
};

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductDto>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const [productData, categoryData] = await Promise.all([productService.getAll(), categoryService.getAll()]);
    setProducts(productData);
    setCategories(categoryData.filter((c) => c.isActive));
  };

  useEffect(() => {
    load().catch(() => toast({ title: "Error", description: "No se pudo cargar productos.", variant: "destructive" }));
  }, []);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      material: product.material,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.material || !form.categoryId) {
      toast({ title: "Datos incompletos", description: "Completa nombre, material y categoría.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      if (editing) {
        const payload: UpdateProductDto = { ...form, isActive: editing.isActive };
        await productService.update(editing.id, payload);
        toast({ title: "Producto actualizado", description: `${form.name} se actualizó correctamente.` });
      } else {
        await productService.create(form);
        toast({ title: "Producto creado", description: `${form.name} se creó correctamente.` });
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
      await load();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo guardar el producto.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`¿Eliminar ${product.name}?`)) return;
    try {
      await productService.delete(product.id);
      toast({ title: "Producto eliminado", description: `${product.name} fue eliminado.` });
      await load();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo eliminar el producto.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Productos</h1>
        <Button className="font-body text-sm gap-2" onClick={openCreate}><Plus size={16} /> Agregar Producto</Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar producto..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-background rounded-lg shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Producto</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Categoría</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Precio</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Stock</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
              <th className="text-right px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3 font-body text-sm font-medium text-foreground">{p.name}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{p.categoryName}</td>
                <td className="px-5 py-3 font-body text-sm text-foreground tabular-nums">S/ {p.price.toFixed(2)}</td>
                <td className="px-5 py-3 font-body text-sm tabular-nums">{p.stock}</td>
                <td className="px-5 py-3 font-body text-sm"><span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{p.isActive ? "Activo" : "Inactivo"}</span></td>
                <td className="px-5 py-3 text-right space-x-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                  <button className="p-2 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="font-body text-sm">Nombre del producto</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label className="font-body text-sm">Categoría</Label><Select value={form.categoryId ? String(form.categoryId) : undefined} onValueChange={(value) => setForm({ ...form, categoryId: Number(value) })}><SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label className="font-body text-sm">Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label className="font-body text-sm">Precio (S/)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label className="font-body text-sm">Stock disponible</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label className="font-body text-sm">Material</Label><Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="font-body text-sm">Imagen URL</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <Label className="font-body text-sm font-medium">Producto destacado</Label>
                <p className="font-body text-xs text-muted-foreground">Se mostrará en destacados del inicio</p>
              </div>
              <Switch checked={form.isFeatured} onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked })} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
