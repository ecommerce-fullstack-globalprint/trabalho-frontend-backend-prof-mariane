"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Eye,
  Share2,
  Zap,
  CreditCard,
  Smartphone,
  Check,
  Shirt,
  Palette,
  Download,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
// Importa o array realArts do utilitário
import { realArts } from "@/lib/artsData";

// Mock data - em produção viria de uma API
const mockProduct = {
  id: 1,
  title: "Frase Motivacional - Nunca Desista dos Seus Sonhos",
  price: 15.9,
  originalPrice: 22.9,
  category: "Frases Motivacionais",
  type: "Editável",
  rating: 4.8,
  reviews: 156,
  downloads: 1234,
  description:
    "Uma arte inspiradora perfeita para estampar camisas. Design moderno com tipografia elegante que transmite força e determinação. Ideal para quem busca motivação diária ou quer presentear alguém especial.",
  features: [
    "Arte vetorial em alta resolução",
    "Formato PNG transparente",
    "Arquivo editável (PSD/AI)",
    "Tamanhos A4 e A3 inclusos",
    "Cores personalizáveis",
    "Licença comercial inclusa",
    "Mockups de camisa inclusos",
    "Fontes utilizadas incluídas",
  ],
  specifications: {
    format: "PNG, PSD, AI, PDF",
    resolution: "300 DPI",
    size: "A4 (21x29,7cm) e A3 (29,7x42cm)",
    compatibility: "Photoshop CS6+, Illustrator CS6+",
    colors: "CMYK e RGB",
    printReady: "Sim, pronto para impressão",
  },
  image:
    "/placeholder.svg?height=600&width=600&text=Arte+Principal+Camisa",
  tags: [
    "motivacional",
    "frase",
    "tipografia",
    "inspiração",
    "força",
    "sonhos",
  ],
  author: {
    name: "Design Studio Pro",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    sales: 2850,
  },
  reviewsList: [
    {
      id: 1,
      user: "Marina Costa",
      rating: 5,
      comment:
        "Perfeita! Ficou linda na camisa, qualidade excelente. Recomendo!",
      date: "2024-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "João Silva",
      rating: 5,
      comment: "Arte incrível, fácil de editar. Vou comprar mais designs!",
      date: "2024-01-10",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      user: "Ana Ferreira",
      rating: 4,
      comment:
        "Muito boa qualidade, chegou rapidinho. Só achei que poderia ter mais variações de cor.",
      date: "2024-01-08",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ],
  printingTips: [
    "Use tecido 100% algodão para melhor resultado",
    "Temperatura de prensa: 180°C por 15 segundos",
    "Pressão média na prensa térmica",
    "Remova o filme protetor ainda quente",
    "Aguarde 24h antes da primeira lavagem",
  ],
};

const relatedProducts = [
  {
    id: 2,
    title: "Café é Vida - Humor",
    price: 12.9,
    image: "/placeholder.svg?height=200&width=200&text=Café+é+Vida",
    rating: 4.7,
    category: "Humor",
  },
  {
    id: 3,
    title: "Gamer Vintage - Pixel Art",
    price: 19.9,
    image: "/placeholder.svg?height=200&width=200&text=Pixel+Gamer",
    rating: 4.9,
    category: "Geek/Games",
  },
  {
    id: 4,
    title: "Enfermeira Heroína",
    price: 18.9,
    image: "/placeholder.svg?height=200&width=200&text=Enfermeira",
    rating: 4.6,
    category: "Profissões",
  },
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Busca o produto real pelo id da URL
  const productId = Number(params.id);
  const product = realArts.find((art) => art.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-600">Produto não encontrado</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Lógica para adicionar ao carrinho
    console.log("Adicionado ao carrinho:", mockProduct.id);
  };

  const handleBuyNow = () => {
    setShowPaymentOptions(true);
  };

  const handleDirectCheckout = (paymentMethod: string) => {
    // Redirecionar para checkout com método específico
    router.push(`/checkout?product=${mockProduct.id}&payment=${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-zinc-100 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent"
            >
              GlobalPrint
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/encomendas"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Arte Personalizada
              </Link>
              <Link
                href="/sobre"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sobre
              </Link>
            </nav>

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
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Início
              </Link>
              <span>/</span>
              <Link href="/" className="hover:text-blue-600">
                {mockProduct.category}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{mockProduct.title}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={product.image}
                  alt={mockProduct.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{mockProduct.type}</Badge>
                  <Badge variant="outline">{mockProduct.category}</Badge>
                  <Badge className="bg-green-100 text-green-700">
                    <Shirt className="h-3 w-3 mr-1" />
                    Para Camisas
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold mb-4">{mockProduct.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(mockProduct.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {mockProduct.rating} ({mockProduct.reviews} avaliações)
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {mockProduct.downloads} downloads
                  </span>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {mockProduct.description}
                </p>
                
              </div>

              {/* Price */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    R$ {mockProduct.price.toFixed(2)}
                  </span>
                  {mockProduct.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      R$ {mockProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {mockProduct.originalPrice && (
                    <Badge className="bg-green-100 text-green-700">
                      {Math.round(
                        ((mockProduct.originalPrice - mockProduct.price) /
                          mockProduct.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>

                {!showPaymentOptions ? (
                  <div className="space-y-3">
                    <Button
                      onClick={handleBuyNow}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-gray-700 hover:from-blue-700 hover:to-gray-800 text-lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Comprar Agora
                    </Button>

                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="w-full h-12 text-lg bg-transparent"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`bg-transparent ${
                          isFavorite ? "text-red-500 border-red-500" : ""
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite ? "fill-current" : ""
                          }`}
                        />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-transparent"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Escolha a forma de pagamento:
                    </h3>

                    <div className="space-y-3">
                      <Button
                        onClick={() => handleDirectCheckout("pix")}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 justify-between"
                      >
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 mr-2" />
                          PIX - Pagamento Instantâneo
                        </div>
                        <div className="flex items-center">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 mr-2"
                          >
                            5% OFF
                          </Badge>
                          <span className="font-bold">
                            R$ {(mockProduct.price * 0.95).toFixed(2)}
                          </span>
                        </div>
                      </Button>

                      <Button
                        onClick={() => handleDirectCheckout("credit")}
                        variant="outline"
                        className="w-full h-12 justify-between bg-transparent"
                      >
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2" />
                          Cartão de Crédito
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            até 12x
                          </span>
                          <span className="font-bold">
                            R$ {(mockProduct.price / 12).toFixed(2)}
                          </span>
                        </div>
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShowPaymentOptions(false)}
                      variant="ghost"
                      className="w-full"
                    >
                      Voltar
                    </Button>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Download className="h-4 w-4 text-green-600 mr-1" />
                    Download Imediato
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Palette className="h-4 w-4 text-green-600 mr-1" />
                    Alta Qualidade
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-600 mr-1" />
                    Pronto p/ Impressão
                  </div>
                </div>
              </div>

              {/* Author Info */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={mockProduct.author.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>DS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {mockProduct.author.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {mockProduct.author.rating}
                        </div>
                        <span>{mockProduct.author.sales} vendas</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Card className="shadow-lg border-0 mb-12">
            <CardContent className="p-0">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="specifications">
                    Especificações
                  </TabsTrigger>
                  <TabsTrigger value="printing">Como Imprimir</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Avaliações ({mockProduct.reviews})
                  </TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        O que está incluído:
                      </h3>
                      <ul className="space-y-2">
                        {mockProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-600 mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockProduct.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(mockProduct.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b"
                        >
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1")}:
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="printing" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Dicas para Impressão Perfeita:
                      </h3>
                      <ul className="space-y-3">
                        {mockProduct.printingTips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <Shirt className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        💡 Dica Profissional:
                      </h4>
                      <p className="text-blue-700">
                        Para melhores resultados, use transfer para tecidos
                        escuros em camisas pretas e transfer para tecidos claros
                        em camisas brancas ou coloridas claras.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">
                          {mockProduct.rating}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(mockProduct.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {mockProduct.reviews} avaliações
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {mockProduct.reviewsList.map((review) => (
                        <div key={review.id} className="flex space-x-4">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>{review.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.user}</span>
                              <div className="flex">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">
                        Que tipo de arquivo vou receber?
                      </h4>
                      <p className="text-gray-600">
                        Você receberá arquivos PNG em alta resolução, além dos
                        arquivos editáveis em PSD e AI para personalização
                        completa.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Posso usar para vender camisas?
                      </h4>
                      <p className="text-gray-600">
                        Sim! A licença comercial está inclusa, permitindo uso
                        ilimitado para venda de produtos físicos.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Como faço para imprimir na camisa?
                      </h4>
                      <p className="text-gray-600">
                        Você pode usar transfer térmico, serigrafia ou impressão
                        digital. Incluímos um guia completo com dicas de
                        impressão.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        E se eu quiser alterar as cores?
                      </h4>
                      <p className="text-gray-600">
                        Os arquivos editáveis permitem alteração completa de
                        cores, fontes e elementos. Também incluímos algumas
                        variações prontas.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Outras Artes para Camisas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-700"
                      >
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
