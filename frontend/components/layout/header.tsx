"use client";

import { useState, useCallback, memo } from "react";
import { ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface HeaderProps {
  cartItemsCount?: number;
  onCartOpen?: () => void;
}

const Header = memo(({ cartItemsCount = 0, onCartOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-800 bg-clip-text text-transparent">
                GlobalPrint
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Catálogo
            </Link>
            <Link
              href="/encomendas"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Arte Personalizada
            </Link>
            <Link
              href="/sobre"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Sobre
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartOpen}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <Link href="/cliente">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Minha Conta</span>
                </Button>
              </Link>
            </div>

            <Link href="/cadastro">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Cadastrar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartOpen}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="hover:bg-blue-50"
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={closeMobileMenu}
              >
                🏠 Catálogo
              </Link>
              <Link
                href="/encomendas"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={closeMobileMenu}
              >
                🎨 Arte Personalizada
              </Link>
              <Link
                href="/sobre"
                className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-blue-50"
                onClick={closeMobileMenu}
              >
                ℹ️ Sobre
              </Link>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link href="/cliente" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Minha Conta
                  </Button>
                </Link>

                <Link href="/login" onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-300"
                  >
                    Entrar
                  </Button>
                </Link>

                <Link href="/cadastro" onClick={closeMobileMenu}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export { Header };
