"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
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

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um e-mail válido");
      setIsLoading(false);
      return;
    }

    try {
      // Simular envio de email de recuperação
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Em produção, aqui faria a chamada para a API
      console.log("Solicitação de recuperação de senha para:", email);

      setEmailSent(true);
    } catch (err) {
      setError("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);

    // Simular reenvio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    // Aqui poderia mostrar uma mensagem de confirmação
  };

  if (emailSent) {
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
              <div className="mb-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                  GlobalPrint
                </h1>
              </div>
              <CardTitle className="text-2xl text-gray-900">
                E-mail Enviado!
              </CardTitle>
              <CardDescription className="text-base">
                Enviamos as instruções para redefinir sua senha
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Verifique sua caixa de entrada</strong>
                  <br />
                  Enviamos um link para <strong>{email}</strong> com instruções
                  para redefinir sua senha.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Não recebeu o e-mail?</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Verifique sua pasta de spam ou lixo eletrônico</li>
                    <li>
                      Aguarde alguns minutos, pode haver atraso na entrega
                    </li>
                    <li>Certifique-se de que digitou o e-mail corretamente</li>
                  </ul>
                </div>

                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-transparent border-gray-300 hover:bg-gray-50"
                >
                  {isLoading ? "Reenviando..." : "Reenviar E-mail"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Voltar ao Login
                  </Link>
                </div>
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                GlobalPrint
              </h1>
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Recuperar Senha
            </CardTitle>
            <CardDescription>
              Digite seu e-mail e enviaremos instruções para redefinir sua senha
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
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-300 focus:border-blue-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Digite o e-mail associado à sua conta
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Enviar Instruções
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Lembrou da senha?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Fazer login
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Precisa de ajuda?</p>
                <div className="flex justify-center space-x-4 text-xs">
                  <Link
                    href="/suporte"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Suporte
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link
                    href="/faq"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    FAQ
                  </Link>
                  <span className="text-gray-300">•</span>
                  <a
                    href="https://wa.me/5511999999999?text=Olá! Preciso de ajuda para recuperar minha senha 🔐"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
