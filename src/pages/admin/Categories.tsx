import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoryService } from "@/services/categoryService";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "@/types/category";
import { useToast } from "@/hooks/use-toast";

const AdminCategories = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => setCategories(await categoryService.getAll());

  useEffect(() => {
    load().catch(() => toast({ title: "Error", description: "No se pudieron cargar las categorías.", variant: "destructive" }));
  }, []);

  const filtered = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())), [categories, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowForm(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Nombre requerido", description: "Ingresa un nombre para la categoría.", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      if (editing) {
        const payload: UpdateCategoryDto = { ...form, isActive: editing.isActive };
        await categoryService.update(editing.id, payload);
        toast({ title: "Categoría actualizada", description: `${form.name} fue actualizada.` });
      } else {
        await categoryService.create(form);
        toast({ title: "Categoría creada", description: `${form.name} fue creada.` });
      }
      setShowForm(false);
      await load();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo guardar la categoría.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`¿Eliminar ${category.name}?`)) return;
    try {
      await categoryService.delete(category.id);
      toast({ title: "Categoría eliminada", description: `${category.name} fue eliminada.` });
      await load();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo eliminar la categoría.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground">Categorías</h1>
        <Button className="font-body text-sm gap-2" onClick={openCreate}><Plus size={16} /> Agregar Categoría</Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar categoría..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-background rounded-lg shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Nombre</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Descripción</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
              <th className="text-right px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((category) => (
              <tr key={category.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3 font-body text-sm font-medium text-foreground">{category.name}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{category.description}</td>
                <td className="px-5 py-3 font-body text-sm"><span className={`px-2 py-1 rounded-full text-xs ${category.isActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{category.isActive ? "Activa" : "Inactiva"}</span></td>
                <td className="px-5 py-3 text-right space-x-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground" onClick={() => openEdit(category)}><Pencil size={14} /></button>
                  <button className="p-2 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(category)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing ? "Editar Categoría" : "Agregar Categoría"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-2"><Label className="font-body text-sm">Nombre</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label className="font-body text-sm">Descripción</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : editing ? "Guardar cambios" : "Crear categoría"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
