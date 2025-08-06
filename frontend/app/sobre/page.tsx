"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Target,
  Award,
  Heart,
  Mail,
  Linkedin,
  Github,
  Instagram,
  Star,
  Quote,
  X,
  Palette,
  ArrowDownToLine,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";

// Dados da equipe
const teamMembers = [
  {
    id: 1,
    name: "Ana Silva",
    role: "CEO & Fundadora",
    description:
      "Designer gráfica com 8 anos de experiência em criação de artes digitais. Apaixonada por transformar ideias em designs únicos.",
    image: "/placeholder.svg?height=300&width=300&text=Ana+Silva",
    skills: ["Design Gráfico", "Branding", "Gestão", "Photoshop"],
    social: {
      linkedin: "https://linkedin.com/in/anasilva",
      instagram: "https://instagram.com/anasilva_design",
      email: "ana@GlobalPrint.com",
    },
    experience: "8 anos",
    projects: "500+ artes criadas",
  },
  {
    id: 2,
    name: "Carlos Mendes",
    role: "Designer Sênior",
    description:
      "Especialista em tipografia e ilustração digital. Responsável pelas artes motivacionais e designs minimalistas da plataforma.",
    image: "/placeholder.svg?height=300&width=300&text=Carlos+Mendes",
    skills: ["Ilustração", "Tipografia", "Illustrator", "Design Thinking"],
    social: {
      linkedin: "https://linkedin.com/in/carlosmendes",
      instagram: "https://instagram.com/carlos_designs",
      email: "carlos@GlobalPrint.com",
    },
    experience: "6 anos",
    projects: "300+ designs",
  },
  {
    id: 3,
    name: "Marina Costa",
    role: "Designer de Produto",
    description:
      "Focada em UX/UI e experiência do usuário. Garante que cada arte seja perfeita para impressão em camisas.",
    image: "/placeholder.svg?height=300&width=300&text=Marina+Costa",
    skills: ["UX/UI", "Prototipagem", "Figma", "Design System"],
    social: {
      linkedin: "https://linkedin.com/in/marinacosta",
      instagram: "https://instagram.com/marina_ux",
      email: "marina@GlobalPrint.com",
    },
    experience: "5 anos",
    projects: "200+ projetos",
  },
  {
    id: 4,
    name: "João Santos",
    role: "Desenvolvedor Full-Stack",
    description:
      "Responsável pelo desenvolvimento e manutenção da plataforma. Especialista em React, Next.js e tecnologias modernas.",
    image: "/placeholder.svg?height=300&width=300&text=João+Santos",
    skills: ["React", "Next.js", "Node.js", "TypeScript"],
    social: {
      linkedin: "https://linkedin.com/in/joaosantos",
      github: "https://github.com/joaosantos",
      email: "joao@GlobalPrint.com",
    },
    experience: "7 anos",
    projects: "50+ aplicações",
  },
  {
    id: 5,
    name: "Beatriz Lima",
    role: "Marketing Digital",
    description:
      "Estrategista de marketing digital e redes sociais. Conecta nossa marca com milhares de clientes apaixonados por arte.",
    image: "/placeholder.svg?height=300&width=300&text=Beatriz+Lima",
    skills: ["Marketing Digital", "SEO", "Social Media", "Analytics"],
    social: {
      linkedin: "https://linkedin.com/in/beatrizlima",
      instagram: "https://instagram.com/bia_marketing",
      email: "beatriz@GlobalPrint.com",
    },
    experience: "4 anos",
    projects: "100+ campanhas",
  },
  {
    id: 6,
    name: "Rafael Oliveira",
    role: "Atendimento ao Cliente",
    description:
      "Especialista em relacionamento com o cliente. Garante que cada experiência seja excepcional e personalizada.",
    image: "/placeholder.svg?height=300&width=300&text=Rafael+Oliveira",
    skills: ["Atendimento", "CRM", "Comunicação", "Resolução de Problemas"],
    social: {
      linkedin: "https://linkedin.com/in/rafaeloliveira",
      email: "rafael@GlobalPrint.com",
    },
    experience: "3 anos",
    projects: "5000+ atendimentos",
  },
];

