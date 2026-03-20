import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-textil-salas.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Correo requerido", description: "Ingresa tu correo para recuperar la contraseña.", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const response = await authService.forgotPassword({ email });
      toast({ title: "Solicitud enviada", description: response.message });
      setEmail("");
    } catch (error) {
      toast({ title: "No se pudo enviar", description: error instanceof Error ? error.message : "Configura SMTP con Gmail para enviar correos reales.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-elevated p-8">
        <div className="flex flex-col items-center mb-8">
          <Link to="/"><img src={logo} alt="Textil Salas" className="h-14 mb-4" /></Link>
          <h1 className="font-display text-3xl text-foreground">Recuperar Contraseña</h1>
          <p className="font-body text-sm text-muted-foreground mt-2 text-center">Ingresa tu correo y te enviaremos un enlace de recuperación.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="font-body">Correo electrónico</Label>
            <Input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button className="w-full font-body uppercase tracking-wide" disabled={submitting}>{submitting ? "Enviando..." : "Enviar Instrucciones"}</Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="font-body text-sm text-primary hover:underline inline-flex items-center gap-1"><ArrowLeft size={14} /> Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
