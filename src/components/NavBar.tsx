"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Grid3X3,
  Calculator,
  ScanLine,
  FileSpreadsheet,
  LogIn,
  LogOut,
  Crop,
  Presentation,
  FilePlus,
  WandSparkles,
  FileImage,
  Keyboard,
  PenTool,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface UserProfile {
  name?: string;
  email: string;
  avatarUrl?: string;
}

interface ToolItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const ALL_TOOLS: ToolItem[] = [
  {
    name: "Passport Photo Maker",
    href: "/passport-photo",
    icon: ImageIcon,
  },
  {
    name: "Resize Image",
    href: "/resize",
    icon: Crop,
  },
  {
    name: "Resize Signature",
    href: "/resize-signature",
    icon: PenTool,
  },
  {
    name: "Resume Maker",
    href: "/resume-maker",
    icon: FileText,
  },
  {
    name: "File Converter",
    href: "/converter",
    icon: FileSpreadsheet,
  },
  {
    name: "Document Scanner",
    href: "/scan-document",
    icon: ScanLine,
  },
  {
    name: "ID Card Scanner",
    href: "/id-card-scan",
    icon: FileImage,
  },
  {
    name: "Image to Text",
    href: "/image-to-text",
    icon: Grid3X3,
  },
  {
    name: "Background Remover",
    href: "/bg-remover",
    icon: WandSparkles,
  },
  {
    name: "Image Editor",
    href: "/image-edit",
    icon: ImageIcon,
  },
  {
    name: "Presentation Maker",
    href: "/presentation-maker",
    icon: Presentation,
  },
  {
    name: "Typing Test",
    href: "/typing-test",
    icon: Keyboard,
  },
  {
    name: "Calculators",
    href: "/calculators",
    icon: Calculator,
  },
  {
    name: "All Tools",
    href: "/tools",
    icon: FilePlus,
  },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const toolsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /*
   * Load the current user session.
   */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user_session");

      if (!storedUser) {
        return;
      }

      const parsedUser = JSON.parse(storedUser) as UserProfile;

      if (parsedUser && parsedUser.email) {
        setUser(parsedUser);
      }
    } catch {
      localStorage.removeItem("user_session");
      setUser(null);
    }
  }, []);

  /*
   * Lock body scrolling while mobile navigation is open.
   */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /*
   * Close dropdowns when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        toolsRef.current &&
        !toolsRef.current.contains(target)
      ) {
        setToolsDropdownOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Close menus with Escape.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setToolsDropdownOpen(false);
      setProfileDropdownOpen(false);

      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  /*
   * Close mobile navigation.
   */
  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  /*
   * Close all dropdowns.
   */
  const closeDropdowns = () => {
    setToolsDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  /*
   * Sign out.
   */
  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await fetch("/api/signout", {
        method: "POST",
      });
    } catch {
      // Even if the API request fails,
      // clear the local session below.
    } finally {
      localStorage.removeItem("user_session");

      setUser(null);
      setProfileDropdownOpen(false);
      setToolsDropdownOpen(false);
      setMenuOpen(false);
      setIsSigningOut(false);

      window.location.href = "/";
    }
  };

  const getInitial = () => {
    if (!user) {
      return "U";
    }

    const name = user.name?.trim();

    if (name) {
      return name.charAt(0).toUpperCase();
    }

    return user.email.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN HEADER
      ========================================================== */}

      <header className="relative z-50 w-full bg-[#0F52BA] font-sans text-white">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* =====================================================
              LOGO + DESKTOP NAVIGATION
          ====================================================== */}

          <div className="flex min-w-0 items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F52BA]"
              aria-label="MyDocReady home"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white sm:h-12 sm:w-12">
                <Image
                  src="/logo.png"
                  alt="MyDocReady"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <span className="whitespace-nowrap text-xl font-semibold tracking-wide sm:text-2xl lg:text-3xl">
                MyDocReady
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden items-center gap-5 lg:flex xl:gap-7"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="rounded px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Home
              </Link>

              <Link
                href="/resize"
                className="rounded px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Resize Image
              </Link>

              <Link
                href="/blog"
                className="rounded px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Blog
              </Link>

              <Link
                href="/resume-maker"
                className="rounded px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Resume
              </Link>

              {/* Tools Dropdown */}
              <div
                ref={toolsRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    setToolsDropdownOpen((previous) => !previous);
                    setProfileDropdownOpen(false);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={toolsDropdownOpen}
                  className="flex items-center gap-1 rounded px-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Tools

                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      toolsDropdownOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {toolsDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-3 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-slate-800 shadow-2xl"
                    role="menu"
                  >
                    <div className="border-b border-slate-100 px-4 py-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Popular Tools
                      </p>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                      {ALL_TOOLS.map((tool) => {
                        const Icon = tool.icon;

                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            role="menuitem"
                            onClick={closeDropdowns}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:bg-blue-50 focus-visible:outline-none"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <Icon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>

                            <span>{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="flex shrink-0 items-center gap-3">
            {/* Desktop Authentication */}
            <div className="hidden items-center lg:flex">
              {!user ? (
                <Link
                  href="/signin"
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <LogIn
                    className="h-4 w-4"
                    aria-hidden="true"
                  />

                  Sign In
                </Link>
              ) : (
                <div
                  ref={profileRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(
                        (previous) => !previous
                      );
                      setToolsDropdownOpen(false);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={profileDropdownOpen}
                    aria-label="Open account menu"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || "User profile"}
                        width={34}
                        height={34}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#0F52BA]">
                        {getInitial()}
                      </span>
                    )}

                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-left text-slate-900 shadow-2xl"
                      role="menu"
                    >
                      {/* User Information */}
                      <div className="border-b border-slate-100 p-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.name || "User profile"}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {getInitial()}
                            </span>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {user.name || "My Account"}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={closeDropdowns}
                        className="block px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                      >
                        Dashboard
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <LogOut
                          className="h-4 w-4"
                          aria-hidden="true"
                        />

                        {isSigningOut ? "Signing Out..." : "Log Out"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setToolsDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu
                className="h-7 w-7"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================== */}

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          menuOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer */}
        <aside
          id="mobile-navigation"
          className={`absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-[#263746] text-white shadow-2xl transition-transform duration-300 ease-in-out ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          {/* Drawer Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Image
                src="/logo.png"
                width={42}
                height={42}
                alt="MyDocReady"
                className="rounded-full bg-white p-1"
              />

              <span className="text-xl font-semibold">
                MyDocReady
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation menu"
            >
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Drawer Content */}
          <nav
            className="flex-1 overflow-y-auto p-5"
            aria-label="Mobile navigation links"
          >
            {/* Main Links */}
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-base font-medium uppercase transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                Home
              </Link>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-base font-medium uppercase transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                About Us
              </Link>

              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-base font-medium uppercase transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                Blog
              </Link>

              <Link
                href="/resize"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                Resize Image
              </Link>

              <Link
                href="/resume-maker"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                Resume Maker
              </Link>
            </div>

            {/* Tools */}
            <div className="mt-7">
              <div className="mb-3 border-b border-white/10 px-3 pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tools
                </h2>
              </div>

              <div className="flex flex-col gap-1">
                {ALL_TOOLS.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/5 focus-visible:bg-white/10 focus-visible:outline-none"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-300">
                        <Icon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </span>

                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Mobile Account Area */}
          <div className="shrink-0 border-t border-white/10 bg-black/20 p-5">
            {user ? (
              <div className="flex flex-col gap-4">
                {/* User */}
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name || "User profile"}
                      width={42}
                      height={42}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {getInitial()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {user.name || "My Account"}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-white/10 px-3 py-2.5 text-center text-sm font-medium transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {isSigningOut ? "Signing Out..." : "Log Out"}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold uppercase text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <LogIn
                  className="h-5 w-5"
                  aria-hidden="true"
                />

                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}