// Depoimentos de clientes
const testimonials = [
  {
    id: 1,
    name: "Mariana Ferreira",
    role: "Empreendedora",
    content:
      "A GlobalPrint transformou meu negócio! As artes são incríveis e a qualidade é excepcional. Já vendi mais de 200 camisas!",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=MF",
  },
  {
    id: 2,
    name: "Pedro Almeida",
    role: "Designer Freelancer",
    content:
      "Como designer, eu sei reconhecer qualidade. As artes da GlobalPrint são profissionais e criativas. Recomendo!",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=PA",
  },
  {
    id: 3,
    name: "Luciana Santos",
    role: "Loja de Presentes",
    content:
      "Trabalho com a GlobalPrint há 2 anos. O atendimento é excelente e as artes sempre surpreendem meus clientes.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=LS",
  },
];

// Estatísticas da empresa
const stats = [
  {
    label: "Artes Criadas",
    value: "2.500+",
    icon: <Palette className="h-8 w-8 text-purple-500" />,
  },
  {
    label: "Clientes Satisfeitos",
    value: "10.000+",
    icon: <Heart className="h-8 w-8 text-pink-500" />,
  },
  {
    label: "Downloads Realizados",
    value: "50.000+",
    icon: <ArrowDownToLine className="h-8 w-8 text-blue-500" />,
  },
  {
    label: "Anos de Experiência",
    value: "5+",
    icon: <Calendar className="h-8 w-8 text-yellow-500" />,
  },
];

// Valores da empresa
const values = [
  {
    icon: "🎯",
    title: "Qualidade Premium",
    description:
      "Cada arte é cuidadosamente criada com atenção aos detalhes e alta resolução para impressão perfeita.",
  },
  {
    icon: "🚀",
    title: "Inovação Constante",
    description:
      "Sempre buscamos novas tendências e tecnologias para oferecer designs únicos e modernos.",
  },
  {
    icon: "❤️",
    title: "Paixão pelo Design",
    description:
      "Nossa equipe é apaixonada por arte e design, criando com amor cada projeto que desenvolvemos.",
  },
  {
    icon: "🤝",
    title: "Relacionamento Próximo",
    description:
      "Valorizamos cada cliente e mantemos um relacionamento próximo, oferecendo suporte personalizado.",
  },
];

