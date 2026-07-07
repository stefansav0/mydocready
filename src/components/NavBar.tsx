"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ChevronDown, FileText, Image as ImageIcon, 
  FileImage, Grid, Presentation, FileSpreadsheet, Sparkles, 
  LogIn, User, LogOut, FolderHeart, ShieldAlert,
  Calculator, Landmark, PiggyBank, TrendingUp, Receipt, Target, Percent,
  Crop, PenTool, FilePlus, Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  name?: string;
  email: string;
  avatarUrl?: string;
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Desktop Dropdown States
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [resizeDropdownOpen, setResizeDropdownOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Mobile Dropdown States (Accordions)
  const [mobileConverterOpen, setMobileConverterOpen] = useState(false);
  const [mobileResizeOpen, setMobileResizeOpen] = useState(false);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);

  // Track authenticated user data layer cleanly
  const [user, setUser] = useState<UserProfile | null>(null);

  // Refs for click-outside handling
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resizeDropdownRef = useRef<HTMLDivElement>(null);
  const calcDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // 1. Monitors page scrolling coordinates
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 2. Safely extracts logged in profile sessions after client-side hydration completes
  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse active user session profiles", e);
      }
    }
  }, []);

  // 3. Dismisses overlay flyouts if clicks register outside the bounds of active dropdown panels
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setToolsDropdownOpen(false);
      }
      if (resizeDropdownRef.current && !resizeDropdownRef.current.contains(target)) {
        setResizeDropdownOpen(false);
      }
      if (calcDropdownRef.current && !calcDropdownRef.current.contains(target)) {
        setCalcDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Closes mobile menu and resets sub-menus
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileConverterOpen(false);
    setMobileResizeOpen(false);
    setMobileCalcOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Clears storage signatures and updates runtime contexts smoothly on signout execution
  const handleSignOut = () => {
    localStorage.removeItem("user_session");
    setUser(null);
    setProfileDropdownOpen(false);
    closeMenu();
    window.location.href = "/";
  };

  // --- Tool Data Arrays ---
  
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

  const resizeTools = [
    { name: "Resize Photo", href: "/resize", icon: <Crop size={16} className="text-teal-500" /> },
    { name: "Resize Signature", href: "/resize-signature", icon: <PenTool size={16} className="text-sky-500" /> },
    { name: "Insert Document", href: "/insert-doc", icon: <FilePlus size={16} className="text-violet-500" /> },
  ];

  const calculatorTools = [
    { name: "EMI Calculator", href: "/calculators/emi", icon: <Landmark size={16} className="text-blue-600" /> },
    { name: "FD Calculator", href: "/calculators/fd", icon: <PiggyBank size={16} className="text-emerald-600" /> },
    { name: "SIP Calculator", href: "/calculators/sip", icon: <TrendingUp size={16} className="text-indigo-600" /> },
    { name: "GST Calculator", href: "/calculators/gst", icon: <Receipt size={16} className="text-orange-600" /> },
    { name: "Goal Planner", href: "/calculators/goal", icon: <Target size={16} className="text-purple-600" /> },
    { name: "Percentage", href: "/calculators/percentage", icon: <Percent size={16} className="text-pink-600" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 border-border shadow-sm py-2 backdrop-blur-md dark:bg-slate-900/95" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight group flex items-center gap-1.5 text-foreground">
          <span>Mydoc<span className="text-indigo-600">Ready</span></span>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          
          {/* Converters Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
                setResizeDropdownOpen(false);
                setCalcDropdownOpen(false);
              }}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors outline-none ${
                toolsDropdownOpen ? "text-indigo-600 bg-indigo-50/50" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Converters</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[500px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 grid grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {converterTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-indigo-600 group"
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-950">
                      {tool.icon}
                    </div>
                    <span className="text-xs font-bold tracking-tight">{tool.name}</span>
                  </Link>
                ))}
                <div className="col-span-2 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <Link 
                    href="/converter"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex justify-center items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-colors"
                  >
                    View All Converters →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resize Dropdown */}
          <div className="relative" ref={resizeDropdownRef}>
            <button
              onClick={() => {
                setResizeDropdownOpen(!resizeDropdownOpen);
                setToolsDropdownOpen(false);
                setCalcDropdownOpen(false);
              }}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                resizeDropdownOpen
                  ? "text-indigo-600 bg-indigo-50/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Resize
              <ChevronDown
                size={14}
                className={`transition-transform ${resizeDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {resizeDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {resizeTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    onClick={() => setResizeDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 hover:text-indigo-600"
                  >
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      {tool.icon}
                    </div>
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Calculators Dropdown */}
          <div className="relative" ref={calcDropdownRef}>
            <button
              onClick={() => {
                setCalcDropdownOpen(!calcDropdownOpen);
                setToolsDropdownOpen(false);
                setResizeDropdownOpen(false);
              }}
              className={`flex items-center gap-1 text-sm font-semibold px-3 py-2 rounded-lg transition-colors outline-none ${
                calcDropdownOpen ? "text-indigo-600 bg-indigo-50/50" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Calculators</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${calcDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            {calcDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[450px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {calculatorTools.map((calc, idx) => (
                    <Link
                      key={idx}
                      href={calc.href}
                      onClick={() => setCalcDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300 hover:text-indigo-600 group"
                    >
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-950">
                        {calc.icon}
                      </div>
                      <span className="text-xs font-bold tracking-tight">{calc.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                  <Link 
                    href="/calculators"
                    onClick={() => setCalcDropdownOpen(false)}
                    className="flex justify-center items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-colors"
                  >
                    View All Calculators →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/passport-photo" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Passport Photo
          </Link>

          <Link href="/presentation-maker" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Slide Maker
          </Link>

          <Link href="/resume-maker" className="text-sm font-semibold text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors">
            Resume
          </Link>
        </nav>

        {/* Desktop Interface Conditional Control Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/signin"
                className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-2 transition-colors"
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Button asChild className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all">
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors outline-none shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-inner">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (user.name || user.email || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name || "My Account"}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <p className="text-xs font-black text-slate-800 truncate">{user.name || "User"}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold">
                    <User size={16} className="text-slate-400" /> Account Dashboard
                  </Link>
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-xs font-black border-t border-slate-100 mt-1"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile View Toggle Controller */}
        <button
          className="lg:hidden p-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-colors text-slate-700"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Modal Dropdown Action Drawer */}
      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-white dark:bg-slate-950 border-t border-border shadow-inner max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 pb-8 z-50">
          <nav className="flex flex-col gap-1 p-4">
            
            {user && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800 mb-3 mx-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {(user.name || user.email || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">{user.name || "My Account"}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            )}

            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 mt-2">Core Services</div>
            
            {/* 1. Mobile Converters Accordion */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden mx-1 mb-2">
              <button 
                onClick={() => setMobileConverterOpen(!mobileConverterOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${mobileConverterOpen ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2">
                  <Shuffle size={16} className={mobileConverterOpen ? "text-indigo-600" : "text-slate-400"} />
                  Document Converters
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileConverterOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
              </button>
              
              {mobileConverterOpen && (
                <div className="bg-slate-50/50 p-3 grid grid-cols-2 gap-2 border-t border-slate-100">
                  {converterTools.map((tool, idx) => (
                    <Link
                      key={idx}
                      href={tool.href}
                      onClick={closeMenu}
                      className="flex flex-col items-center justify-center text-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="bg-slate-50 p-2 rounded-full">
                        {tool.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">{tool.name}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/converter"
                    onClick={closeMenu}
                    className="col-span-2 mt-1 py-2.5 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors bg-indigo-50"
                  >
                    View All Converters →
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Mobile Resize Accordion */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden mx-1 mb-2">
              <button 
                onClick={() => setMobileResizeOpen(!mobileResizeOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${mobileResizeOpen ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2">
                  <Crop size={16} className={mobileResizeOpen ? "text-indigo-600" : "text-slate-400"} />
                  Resize & Edit Tools
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileResizeOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
              </button>
              
              {mobileResizeOpen && (
                <div className="bg-slate-50/50 p-3 grid grid-cols-2 gap-2 border-t border-slate-100">
                  {resizeTools.map((tool, idx) => (
                    <Link
                      key={idx}
                      href={tool.href}
                      onClick={closeMenu}
                      className="flex flex-col items-center justify-center text-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="bg-slate-50 p-2 rounded-full">
                        {tool.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Mobile Calculators Accordion */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden mx-1 mb-2">
              <button 
                onClick={() => setMobileCalcOpen(!mobileCalcOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-colors ${mobileCalcOpen ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-2">
                  <Calculator size={16} className={mobileCalcOpen ? "text-indigo-600" : "text-slate-400"} />
                  Calculators & Planners
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${mobileCalcOpen ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
              </button>
              
              {mobileCalcOpen && (
                <div className="bg-slate-50/50 p-3 grid grid-cols-2 gap-2 border-t border-slate-100">
                  {calculatorTools.map((calc, idx) => (
                    <Link
                      key={idx}
                      href={calc.href}
                      onClick={closeMenu}
                      className="flex flex-col items-center justify-center text-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="bg-slate-50 p-2 rounded-full">
                        {calc.icon}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">{calc.name}</span>
                    </Link>
                  ))}
                  <Link 
                    href="/calculators"
                    onClick={closeMenu}
                    className="col-span-2 mt-1 py-2.5 text-center text-xs font-bold text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors bg-indigo-50"
                  >
                    View All Calculators →
                  </Link>
                </div>
              )}
            </div>

            {/* Standard Links */}
            <Link href="/passport-photo" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all mx-1" onClick={closeMenu}>
              Passport Document Creator
            </Link>
            <Link href="/presentation-maker" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all mx-1" onClick={closeMenu}>
              Widescreen Presentation Maker
            </Link>
            <Link href="/resume-maker" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all mx-1" onClick={closeMenu}>
              Smart Resume Builder
            </Link>
            <Link href="/blog" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all mx-1" onClick={closeMenu}>
              Career Guidelines & Tips
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 px-2 space-y-3">
              {!user ? (
                <>
                  <Link
                    href="/signin"
                    className="block text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                  <Button asChild className="w-full rounded-xl py-6 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100">
                    <Link href="/signup" onClick={closeMenu}>
                      Get Started Free
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/profile" className="block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg" onClick={closeMenu}>
                    My Account Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left text-sm font-black text-red-600 px-3 py-3 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-between mt-2"
                  >
                    <span>Sign Out of Profile</span>
                    <LogOut size={16} />
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}