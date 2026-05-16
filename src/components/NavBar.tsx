"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur transition-colors duration-300 ${
        scrolled ? "bg-background/80" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold">
          MydocReady
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/resize"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Resize
          </Link>

          <Link
            href="/resize-signature"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Resize Signature
          </Link>

          <Link
            href="/passport-photo"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Passport
          </Link>

          <Link
            href="/presentation-maker"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Presentation
          </Link>
          <Link
            href="/converter"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Converter
          </Link>
          <Link
            href="/resume-maker"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Resume
          </Link>

          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Tips
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/signin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Link>

          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-background border-t">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="/resize" className="text-sm" onClick={toggleMenu}>
              Resize
            </Link>

            <Link
              href="/resize-signature"
              className="text-sm"
              onClick={toggleMenu}
            >
              Resize Signature
            </Link>
            <Link
              href="/converter"
              className="text-sm"
              onClick={toggleMenu}
            >
              Converter
            </Link>
            <Link
              href="/resume-maker"
              className="text-sm"
              onClick={toggleMenu}
            >
              Resume
            </Link>
            <Link
              href="/presentation-maker"
              className="text-sm"
              onClick={toggleMenu}
            >
              Presentation
            </Link>


            <Link
              href="/passport-photo"
              className="text-sm"
              onClick={toggleMenu}
            >
              Passport
            </Link>

            <Link href="/blog" className="text-sm" onClick={toggleMenu}>
              Tips
            </Link>

            <div className="border-t pt-4 mt-2 space-y-4">
              <Link
                href="/signin"
                className="block text-sm"
                onClick={toggleMenu}
              >
                Sign In
              </Link>

              <Button asChild className="w-full">
                <Link href="/signup" onClick={toggleMenu}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}