export default function SobrePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

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
              <Link
                href="/encomendas"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Arte Personalizada
              </Link>
              <Link href="/sobre" className="text-blue-600 font-medium">
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
                  className="text-blue-600 font-medium py-2 px-4 rounded-lg bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ℹ️ Sobre (atual)
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-gray-800 to-black bg-clip-text text-transparent">
            Sobre a GlobalPrint
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Somos uma equipe apaixonada por design e tecnologia, dedicada a
            criar artes digitais exclusivas para camisas. Nossa missão é
            democratizar o acesso a designs profissionais e únicos.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="historia" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="historia">Nossa História</TabsTrigger>
            <TabsTrigger value="equipe">Equipe</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
          </TabsList>

          {/* Nossa História */}
          <TabsContent value="historia" className="space-y-12">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">
                      Como Tudo Começou
                    </h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                      <p>
                        A GlobalPrint nasceu em 2019 da paixão de Ana Silva por
                        design gráfico e empreendedorismo. Após anos trabalhando
                        em agências, ela percebeu a dificuldade que pequenos
                        empreendedores tinham para acessar designs profissionais
                        para suas camisas personalizadas.
                      </p>
                      <p>
                        O que começou como um projeto pessoal rapidamente se
                        transformou em uma plataforma completa, reunindo
                        designers talentosos e tecnologia de ponta para
                        democratizar o acesso a artes digitais de qualidade
                        premium.
                      </p>
                      <p>
                        Hoje, somos referência no mercado de artes digitais para
                        camisas, com milhares de clientes satisfeitos e uma
                        biblioteca com mais de 2.500 designs exclusivos.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src="/placeholder.svg?height=400&width=600&text=Nossa+História"
                      alt="Nossa História"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </Card>

              {/* Equipe de Desenvolvimento */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Equipe de Desenvolvimento
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
                  {[
                    {
                      name: "Rafael Góes",
                      role: "Full-Stack Developer",
                      image: "/rafaelgoes.jpeg",
                      github: "https://github.com/rafaelgoesti",
                      linkedin:
                        "https://www.linkedin.com/in/rafael-g%C3%B3es-duarte-10709332a/",
                    },
                    {
                      name: "Alberto Monteiro",
                      role: "Full-Stack Developer",
                      image: "/albertomonteiro.png",
                      github: "https://github.com/AlbertoMJr0",
                      linkedin:
                        "https://www.linkedin.com/in/alberto-junior-4776ab2a5/",
                    },
                    {
                      name: "Luan Carvalho",
                      role: "Backend Developer",
                      image: "/luancarvalho.png",
                      github: "https://github.com/Luan-carvalho-b",
                      linkedin: "https://linkedin.com/in/pedro-silva-backend",
                    },
                    {
                      name: "Wallace Santos",
                      role: "DevOps",
                      image: "/wallacesantos.png",
                      github: "https://github.com/Wallacess07",
                      linkedin: "https://linkedin.com/in/ana-costa-devops",
                    },
                    {
                      name: "Davi Lima",
                      role: "Developer",
                      image: "/davilima.png",
                      github: "https://github.com/D4vi2205",
                      linkedin: "https://linkedin.com/in/lucas-ferreira-mobile",
                    },
                    {
                      name: "Marcus Batista",
                      role: "FrontEnd Developer",
                      image: "/marcusbatista.png",
                      github: "https://github.com/marcusbatistadev",
                      linkedin: "https://linkedin.com/in/carla-mendes-qa",
                    },
                  ].map((dev, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-white/80 rounded-xl p-6 shadow-none border border-gray-100"
                    >
                      <Image
                        src={dev.image}
                        alt={dev.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover border-4 border-blue-100 shadow mb-4"
                      />
                      <div className="text-lg font-semibold text-gray-900 text-center">
                        {dev.name}
                      </div>
                      <div className="text-blue-600 font-medium text-sm mb-3 text-center">
                        {dev.role}
                      </div>
                      <div className="flex space-x-3 mt-2">
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Equipe */}
          <TabsContent value="equipe" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Conheça Nossa Equipe</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Profissionais apaixonados e talentosos que fazem a GlobalPrint
                acontecer todos os dias
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer"
                  onClick={() =>
                    setSelectedMember(
                      selectedMember === member.id ? null : member.id
                    )
                  }
                >
                  <div className="relative">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {member.description}
                    </p>

                    {selectedMember === member.id && (
                      <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-900">
                              Experiência:
                            </span>
                            <p className="text-gray-600">{member.experience}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              Projetos:
                            </span>
                            <p className="text-gray-600">{member.projects}</p>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-2">
                          {member.social.linkedin && (
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {member.social.github && (
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                          {member.social.instagram && (
                            <a
                              href={member.social.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700 transition-colors"
                            >
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${member.social.email}`}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedMember !== member.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                      >
                        Ver Mais Detalhes
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Valores */}
          <TabsContent value="valores" className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Os princípios que guiam cada decisão e projeto que desenvolvemos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="shadow-xl border-0 p-8 text-center"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>

            {/* Missão, Visão e Valores */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="shadow-xl border-0 p-8 text-center bg-gradient-to-br from-purple-50 to-purple-100">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-blue-900">Missão</h3>
                <p className="text-blue-700 leading-relaxed">
                  Democratizar o acesso a designs profissionais, oferecendo
                  artes digitais de qualidade premium para empreendedores e
                  criativos.
                </p>
              </Card>

              <Card className="shadow-xl border-0 p-8 text-center bg-gradient-to-br from-pink-50 to-pink-100">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-blue-900">Visão</h3>
                <p className="text-blue-700 leading-relaxed">
                  Ser a principal referência em artes digitais para camisas no
                  Brasil, inspirando criatividade e inovação.
                </p>
              </Card>

              <Card className="shadow-xl border-0 p-8 text-center bg-gradient-to-br from-orange-50 to-orange-100">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-blue-900">
                  Propósito
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  Transformar ideias em arte, conectando pessoas através de
                  designs únicos que expressam personalidade e estilo.
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Depoimentos */}
          <TabsContent value="depoimentos" className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Histórias reais de pessoas que transformaram seus negócios com
                nossas artes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="shadow-xl border-0 p-8 relative"
                >
                  <Quote className="h-8 w-8 text-purple-300 absolute top-4 right-4" />

                  <div className="flex items-center space-x-4 mb-6">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Faça Parte da Nossa História
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Junte-se a milhares de empreendedores que já transformaram seus
                negócios com nossas artes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="/encomendas">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 bg-transparent"
                  >
                    Solicitar Arte Personalizada
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
