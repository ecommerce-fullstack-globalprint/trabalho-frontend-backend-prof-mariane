"use client";

import { useState } from "react";
import {
  Download,
  Eye,
  Clock,
  CheckCircle,
  Package,
  Settings,
  LogOut,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

const mockPurchases = [
  {
    id: 1,
    title: "Frase Motivacional - Nunca Desista",
    price: 15.9,
    purchaseDate: "2024-01-15",
    downloads: 3,
    maxDownloads: 5,
    image: "/placeholder.svg?height=150&width=150&text=Nunca+Desista",
  },
  {
    id: 2,
    title: "Gamer Vintage - Pixel Art",
    price: 19.9,
    purchaseDate: "2024-01-10",
    downloads: 1,
    maxDownloads: 3,
    image: "/placeholder.svg?height=150&width=150&text=Pixel+Gamer",
  },
];

const mockOrders = [
  {
    id: 1,
    title: "Arte Personalizada - Logo Band",
    status: "em-producao",
    orderDate: "2024-01-20",
    expectedDate: "2024-01-25",
    price: 39.9,
    progress: 60,
  },
  {
    id: 2,
    title: "Frase Humor - Café é Vida",
    status: "entregue",
    orderDate: "2024-01-05",
    deliveryDate: "2024-01-12",
    price: 12.9,
    progress: 100,
  },
];

const mockFavorites = [
  {
    id: 1,
    title: "Enfermeira Heroína",
    price: 18.9,
    image: "/placeholder.svg?height=150&width=150&text=Enfermeira",
  },
  {
    id: 2,
    title: "Futebol Brasileiro",
    price: 17.9,
    image: "/placeholder.svg?height=150&width=150&text=Futebol+BR",
  },
];

export default function ClientePage() {
  const [activeTab, setActiveTab] = useState("compras");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-500";
      case "em-producao":
        return "bg-blue-500";
      case "entregue":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "em-producao":
        return "Em Produção";
      case "entregue":
        return "Entregue";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <Clock className="h-4 w-4" />;
      case "em-producao":
        return <Package className="h-4 w-4" />;
      case "entregue":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent"
            >
              GlobalPrint
            </Link>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-gray-600">joao@email.com</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <Settings className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

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
                {/* Mobile User Info */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-blue-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-600">joao@email.com</p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🏠 Ir ao Catálogo
                </Link>
                <Link
                  href="/encomendas"
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🎨 Arte Personalizada
                </Link>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
            Área do Cliente
          </h1>
          <p className="text-gray-600">
            Gerencie suas artes para camisas, downloads e encomendas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Compras</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Downloads Restantes</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Encomendas Ativas</p>
                  <p className="text-2xl font-bold text-gray-700">2</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-700">5</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger
              value="compras"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Minhas Compras
            </TabsTrigger>
            <TabsTrigger
              value="encomendas"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Encomendas
            </TabsTrigger>
            <TabsTrigger
              value="favoritos"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Favoritos
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compras" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Histórico de Compras
                </CardTitle>
                <CardDescription>
                  Suas artes para camisas compradas com opções de download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <Image
                        src={purchase.image || "/placeholder.svg"}
                        alt={purchase.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {purchase.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Comprado em{" "}
                          {new Date(purchase.purchaseDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          R$ {purchase.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Downloads: {purchase.downloads}/
                          {purchase.maxDownloads}
                        </p>
                        <Progress
                          value={
                            (purchase.downloads / purchase.maxDownloads) * 100
                          }
                          className="w-20 mb-2"
                        />
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent border-gray-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            disabled={
                              purchase.downloads >= purchase.maxDownloads
                            }
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encomendas" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Minhas Encomendas
                </CardTitle>
                <CardDescription>
                  Acompanhe o status das suas encomendas personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {order.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Pedido em{" "}
                            {new Date(order.orderDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} text-white mb-2`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {getStatusText(order.status)}
                            </span>
                          </Badge>
                          <p className="text-lg font-bold text-blue-600">
                            R$ {order.price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} />

                        {order.status === "em-producao" && (
                          <p className="text-sm text-gray-600">
                            Previsão de entrega:{" "}
                            {new Date(order.expectedDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        )}

                        {order.status === "entregue" && (
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-green-600">
                              Entregue em{" "}
                              {new Date(order.deliveryDate!).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favoritos" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Artes Favoritas</CardTitle>
                <CardDescription>
                  Suas artes para camisas salvas para comprar depois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockFavorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <Image
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 text-gray-900">
                          {favorite.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            R$ {favorite.price.toFixed(2)}
                          </span>
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent border-gray-300 hover:bg-gray-50"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                              Comprar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Gerencie suas informações de conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      className="bg-transparent border-gray-300 hover:bg-gray-50"
                    >
                      Alterar foto
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <p className="text-lg text-gray-900">João Silva</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        E-mail
                      </label>
                      <p className="text-lg text-gray-900">joao@email.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <p className="text-lg text-gray-900">(11) 99999-9999</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Membro desde
                      </label>
                      <p className="text-lg text-gray-900">Janeiro 2024</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
