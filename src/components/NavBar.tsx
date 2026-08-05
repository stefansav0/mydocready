"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ChevronDown, FileText, Image as ImageIcon, 
  Grid, Presentation, FileSpreadsheet, LogIn, LogOut, 
  Crop, PenTool, FilePlus
} from "lucide-react";
import Image from "next/image";

interface UserProfile {
  name?: string;
  email: string;
  avatarUrl?: string;
}

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Dropdown state for "TOOLS"
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Safely extracts logged in profile sessions
  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
      try {
        const storedProfile = JSON.parse(storedUser) as UserProfile;
        queueMicrotask(() => setUser(storedProfile));
      } catch {
        localStorage.removeItem("user_session");
      }
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Global Outside Event Listeners for Panel Dismissals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolsRef.current && !toolsRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/signout", { method: "POST" }).catch(() => undefined);
    localStorage.removeItem("user_session");
    setUser(null);
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    window.location.href = "/";
  };

  // Content Data Matrices (Combined into one Tools menu to match image)
  const allTools = [
    { name: "Resize Signature", href: "/resize-signature", icon: <Crop size={16} /> },
    { name: "Passport Photo Maker", href: "/passport-photo", icon: <ImageIcon size={16} /> },
    { name: "Smart Resume Builder", href: "/resume-maker", icon: <FileText size={16} /> },
    { name: "Word to PDF", href: "/converter/word-to-pdf", icon: <FileText size={16} /> },
    { name: "PDF to Word", href: "/converter/pdf-to-word", icon: <FileText size={16} /> },
    { name: "Excel to PDF", href: "/converter/excel-to-pdf", icon: <FileSpreadsheet size={16} /> },
    { name: "PDF to Excel", href: "/converter/pdf-to-excel", icon: <Grid size={16} /> },
    { name: "Calculator", href: "/calculators", icon: <Presentation size={16} /> },
    { name: "All Tools", href: "/tools", icon: <FilePlus size={16} /> },
  ];

  return (
    <>
      {/* 
        MAIN HEADER 
        Matches the dark slate/blue background and single-row layout of the image 
      */}
      <header className="w-full bg-[#0F52BA] text-white font-sans antialiased relative z-50">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-8 py-3">
          
          {/* LOGO & NAVIGATION BLOCK (Left-aligned) */}
          <div className="flex items-center gap-8">
            
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="DocReady Logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              <span className="font-sans text-xl sm:text-2xl lg:text-3xl font-normal tracking-wide whitespace-nowrap">
                Mydocready
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 mt-1" aria-label="Main Navigation">
              <Link href="/" className="text-[15px] hover:text-gray-300 transition-colors uppercase">
                HOME
              </Link>
              <Link href="/resize" className="text-[15px] hover:text-gray-300 transition-colors uppercase">
                Resize Photo
              </Link>
              <Link href="/blog" className="text-[15px] hover:text-gray-300 transition-colors uppercase">
                Blog
              </Link>
              <Link href="/resume-maker" className="text-[15px] hover:text-gray-300 transition-colors uppercase">
                Resume
              </Link>

              {/* Tools Dropdown matching the image */}
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className="text-[15px] hover:text-gray-300 transition-colors uppercase flex items-center gap-1"
                >
                  TOOLS <ChevronDown size={16} className={`transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {toolsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white text-black shadow-xl rounded-sm py-2 animate-in fade-in slide-in-from-top-2">
                    {allTools.map((tool, idx) => (
                      <Link 
                        key={idx} 
                        href={tool.href} 
                        onClick={() => setToolsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-500">{tool.icon}</span> {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* RIGHT SIDE ACTIONS (Auth & Mobile Menu) */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth */}
            <div className="hidden lg:flex justify-end items-center gap-4">
              {!user ? (
                <Link href="/signin" className="flex bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm uppercase tracking-wider transition-colors items-center gap-2 rounded-sm">
                  <LogIn size={16} /> SIGN IN
                </Link>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 transition-colors rounded-sm"
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white text-black shadow-xl rounded-sm z-50 text-left overflow-hidden">
                      <div className="p-3 border-b border-gray-100 text-sm">
                        <p className="font-bold truncate">{user.name}</p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2.5 hover:bg-gray-100 text-sm font-medium">Dashboard</Link>
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm font-bold border-t border-gray-100 flex items-center gap-2">
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Trigger (Hamburger Menu placed on the right side) */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setMenuOpen(true)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors focus:outline-none"
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MOBILE FULL-SCREEN SLIDE DRAWER */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-hidden="true" />

        <div className={`absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-[#2b3947] text-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="MyDocReady"
                className="rounded-full bg-white p-1"
              />

              <span className="text-xl font-semibold">
                MyDocReady
              </span>
            </Link>
            <button 
              onClick={() => setMenuOpen(false)} 
              className="p-2 -mr-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-3 -mx-3 hover:bg-white/5 rounded-lg text-lg uppercase">HOME</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="py-3 px-3 -mx-3 hover:bg-white/5 rounded-lg text-lg uppercase">ABOUT US</Link>
              <Link href="/blog" onClick={() => setMenuOpen(false)} className="py-3 px-3 -mx-3 hover:bg-white/5 rounded-lg text-lg uppercase">BLOGS</Link>
              <Link href="/resize" onClick={() => setMenuOpen(false)} className="py-3 px-3 -mx-3 hover:bg-white/5 rounded-lg text-lg uppercase">Resize Photo</Link>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-gray-400 mb-3 border-b border-white/10 pb-2">Tools</h3>
              <div className="flex flex-col gap-1">
                {allTools.map((item, idx) => (
                  <Link key={idx} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-3 -mx-3 text-[15px] hover:bg-white/5 rounded-lg transition-colors">
                    <span className="text-gray-400">{item.icon}</span> {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-white/10 bg-black/20">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-center py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center justify-center gap-1.5 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm transition-colors">
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/signin" onClick={() => setMenuOpen(false)} className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-3 rounded text-sm font-bold uppercase transition-colors">
                <LogIn size={18} /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}