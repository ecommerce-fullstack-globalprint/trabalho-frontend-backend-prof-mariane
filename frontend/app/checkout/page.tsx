"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Check,
  Copy,
  QrCode,
  X,
} from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";

// Mock cart items - em produção viria do contexto/estado global
const mockCartItems = [
  {
    id: 1,
    title: "Convite Casamento Floral",
    price: 29.9,
    image: "/placeholder.svg?height=80&width=80",
    category: "Casamento",
    type: "Editável",
  },
  {
    id: 2,
    title: "Arte Dia das Mães",
    price: 19.9,
    image: "/placeholder.svg?height=80&width=80",
    category: "Datas Comemorativas",
    type: "Pronto",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [showPixQR, setShowPixQR] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [billingData, setBillingData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: "1",
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleInputChange = (
    field: string,
    value: string,
    type: "billing" | "card" = "billing"
  ) => {
    if (type === "billing") {
      setBillingData((prev) => ({ ...prev, [field]: value }));
    } else {
      setCardData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const generatePixCode = () => {
    // Simula geração de código PIX
    const code = `00020126580014BR.GOV.BCB.PIX013636c4c2c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c52040000530398654${total
      .toFixed(2)
      .replace(
        ".",
        ""
      )}5802BR5925ARTE DIGITAL LTDA6009SAO PAULO62070503***6304`;
    setPixCode(code);
    setShowPixQR(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    // Simula processamento do pagamento
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setPaymentSuccess(true);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Pagamento Aprovado!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua compra foi processada com sucesso. Você receberá um e-mail com
              os links de download.
            </p>

            <div className="space-y-3">
              <Link href="/cliente">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Ir para Área do Cliente
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent"
            >
              GlobalPrint
            </Link>

            {/* Desktop Back Link */}
            <Link
              href="/"
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao catálogo
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:bg-blue-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Catálogo
                </Link>
                <Link
                  href="/encomendas"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🎨 Arte Personalizada
                </Link>
                <Link
                  href="/sobre"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ℹ️ Sobre
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-gray-600">
              Complete seu pedido e faça o download das suas artes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Information */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Informações de Cobrança</CardTitle>
                  <CardDescription>
                    Preencha seus dados para emissão da nota fiscal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={billingData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={billingData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={billingData.cpf}
                        onChange={(e) =>
                          handleInputChange("cpf", e.target.value)
                        }
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={billingData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={billingData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={billingData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={billingData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={billingData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-4">
                      {/* PIX */}
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-green-100 p-2 rounded">
                                <Smartphone className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">PIX</p>
                                <p className="text-sm text-gray-600">
                                  Pagamento instantâneo
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700"
                            >
                              Desconto 5%
                            </Badge>
                          </div>
                        </Label>
                      </div>

                      {/* Credit Card */}
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label
                          htmlFor="credit"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Cartão de Crédito</p>
                              <p className="text-sm text-gray-600">
                                Parcelamento em até 12x
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* PIX Details */}
                  {paymentMethod === "pix" && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-4">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium text-green-800">
                          Pagamento via PIX
                        </h3>
                      </div>

                      {!showPixQR ? (
                        <div className="space-y-3">
                          <p className="text-sm text-green-700">
                            Clique no botão abaixo para gerar o código PIX e
                            finalizar sua compra.
                          </p>
                          <Button
                            onClick={generatePixCode}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <QrCode className="h-4 w-4 mr-2" />
                            Gerar Código PIX
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border">
                            <div className="flex items-center justify-center mb-4">
                              <div className="bg-gray-200 p-8 rounded">
                                <QrCode className="h-24 w-24 text-gray-600" />
                              </div>
                            </div>
                            <p className="text-center text-sm text-gray-600 mb-4">
                              Escaneie o QR Code com seu app do banco
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              Código PIX Copia e Cola:
                            </Label>
                            <div className="flex mt-2">
                              <Input
                                value={pixCode}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                onClick={copyPixCode}
                                variant="outline"
                                size="sm"
                                className="ml-2 bg-transparent"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Alert>
                            <AlertDescription>
                              Após o pagamento, você receberá os links de
                              download por e-mail instantaneamente.
                            </AlertDescription>
                          </Alert>

                          <Button
                            onClick={processPayment}
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing
                              ? "Verificando pagamento..."
                              : "Confirmar Pagamento PIX"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Credit Card Details */}
                  {paymentMethod === "credit" && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Número do Cartão *</Label>
                          <Input
                            id="cardNumber"
                            value={cardData.number}
                            onChange={(e) =>
                              handleInputChange(
                                "number",
                                e.target.value,
                                "card"
                              )
                            }
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </div>

                        <div>
                          <Label htmlFor="cardName">Nome no Cartão *</Label>
                          <Input
                            id="cardName"
                            value={cardData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value, "card")
                            }
                            placeholder="Nome como está no cartão"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Validade *</Label>
                            <Input
                              id="expiry"
                              value={cardData.expiry}
                              onChange={(e) =>
                                handleInputChange(
                                  "expiry",
                                  e.target.value,
                                  "card"
                                )
                              }
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={cardData.cvv}
                              onChange={(e) =>
                                handleInputChange("cvv", e.target.value, "card")
                              }
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="installments">Parcelas</Label>
                          <select
                            id="installments"
                            value={cardData.installments}
                            onChange={(e) =>
                              handleInputChange(
                                "installments",
                                e.target.value,
                                "card"
                              )
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="1">
                              1x de R$ {total.toFixed(2)} (à vista)
                            </option>
                            <option value="2">
                              2x de R$ {(total / 2).toFixed(2)}
                            </option>
                            <option value="3">
                              3x de R$ {(total / 3).toFixed(2)}
                            </option>
                            <option value="6">
                              6x de R$ {(total / 6).toFixed(2)}
                            </option>
                            <option value="12">
                              12x de R$ {(total / 12).toFixed(2)}
                            </option>
                          </select>
                        </div>
                      </div>

                      <Button
                        onClick={processPayment}
                        disabled={
                          isProcessing ||
                          !cardData.number ||
                          !cardData.name ||
                          !cardData.expiry ||
                          !cardData.cvv
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        {isProcessing ? "Processando..." : "Finalizar Compra"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-lg border-0 sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {mockCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.type}</p>
                        </div>
                        <p className="font-bold text-sm">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {paymentMethod === "pix" && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto PIX (5%):</span>
                        <span>-R$ {(subtotal * 0.05).toFixed(2)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        R${" "}
                        {paymentMethod === "pix"
                          ? (subtotal * 0.95).toFixed(2)
                          : total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                      🔒 Pagamento 100% seguro e criptografado
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
