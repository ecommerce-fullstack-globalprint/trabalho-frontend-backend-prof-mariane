"use client";

import Link from "next/link";
import { memo } from "react";

const Footer = memo(() => {
  return (
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
                <Link
                  href="/?category=Frases+Motivacionais"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Frases Motivacionais
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Humor"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Humor
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Geek/Games"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Geek/Games
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Esportes"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Esportes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Contato</h4>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600">
                <strong>WhatsApp:</strong>
                <br />
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition-colors"
                >
                  (11) 99999-9999
                </a>
              </p>
              <p className="text-gray-600">
                <strong>E-mail:</strong>
                <br />
                <a
                  href="mailto:contato@globalprint.com.br"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  contato@globalprint.com.br
                </a>
              </p>
              <p className="text-gray-600">
                <strong>Horário:</strong>
                <br />
                Seg a Sex: 9h às 18h
                <br />
                Sáb: 9h às 14h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} GlobalPrint. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/termos"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/privacidade"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/licenca"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Licença de Uso
              </Link>
            </div>
          </div>

          {/* Tech Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Desenvolvido com ❤️ usando Next.js, React e Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export { Footer };
