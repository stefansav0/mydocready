import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          
          {/* Brand Section */}
          <div>
            <div className="text-lg font-bold">DocReady Photo</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Resize by KB, make passport photos, and generate document-ready images in seconds.
            </p>
          </div>

          {/* Tools Section */}
          <div>
            <div className="font-semibold">Tools</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/resize" className="text-muted-foreground hover:text-foreground transition">
                  Resize by KB
                </Link>
              </li>
              <li>
                <Link href="/passport-photo" className="text-muted-foreground hover:text-foreground transition">
                  Passport Maker
                </Link>
              </li>
              <li>
                <Link href="/insert-doc" className="text-muted-foreground hover:text-foreground transition">
                  Insert into PDF/Word
                </Link>
              </li>
            </ul>
          </div>

          {/* Presets Section */}
          <div>
            <div className="font-semibold">Presets</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/resize?aadhar=20" className="text-muted-foreground hover:text-foreground transition">
                  Aadhaar 20 KB
                </Link>
              </li>
              <li>
                <Link href="/resize?pan=1" className="text-muted-foreground hover:text-foreground transition">
                  PAN 10–50 KB
                </Link>
              </li>
              <li>
                <Link href="/passport-photo" className="text-muted-foreground hover:text-foreground transition">
                  Passport 35×45 mm
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <div className="font-semibold">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} DocReady Photo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
