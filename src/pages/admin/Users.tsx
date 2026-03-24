import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";
import type { UserListItem } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserListItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    authService.getAll().then(setUsers).catch((error) => {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudieron cargar los usuarios.", variant: "destructive" });
    });
  }, []);

  const filtered = useMemo(
    () => users.filter((u) => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-foreground">Usuarios</h1>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar usuario..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="bg-background rounded-lg shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Nombre</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Email</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Rol</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Teléfono</th>
              <th className="text-left px-5 py-3 font-body text-xs uppercase tracking-wide text-muted-foreground">Registro</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3 font-body text-sm font-medium text-foreground">{u.fullName}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded font-body text-xs ${u.role === "Admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{u.role}</span></td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{u.phoneNumber || "-"}</td>
                <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
