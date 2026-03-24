import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-textil-salas.png";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !email || !password) {
      toast({ title: "Error", description: "Completa todos los campos obligatorios", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      await register({ fullName: `${nombre} ${apellido}`.trim(), email, password, phoneNumber: telefono });
      toast({ title: "¡Cuenta creada!", description: `Bienvenido/a ${nombre}` });
      navigate("/perfil");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "No se pudo registrar la cuenta", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-background rounded-lg shadow-elevated p-8">
        <div className="flex flex-col items-center mb-8">
          <Link to="/"><img src={logo} alt="Textil Salas" className="h-14 mb-4" /></Link>
          <h1 className="font-display text-3xl text-foreground">Crear Cuenta</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">Únete a Textil Salas</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="font-body">Nombre</Label><Input placeholder="Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
            <div className="space-y-2"><Label className="font-body">Apellido</Label><Input placeholder="Pérez" value={apellido} onChange={(e) => setApellido(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label className="font-body">Correo electrónico</Label><Input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><Label className="font-body">Teléfono</Label><Input type="tel" placeholder="+51 999 999 999" value={telefono} onChange={(e) => setTelefono(e.target.value)} /></div>
          <div className="space-y-2"><Label className="font-body">Contraseña</Label><div className="relative"><Input type={showPass ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
          <Button type="submit" className="w-full font-body uppercase tracking-wide" disabled={submitting}>{submitting ? "Creando cuenta..." : "Crear Cuenta"}</Button>
        </form>
        <p className="font-body text-sm text-center text-muted-foreground mt-6">¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default Register;
