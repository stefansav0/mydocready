"use client";

import Link from "next/link";
import Image from "next/image"; // Use next/image for avatars
import { useState, useEffect } from "react";
import { Menu, X, User as UserIcon } from "lucide-react";
import { createClient, type User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

const Avatar = ({ user }: { user: User }) => {
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const email = user.email ?? "";

  if (avatarUrl) {
    // Use next/image for optimized loading
    return (
      <Image
        src={avatarUrl}
        alt="User profile"
        width={36}
        height={36}
        className="rounded-full object-cover"
        priority={false}
      />
    );
  }

  const initials = email.substring(0, 2).toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
      {initials || <UserIcon size={20} />}
    </div>
  );
};

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/signin");
  };

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
          <Link href="/resize" className="text-sm text-muted-foreground hover:text-foreground">
            Resize
          </Link>
          <Link href="/resize-signature" className="text-sm text-muted-foreground hover:text-foreground">
            Resize Signature
          </Link>
          <Link href="/passport-photo" className="text-sm text-muted-foreground hover:text-foreground">
            Passport
          </Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            Tips
          </Link>
        </nav>

        {/* Desktop Auth Links */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/signin" className="text-sm text-muted-foreground hover:text-foreground">
                Sign In
              </Link>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="User menu"
              >
                <Avatar user={user} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <p className="font-medium">My Account</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500 focus:text-red-500 focus:bg-red-50"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
            <Link href="/resize-signature" className="text-sm" onClick={toggleMenu}>
              Resize Signature
            </Link>
            <Link href="/passport-photo" className="text-sm" onClick={toggleMenu}>
              Passport
            </Link>
            <Link href="/blog" className="text-sm" onClick={toggleMenu}>
              Tips
            </Link>
            <div className="border-t pt-4 mt-2 space-y-4">
              {!user ? (
                <>
                  <Link href="/signin" className="block text-sm" onClick={toggleMenu}>
                    Sign In
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={toggleMenu}>
                      Get Started
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/profile" className="block text-sm" onClick={toggleMenu}>
                    Profile
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
