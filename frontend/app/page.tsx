"use client";

import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  User,
  Heart,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { realArts } from "@/lib/artsData";

// Lazy load do Header para melhor performance
const Header = dynamic(() => import("@/components/layout/header").then(mod => ({ default: mod.Header })), {
  loading: () => (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex items-center space-x-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  ),
});

const categories = [
  "Todas",
  "Frases Motivacionais",
  "Humor",
  "Geek/Games",
  "Música",
  "Esportes",
  "Profissões",
  "Animais",
  "Natureza",
  "Vintage/Retrô",
  "Minimalista",
  "Tipografia",
];

const artTypes = ["Todos", "Pronto", "Editável", "Personalizado"];

// Banners promocionais com nova paleta
const banners = [
  {
    id: 1,
    title: "🔥 MEGA PROMOÇÃO",
    subtitle: "50% OFF em todas as artes motivacionais",
    description: "Inspire-se e inspire outros com nossas frases exclusivas",
    image: "/placeholder.svg?height=400&width=800&text=Banner+Motivacional",
    buttonText: "Ver Ofertas",
    buttonLink: "/?category=Frases+Motivacionais",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: 2,
    title: "🎮 GEEK COLLECTION",
    subtitle: "Artes exclusivas para gamers",
    description:
      "Pixel art, logos de games e designs únicos para verdadeiros gamers",
    image: "/placeholder.svg?height=400&width=800&text=Banner+Geek",
    buttonText: "Explorar",
    buttonLink: "/?category=Geek/Games",
    gradient: "from-gray-800 to-black",
  },
  {
    id: 3,
    title: "⚽ ESPORTES EM ALTA",
    subtitle: "Mostre sua paixão pelo esporte",
    description: "Futebol, basquete, corrida e muito mais para sua camisa",
    image: "/placeholder.svg?height=400&width=800&text=Banner+Esportes",
    buttonText: "Ver Coleção",
    buttonLink: "/?category=Esportes",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    id: 4,
    title: "🎨 ARTE PERSONALIZADA",
    subtitle: "Crie sua arte única",
    description: "Solicite uma arte exclusiva feita especialmente para você",
    image: "/placeholder.svg?height=400&width=800&text=Banner+Personalizada",
    buttonText: "Solicitar",
    buttonLink: "/encomendas",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    id: 5,
    title: "😂 HUMOR & DIVERSÃO",
    subtitle: "Arranque sorrisos por onde passar",
    description: "Frases engraçadas e designs divertidos para alegrar o dia",
    image: "/placeholder.svg?height=400&width=800&text=Banner+Humor",
    buttonText: "Ver Humor",
    buttonLink: "/?category=Humor",
    gradient: "from-blue-400 to-blue-600",
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedType, setSelectedType] = useState("Todos");
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [cartItems, setCartItems] = useState<
    Array<{
      id: number;
      title: string;
      price: number;
      image: string;
      category: string;
      type: string;
    }>
  >([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // isMobileMenuOpen removido - agora gerenciado pelo Header component

  // Banner carousel state
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play banners
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  }, []);

  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  }, []);

  const goToBanner = useCallback((index: number) => {
    setCurrentBanner(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Retoma auto-play após 10s
  }, []);

  // Filter arts com memoização para melhor performance
  const filteredArts = useMemo(() => {
    return realArts.filter((art) => {
      const matchesSearch = art.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todas" || art.category === selectedCategory;
      const matchesType = selectedType === "Todos" || art.type === selectedType;
      const matchesPrice =
        art.price >= priceRange[0] && art.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesType && matchesPrice;
    });
  }, [searchTerm, selectedCategory, selectedType, priceRange]);

  const addToCart = useCallback((art: (typeof realArts)[0]) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === art.id);
      if (existingItem) {
        return prev; // Item já existe no carrinho
      }
      return [
        ...prev,
        {
          id: art.id,
          title: art.title,
          price: art.price,
          image: art.image,
          category: art.category,
          type: art.type,
        },
      ];
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header otimizado */}
      <Header 
        cartItemsCount={cartItems.length}
        onCartOpen={() => setIsCartOpen(true)}
      />

      {/* Banner Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentBanner
                  ? "translate-x-0"
                  : index < currentBanner
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
            >
              <div
                className={`h-full bg-gradient-to-r ${banner.gradient} relative`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover mix-blend-overlay"
                />

                <div className="relative h-full flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                        {banner.title}
                      </h2>
                      <h3 className="text-xl md:text-2xl mb-4 opacity-90">
                        {banner.subtitle}
                      </h3>
                      <p className="text-lg mb-8 opacity-80 max-w-lg">
                        {banner.description}
                      </p>
                      <Link href={banner.buttonLink}>
                        <Button
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-3 h-auto font-semibold"
                        >
                          {banner.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`text-white/70 hover:text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm transition-all ${
              isAutoPlaying ? "bg-blue-500/20" : "bg-gray-500/20"
            }`}
          >
            {isAutoPlaying ? "⏸️ Auto" : "▶️ Manual"}
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-gray-800 to-black bg-clip-text text-transparent">
            Artes Exclusivas para Camisas
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra nossa coleção de designs únicos para estampar suas camisas.
            Frases motivacionais, humor, geek, esportes e muito mais!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar artes para camisas..."
              className="pl-12 h-14 text-lg border-2 border-blue-200 focus:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-transparent border-gray-300"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Mobile filters content would go here */}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Categoria
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Tipo</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {artTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50}
                    step={2}
                    className="mt-2"
                  />
                </div>

                {/* Popular Categories */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Mais Populares
                  </label>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 hover:bg-blue-50"
                      onClick={() =>
                        setSelectedCategory("Frases Motivacionais")
                      }
                    >
                      💪 Frases Motivacionais
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 hover:bg-blue-50"
                      onClick={() => setSelectedCategory("Humor")}
                    >
                      😂 Humor
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 hover:bg-blue-50"
                      onClick={() => setSelectedCategory("Geek/Games")}
                    >
                      🎮 Geek/Games
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arts Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredArts.length}{" "}
                {filteredArts.length === 1
                  ? "arte encontrada"
                  : "artes encontradas"}
              </p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Mais Popular</SelectItem>
                  <SelectItem value="recent">Mais Recente</SelectItem>
                  <SelectItem value="price-low">Menor Preço</SelectItem>
                  <SelectItem value="price-high">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArts.map((art) => (
                <Card
                  key={art.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={art.image || "/placeholder.svg"}
                      alt={art.title}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-700"
                      >
                        {art.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">
                          {art.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {art.downloads} downloads
                      </span>
                    </div>

                    <Link href={`/produto/${art.id}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                        {art.title}
                      </h3>
                    </Link>

                    <Badge variant="outline" className="mb-3 border-gray-300">
                      {art.category}
                    </Badge>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {art.price.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      onClick={() => addToCart(art)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredArts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma arte encontrada
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Carrinho de Compras</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg border-gray-200"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.category}</p>
                        <p className="font-bold text-blue-600">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCartItems((prev) =>
                            prev.filter((i) => i.id !== item.id)
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    R${" "}
                    {cartItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    Finalizar Compra
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                GlobalPrint
              </h3>
              <p className="text-gray-600 text-sm">
                Sua loja de artes digitais exclusivas para camisas. Designs
                únicos, qualidade premium e licença comercial inclusa.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/GlobalPrint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.88a.88.88 0 1 1-1.75 0 .88.88 0 0 1 1.75 0Z" />
                  </svg>
                </a>

                <a
                  href="https://facebook.com/GlobalPrint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-2 rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@GlobalPrint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white p-2 rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/encomendas"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Arte Personalizada
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cliente"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sobre"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Categorias</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setSelectedCategory("Frases Motivacionais")}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left"
                  >
                    Frases Motivacionais
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Humor")}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left"
                  >
                    Humor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Geek/Games")}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left"
                  >
                    Geek/Games
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedCategory("Esportes")}
                    className="text-gray-600 hover:text-blue-600 transition-colors text-left"
                  >
                    Esportes
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/como-imprimir"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Como Imprimir
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termos"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacidade"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 GlobalPrint. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">
                Formas de pagamento:
              </span>
              <div className="flex space-x-2">
                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                  PIX
                </div>
                <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  Cartão
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre as artes para camisas 👕"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 group"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          <span className="hidden group-hover:block text-sm font-medium whitespace-nowrap">
            Falar com Vendedor
          </span>
        </a>
      </div>
    </div>
  );
}
