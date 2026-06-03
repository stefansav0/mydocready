"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ChevronDown, FileText, Image as ImageIcon, 
  FileImage, Grid, Presentation, FileSpreadsheet, Sparkles, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitors page coordinate scroll tracks
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Closes the tools dropdown if clicking anywhere else outside the menu bounding frame
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const converterTools = [
    { name: "Word to PDF", href: "/converter/word-to-pdf", icon: <FileText size={16} className="text-blue-500" /> },
    { name: "PDF to Word", href: "/converter/pdf-to-word", icon: <FileText size={16} className="text-indigo-500" /> },
    { name: "Excel to PDF", href: "/converter/excel-to-pdf", icon: <FileSpreadsheet size={16} className="text-emerald-500" /> },
    { name: "PDF to Excel", href: "/converter/pdf-to-excel", icon: <Grid size={16} className="text-green-500" /> },
    { name: "PowerPoint to PDF", href: "/converter/powerpoint-to-pdf", icon: <Presentation size={16} className="text-orange-500" /> },
    { name: "PDF to PowerPoint", href: "/converter/pdf-to-powerpoint", icon: <Presentation size={16} className="text-amber-500" /> },
    { name: "JPG to PDF", href: "/converter/jpg-to-pdf", icon: <ImageIcon size={16} className="text-red-500" /> },
    { name: "PDF to JPG", href: "/converter/pdf-to-jpg", icon: <FileImage size={16} className="text-rose-500" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled 
          ? "bg-background/85 border-border shadow-sm py-2 backdrop-blur-md" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight group flex items-center gap-1.5 text-foreground">
          <Sparkles className="text-indigo-600 group-hover:rotate-12 transition-transform duration-300" size={22} />
          <span>Mydoc<span className="text-indigo-600">Ready</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Main Dashboard Link */}
          <Link href="/converter" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            All Tools
          </Link>

          {/* Premium Dropdown Adapter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors outline-none ${
                toolsDropdownOpen ? "text-indigo-600 bg-indigo-50/50" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Converters</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            {/* Dropdown Flyout Grid */}
            {toolsDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-background border border-border shadow-xl rounded-2xl p-4 grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {converterTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 hover:text-indigo-600"
                  >
                    <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-white">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-bold tracking-tight">{tool.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/resize" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Resize Image
          </Link>

          <Link href="/passport-photo" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Passport Photo
          </Link>

          <Link href="/presentation-maker" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Slide Maker
          </Link>

          <Link href="/resume-maker" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Resume
          </Link>

          <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Tips
          </Link>
        </nav>

        {/* Desktop Access Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signin"
            className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2 transition-colors"
          >
            <LogIn size={16} /> Sign In
          </Link>

          <Button asChild className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle button */}
        <button
          className="md:hidden p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-colors text-slate-700"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          type="button"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer Modal overlay view */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-background border-t border-border shadow-inner max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 pb-8">
          <nav className="flex flex-col gap-1 p-4">
            
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">Core Services</div>
            
            <Link href="/converter" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Document Converter Engine
            </Link>

            <Link href="/resize" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Resize Images & Forms
            </Link>

            <Link href="/passport-photo" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Passport Document Creator
            </Link>

            <Link href="/presentation-maker" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Widescreen Presentation Maker
            </Link>

            <Link href="/resume-maker" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Smart Resume Builder
            </Link>

            <Link href="/blog" className="text-sm font-bold text-slate-700 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-all" onClick={toggleMenu}>
              Career Guidelines & Tips
            </Link>

            {/* Authentication Section */}
            <div className="border-t border-slate-100 pt-4 mt-4 px-2 space-y-3">
              <Link
                href="/signin"
                className="block text-center text-sm font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl py-3 hover:bg-slate-50 transition-colors"
                onClick={toggleMenu}
              >
                Sign In
              </Link>

              <Button asChild className="w-full rounded-xl py-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100">
                <Link href="/signup" onClick={toggleMenu}>
                  Get Started Free
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}