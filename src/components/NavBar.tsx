"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, ChevronDown, FileText, Image as ImageIcon, 
  Grid, Presentation, FileSpreadsheet, LogIn, User, LogOut, 
  Crop, PenTool, FilePlus, BookOpen, Wrench,
  Search, Calendar
} from "lucide-react";

interface UserProfile {
  name?: string;
  email: string;
  avatarUrl?: string;
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  
  // Desktop Active Mega-menu states
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Monitors page scrolling coordinates
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync structural publication timestamps 
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
      };
      setCurrentDateTime(new Date().toLocaleDateString("en-US", options));
    };
    updateTime();
  }, []);

  // Safely extracts logged in profile sessions
  useEffect(() => {
    const storedUser = localStorage.getItem("user_session");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  // Global Outside Event Listeners for Panel Dismissals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (megaMenuRef.current && !megaMenuRef.current.contains(target)) {
        setActiveMegaMenu(null);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user_session");
    setUser(null);
    setProfileDropdownOpen(false);
    window.location.href = "/";
  };

  // Content Data Matrices
  const sections = {
    converters: [
      { name: "Word to PDF", href: "/converter/word-to-pdf", icon: <FileText size={14} /> },
      { name: "PDF to Word", href: "/converter/pdf-to-word", icon: <FileText size={14} /> },
      { name: "Excel to PDF", href: "/converter/excel-to-pdf", icon: <FileSpreadsheet size={14} /> },
      { name: "PDF to Excel", href: "/converter/pdf-to-excel", icon: <Grid size={14} /> },
      { name: "PowerPoint to PDF", href: "/converter/powerpoint-to-pdf", icon: <Presentation size={14} /> },
      { name: "PDF to PowerPoint", href: "/converter/pdf-to-powerpoint", icon: <Presentation size={14} /> },
    ],
    editing: [
      { name: "Resize Photo", href: "/resize", icon: <Crop size={14} /> },
      { name: "Resize Signature", href: "/resize-signature", icon: <PenTool size={14} /> },
      { name: "Insert Document", href: "/insert-doc", icon: <FilePlus size={14} /> },
    ],
    creators: [
      { name: "Passport Photo Maker", href: "/passport-photo", icon: <ImageIcon size={14} /> },
      { name: "Smart Resume Builder", href: "/resume-maker", icon: <FileText size={14} /> },
      { name: "Presentation Deck Engine", href: "/presentation-maker", icon: <Presentation size={14} /> },
    ]
  };

  return (
    <header className="w-full bg-white text-black dark:bg-slate-950 dark:text-white font-sans antialiased flex flex-col items-center">
      
      {/* TIER 1: TOP EDITION & UTILITY BAR */}
      {!scrolled && (
        <div className="hidden md:flex items-center justify-between border-b border-gray-200 dark:border-slate-800 px-4 lg:px-8 py-1.5 text-[11px] text-gray-600 dark:text-gray-400 w-full max-w-[1600px]">
          <div className="flex items-center gap-4">
            <span className="font-bold text-red-600 uppercase tracking-widest text-[10px]">EDITION: GLOBAL</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> {currentDateTime}</span>
          </div>
          <div className="flex items-center gap-4 font-medium text-[11px]">
            <Link href="/blog" className="hover:text-red-600 flex items-center gap-1.5 transition-colors"><BookOpen size={12} /> Insights</Link>
            <Link href="/tools" className="hover:text-red-600 flex items-center gap-1.5 transition-colors"><Wrench size={12} /> Directory</Link>
          </div>
        </div>
      )}

      {/* TIER 2: MAIN BRANDING HEADER ROW */}
      <div className={`transition-all duration-200 px-4 lg:px-8 w-full max-w-[1600px] flex items-center justify-between ${scrolled ? 'py-2' : 'py-5 md:py-7'}`}>
        
        {/* Left Side: Mobile Trigger Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-md"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Center/Left: Editorial News Styling Logo */}
        <div className="flex flex-col items-center lg:items-start mx-auto lg:mx-0">
          <Link href="/" className="font-serif text-3xl md:text-5xl font-black tracking-tight border-b border-gray-300 dark:border-gray-700 leading-[0.85] pb-1.5">
            MYDOC <span className="text-blue-600">READY</span>
          </Link>
          {!scrolled && (
            <span className="hidden lg:block text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 mt-2">
              Your Daily Document Utility
            </span>
          )}
        </div>

        {/* Right Side: Account Actions Profile Controllers */}
        <div className="flex items-center gap-4" ref={profileRef}>
          <button className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors hidden sm:block">
            <Search size={20} strokeWidth={2.5} />
          </button>

          {!user ? (
            <Link href="/signin" className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5">
              <LogIn size={14} /> SIGN IN
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 border border-gray-300 dark:border-slate-800 px-2 py-1 font-bold bg-gray-50 dark:bg-slate-900"
              >
                <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="max-w-[80px] truncate text-xs">{user.name || "Account"}</span>
                <ChevronDown size={14} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 shadow-xl z-50 text-left">
                  <div className="p-3 border-b border-gray-100 dark:border-slate-800 text-xs">
                    <p className="font-bold truncate text-gray-800 dark:text-gray-200">{user.name}</p>
                    <p className="text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-medium text-gray-700 dark:text-gray-300">Dashboard</Link>
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-950 text-red-600 text-xs font-bold border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TIER 3: PRIMARY NAV (Sticky Row Container) */}
      <div className={`w-full border-t border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all flex justify-center ${scrolled ? 'sticky top-0 z-50 shadow-sm' : 'relative'}`} ref={megaMenuRef}>
        <div className="max-w-[1600px] w-full hidden lg:flex items-center justify-between px-4 lg:px-8">
          
          <nav className="flex items-center gap-8" aria-label="Main Navigation">
            {/* Quick Home Access */}
            <Link href="/" className="py-3 text-[13px] font-black uppercase tracking-wider text-blue-600 hover:text-red-700 transition-colors">
              HOME
            </Link>

            {/* Document Converter Trigger */}
            <button
              onClick={() => setActiveMegaMenu(activeMegaMenu === "converters" ? null : "converters")}
              className={`py-3 text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${activeMegaMenu === "converters" ? 'text-red-600' : 'text-gray-900 dark:text-gray-100 hover:text-red-600'}`}
            >
              CONVERTERS <ChevronDown size={14} className={`transition-transform ${activeMegaMenu === "converters" ? 'rotate-180' : ''}`} />
            </button>

            {/* Graphic Management Trigger */}
            <button
              onClick={() => setActiveMegaMenu(activeMegaMenu === "editing" ? null : "editing")}
              className={`py-3 text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${activeMegaMenu === "editing" ? 'text-red-600' : 'text-gray-900 dark:text-gray-100 hover:text-red-600'}`}
            >
              RESIZE & EDIT <ChevronDown size={14} className={`transition-transform ${activeMegaMenu === "editing" ? 'rotate-180' : ''}`} />
            </button>

            {/* Document Generators */}
            <button
              onClick={() => setActiveMegaMenu(activeMegaMenu === "creators" ? null : "creators")}
              className={`py-3 text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${activeMegaMenu === "creators" ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100 hover:text-blue-600'}`}
            >
              IDENTITY LABS <ChevronDown size={14} className={`transition-transform ${activeMegaMenu === "creators" ? 'rotate-180' : ''}`} />
            </button>

            {/* Static Flat Links */}
            <Link href="/calculators" className="py-3 text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              CALCULATORS
            </Link>
            <Link href="/passport-photo" className="py-3 text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              PASSPORT PHOTO
            </Link>
            <Link href="/resume-maker" className="py-3 text-[13px] font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              RESUME BUILDER
            </Link>
          </nav>

          {/* Right Floating Quick Action */}
          <Link href="/tools" className="text-[11px] font-extrabold text-white bg-blue-600 hover:bg-red-700 px-3 py-1.5 uppercase tracking-widest rounded-sm transition-colors">
            TOOLS
          </Link>
        </div>

        {/* TIER 4: MEGA MENU DROPDOWN PANEL */}
        {activeMegaMenu && (
          <div className="hidden lg:block absolute left-0 right-0 top-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-xl z-40 animate-in fade-in duration-150">
            <div className="max-w-[1600px] mx-auto px-8 py-8 grid grid-cols-4 gap-8">
              
              <div className="col-span-3 grid grid-cols-3 gap-6 border-r border-gray-200 dark:border-slate-800 pr-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">Document Converters</h4>
                  <div className="space-y-2">
                    {sections.converters.map((item, idx) => (
                      <Link key={idx} href={item.href} onClick={() => setActiveMegaMenu(null)} className="flex items-center gap-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors py-1">
                        <span className="text-gray-400">{item.icon}</span> {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">Image Processing</h4>
                  <div className="space-y-2">
                    {sections.editing.map((item, idx) => (
                      <Link key={idx} href={item.href} onClick={() => setActiveMegaMenu(null)} className="flex items-center gap-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors py-1">
                        <span className="text-gray-400">{item.icon}</span> {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">Identity Labs</h4>
                  <div className="space-y-2">
                    {sections.creators.map((item, idx) => (
                      <Link key={idx} href={item.href} onClick={() => setActiveMegaMenu(null)} className="flex items-center gap-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors py-1">
                        <span className="text-gray-400">{item.icon}</span> {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editorial / Promotional Side Panel */}
              <div className="flex flex-col justify-between bg-gray-50 dark:bg-slate-800 p-5 rounded-lg border border-gray-100 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-black text-white bg-red-600 px-2 py-1 uppercase tracking-widest inline-block mb-3">Editor's Choice</span>
                  <h5 className="text-[15px] font-bold leading-snug hover:text-red-600 cursor-pointer mb-2 text-gray-900 dark:text-white">Automated Document Pipelines for Remote Workforces</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">Discover optimized practices to instantly generate dynamic passports and formatted business presentations securely online.</p>
                </div>
                <Link href="/tools" onClick={() => setActiveMegaMenu(null)} className="text-xs font-bold text-red-600 hover:text-red-700 mt-4 flex items-center gap-1 group">
                  Browse All 40+ Utilities <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* MOBILE FULL DRAWER NAVIGATION INTERFACE */}
      {menuOpen && (
        <div className="lg:hidden w-full bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 p-5 max-h-[80vh] overflow-y-auto space-y-6 shadow-inner absolute left-0 right-0 z-40">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b-2 border-gray-100 dark:border-slate-800 pb-2 mb-3">File Converters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.converters.map((item, idx) => (
                <Link key={idx} href={item.href} onClick={() => setMenuOpen(false)} className="text-[13px] font-semibold py-2.5 px-3 bg-gray-50 dark:bg-slate-900 rounded border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200 block truncate hover:border-red-200 hover:bg-red-50 transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-red-600 border-b-2 border-gray-100 dark:border-slate-800 pb-2 mb-3">Resize & Customization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.editing.map((item, idx) => (
                <Link key={idx} href={item.href} onClick={() => setMenuOpen(false)} className="text-[13px] font-semibold py-2.5 px-3 bg-gray-50 dark:bg-slate-900 rounded border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200 block truncate hover:border-red-200 hover:bg-red-50 transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-gray-100 dark:border-slate-800 pt-4 flex flex-col gap-1 font-bold text-sm uppercase tracking-wider">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 px-2 hover:bg-gray-50 text-red-600 rounded">Home</Link>
            <Link href="/calculators" onClick={() => setMenuOpen(false)} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded">Calculators</Link>
            <Link href="/passport-photo" onClick={() => setMenuOpen(false)} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded">Passport Photo</Link>
            <Link href="/resume-maker" onClick={() => setMenuOpen(false)} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded">Resume Builder</Link>
            <Link href="/tools" onClick={() => setMenuOpen(false)} className="py-3 px-2 hover:bg-gray-50 dark:hover:bg-slate-900 rounded">All Tools</Link>
          </div>
        </div>
      )}
    </header>
  );
}