import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-textil-salas.png";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Enlace inválido", description: "No se encontró token de recuperación.", variant: "destructive" });
      return;
    }
    if (!password || password.length < 6) {
      toast({ title: "Contraseña inválida", description: "La nueva contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "No coincide", description: "La confirmación de contraseña no coincide.", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const response = await authService.resetPassword({ token, newPassword: password });
      toast({ title: "Contraseña actualizada", description: response.message });
      navigate("/login");
    } catch (error) {
      toast({ title: "No se pudo actualizar", description: error instanceof Error ? error.message : "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-elevated p-8">
        <div className="flex flex-col items-center mb-8">
          <Link to="/"><img src={logo} alt="Textil Salas" className="h-14 mb-4" /></Link>
          <h1 className="font-display text-3xl text-foreground">Nueva Contraseña</h1>
          <p className="font-body text-sm text-muted-foreground mt-2 text-center">Ingresa tu nueva contraseña para recuperar el acceso.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label>Nueva contraseña</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="space-y-2"><Label>Confirmar contraseña</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
          <Button className="w-full font-body uppercase tracking-wide" disabled={submitting}>{submitting ? "Actualizando..." : "Actualizar contraseña"}</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
