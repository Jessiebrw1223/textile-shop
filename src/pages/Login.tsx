import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-textil-salas.png";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Ingresa tus credenciales", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const profile = await login({ email, password });
      toast({ title: "¡Bienvenido!", description: "Tu sesión fue iniciada correctamente." });
      navigate(profile.role === "Admin" ? "/admin" : "/perfil");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo iniciar sesión", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-elevated p-8">
        <div className="flex flex-col items-center mb-8">
          <Link to="/"><img src={logo} alt="Textil Salas" className="h-14 mb-4" /></Link>
          <h1 className="font-display text-3xl text-foreground">Iniciar Sesión</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Accede a tu cuenta</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label htmlFor="email" className="font-body">Correo electrónico</Label><Input id="email" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="password" className="font-body">Contraseña</Label><div className="relative"><Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <div className="flex justify-end"><Link to="/recuperar-password" className="font-body text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</Link></div>
          <Button type="submit" className="w-full font-body uppercase tracking-wide" disabled={submitting}>{submitting ? "Ingresando..." : "Ingresar"}</Button>
        </form>
        <p className="font-body text-sm text-center text-muted-foreground mt-6">¿No tienes cuenta? <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate</Link></p>
        <div className="mt-6 p-4 bg-secondary rounded-md"><p className="font-body text-xs text-muted-foreground text-center"><strong className="text-foreground">Acceso Admin:</strong> admin@textileoasis.com / Admin123*</p></div>
      </div>
    </div>
  );
};

export default Login;
