"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Check, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RedefinirSenhaPage() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  // Simular validação do token
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setTokenValid(false);
      setError("Link inválido ou expirado");
    }
    // Em produção, aqui validaria o token com a API
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Limpar erro ao digitar
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return "Fraca";
      case 2:
        return "Média";
      case 3:
        return "Forte";
      case 4:
        return "Muito Forte";
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações
    if (formData.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (passwordStrength(formData.password) < 2) {
      setError("Escolha uma senha mais forte");
      setIsLoading(false);
      return;
    }

    try {
      // Simular redefinição de senha
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Em produção, aqui faria a chamada para a API
      console.log("Senha redefinida com sucesso");

      setSuccess(true);
    } catch (err) {
      setError("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const strength = passwordStrength(formData.password);

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                  GlobalPrint
                </h1>
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Link Inválido
              </CardTitle>
              <CardDescription>
                Este link de recuperação é inválido ou já expirou
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O link pode ter expirado ou já foi utilizado. Solicite um novo
                  link de recuperação.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link href="/recuperar-senha">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Solicitar Novo Link
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-300 hover:bg-gray-50"
                  >
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mb-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                  GlobalPrint
                </h1>
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Senha Redefinida!
              </CardTitle>
              <CardDescription>
                Sua senha foi alterada com sucesso
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Pronto!</strong> Sua senha foi redefinida com sucesso.
                  Agora você pode fazer login com sua nova senha.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Fazer Login
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-300 hover:bg-gray-50"
                  >
                    Ir para o Catálogo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Link>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="mb-4">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                GlobalPrint
              </h1>
            </div>
            <CardTitle className="text-2xl text-gray-900">Nova Senha</CardTitle>
            <CardDescription>
              Crie uma nova senha segura para sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha forte"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="h-12 pr-12 border-gray-300 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-blue-50"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${
                            level <= strength
                              ? getPasswordStrengthColor(strength)
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Força da senha: {getPasswordStrengthText(strength)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    className="h-12 pr-12 border-gray-300 focus:border-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12 hover:bg-blue-50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-600">
                      As senhas não coincidem
                    </p>
                  )}

                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Senhas coincidem
                    </p>
                  )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 text-sm mb-2">
                  Dicas para uma senha segura:
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Pelo menos 8 caracteres</li>
                  <li>• Combine letras maiúsculas e minúsculas</li>
                  <li>• Inclua números e símbolos</li>
                  <li>• Evite informações pessoais</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  formData.password !== formData.confirmPassword
                }
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Redefinindo...
                  </div>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Redefinir Senha
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
