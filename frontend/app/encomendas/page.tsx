"use client";

import type React from "react";

import { useState } from "react";
import { Upload, ArrowLeft, Plus, X, Shirt, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const categories = [
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
  "Logo/Marca Pessoal",
];

const urgencyOptions = [
  { value: "normal", label: "Normal (5-7 dias)", price: 0 },
  { value: "rapido", label: "Rápido (2-3 dias)", price: 25 },
  { value: "urgente", label: "Urgente (24 horas)", price: 50 },
];

const shirtStyles = [
  "Básica/Lisa",
  "Oversized",
  "Baby Look",
  "Regata",
  "Manga Longa",
  "Polo",
  "Cropped",
];

export default function EncomendaPage() {
  const [formData, setFormData] = useState({
    projectName: "",
    category: "",
    urgency: "normal",
    description: "",
    shirtStyle: "",
    colors: "",
    size: "",
    style: "",
    text: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatePrice = () => {
    const basePrice = 39.9;
    const urgencyPrice =
      urgencyOptions.find((opt) => opt.value === formData.urgency)?.price || 0;
    return basePrice + urgencyPrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Arte personalizada solicitada:", { formData, uploadedFiles });
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Catálogo
              </Link>
              <Link href="/encomendas" className="text-blue-600 font-medium">
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
                  className="text-blue-600 font-medium py-2 px-4 rounded-lg bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🎨 Arte Personalizada (atual)
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
              Arte Personalizada para Camisa
            </h1>
            <p className="text-xl text-gray-600">
              Crie uma arte única e exclusiva para sua camisa dos sonhos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Shirt className="h-6 w-6 mr-2 text-blue-600" />
                    Detalhes da Arte Personalizada
                  </CardTitle>
                  <CardDescription>
                    Preencha as informações para criarmos sua arte exclusiva
                    para camisa
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name */}
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Nome do Projeto *</Label>
                      <Input
                        id="projectName"
                        placeholder="Ex: Camisa Motivacional para Academia"
                        value={formData.projectName}
                        onChange={(e) =>
                          handleInputChange("projectName", e.target.value)
                        }
                        required
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Selecione uma categoria" />
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

                    {/* Shirt Style */}
                    <div className="space-y-2">
                      <Label htmlFor="shirtStyle">Estilo da Camisa</Label>
                      <Select
                        value={formData.shirtStyle}
                        onValueChange={(value) =>
                          handleInputChange("shirtStyle", value)
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Selecione o estilo da camisa" />
                        </SelectTrigger>
                        <SelectContent>
                          {shirtStyles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-4">
                      <Label>Prazo de Entrega *</Label>
                      <RadioGroup
                        value={formData.urgency}
                        onValueChange={(value) =>
                          handleInputChange("urgency", value)
                        }
                      >
                        {urgencyOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                            />
                            <Label
                              htmlFor={option.value}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <span>{option.label}</span>
                                {option.price > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-700"
                                  >
                                    +R$ {option.price.toFixed(2)}
                                  </Badge>
                                )}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição da Arte *</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva detalhadamente a arte que você quer. Ex: Uma frase motivacional com tipografia moderna, cores vibrantes, estilo minimalista..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        required
                        className="min-h-[120px] border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2">
                      <Label htmlFor="text">Texto/Frase (se aplicável)</Label>
                      <Input
                        id="text"
                        placeholder="Ex: Nunca desista dos seus sonhos"
                        value={formData.text}
                        onChange={(e) =>
                          handleInputChange("text", e.target.value)
                        }
                        className="h-12 border-gray-300 focus:border-blue-500"
                      />
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colors">Cores Preferidas</Label>
                        <Input
                          id="colors"
                          placeholder="Ex: Azul, branco, dourado"
                          value={formData.colors}
                          onChange={(e) =>
                            handleInputChange("colors", e.target.value)
                          }
                          className="border-gray-300 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="size">Tamanho da Arte</Label>
                        <Select
                          value={formData.size}
                          onValueChange={(value) =>
                            handleInputChange("size", value)
                          }
                        >
                          <SelectTrigger className="border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Selecione o tamanho" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pequena">
                              Pequena (10x10cm)
                            </SelectItem>
                            <SelectItem value="media">
                              Média (15x15cm)
                            </SelectItem>
                            <SelectItem value="grande">
                              Grande (20x20cm)
                            </SelectItem>
                            <SelectItem value="peito-inteiro">
                              Peito Inteiro (25x30cm)
                            </SelectItem>
                            <SelectItem value="personalizado">
                              Tamanho Personalizado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="style">Estilo Visual</Label>
                      <Select
                        value={formData.style}
                        onValueChange={(value) =>
                          handleInputChange("style", value)
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Selecione o estilo visual" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimalista">
                            Minimalista
                          </SelectItem>
                          <SelectItem value="moderno">Moderno</SelectItem>
                          <SelectItem value="vintage">Vintage/Retrô</SelectItem>
                          <SelectItem value="grunge">Grunge</SelectItem>
                          <SelectItem value="elegante">Elegante</SelectItem>
                          <SelectItem value="divertido">
                            Divertido/Colorido
                          </SelectItem>
                          <SelectItem value="profissional">
                            Profissional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <Label>Referências/Inspirações (Opcional)</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Arraste imagens aqui ou clique para selecionar
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Imagens de referência, logos, fotos, exemplos de
                          estilo (PNG, JPG - máx. 10MB cada)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("file-upload")?.click()
                          }
                          className="bg-transparent border-gray-300 hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Selecionar Imagens
                        </Button>
                      </div>

                      {/* Uploaded Files */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label>Imagens Selecionadas:</Label>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="bg-blue-100 p-2 rounded">
                                    <Upload className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Palette className="h-5 w-5 mr-2 text-blue-600" />
                    Resumo da Arte
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor base:</span>
                      <span>R$ 39,90</span>
                    </div>

                    {formData.urgency !== "normal" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxa de urgência:</span>
                        <span>
                          +R${" "}
                          {urgencyOptions
                            .find((opt) => opt.value === formData.urgency)
                            ?.price.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        R$ {calculatePrice().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold">Informações do Pedido:</h4>

                    {formData.projectName && (
                      <div>
                        <span className="text-sm text-gray-600">Projeto:</span>
                        <p className="font-medium">{formData.projectName}</p>
                      </div>
                    )}

                    {formData.category && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Categoria:
                        </span>
                        <p className="font-medium">{formData.category}</p>
                      </div>
                    )}

                    {formData.shirtStyle && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Estilo da Camisa:
                        </span>
                        <p className="font-medium">{formData.shirtStyle}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-gray-600">Prazo:</span>
                      <p className="font-medium">
                        {
                          urgencyOptions.find(
                            (opt) => opt.value === formData.urgency
                          )?.label
                        }
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">
                          Referências:
                        </span>
                        <p className="font-medium">
                          {uploadedFiles.length} arquivo(s)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-green-800 text-sm mb-1">
                        ✨ O que você receberá:
                      </h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Arte em alta resolução (PNG)</li>
                        <li>• Arquivo editável (PSD/AI)</li>
                        <li>• Mockup da camisa</li>
                        <li>• Guia de impressão</li>
                        <li>• Licença comercial</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg"
                      disabled={
                        !formData.projectName ||
                        !formData.category ||
                        !formData.description
                      }
                    >
                      <Shirt className="h-5 w-5 mr-2" />
                      Solicitar Arte Personalizada
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Você receberá uma confirmação por e-mail com os detalhes
                      do pedido
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
