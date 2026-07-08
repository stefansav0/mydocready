import Link from "next/link";
import {
  FileText,
  Calculator,
  Building2,
  ShieldCheck,
  Lock,
  Cpu,
  Zap,
  Globe
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          
          {/* Brand & Value Props */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight">MyDocReady</h2>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Your professional digital workspace. Secure, fast, and free tools for documents, photos, and calculations, powered by client-side technology.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-slate-800 text-[11px] font-bold text-slate-300">
                <Zap size={14} className="text-yellow-500" /> 35+ Free Tools
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-slate-800 text-[11px] font-bold text-slate-300">
                <Lock size={14} className="text-blue-500" /> Privacy First
              </span>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-6 text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-400" />
              Popular
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/resume-maker" className="hover:text-white transition-colors">Resume Builder</Link></li>
              <li><Link href="/passport-photo" className="hover:text-white transition-colors">Passport Photo</Link></li>
              <li><Link href="/resize" className="hover:text-white transition-colors">Resize Image (KB)</Link></li>
              <li><Link href="/converter" className="hover:text-white transition-colors">PDF Converter</Link></li>
              <li><Link href="/insert-doc" className="hover:text-white transition-colors">Format A4 Doc</Link></li>
            </ul>
          </div>
          
          {/* Calculators */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-6 text-sm uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Calculators
            </div>
            <ul className="space-y-3 text-sm">
              <li><Link href="/calculators/age" className="hover:text-white transition-colors">Age Calculator</Link></li>
              <li><Link href="/calculators/gst" className="hover:text-white transition-colors">GST Calculator</Link></li>
              <li><Link href="/calculators/emi" className="hover:text-white transition-colors">EMI Calculator</Link></li>
              <li><Link href="/calculators/sip" className="hover:text-white transition-colors">SIP Calculator</Link></li>
              <li><Link href="/calculators/fd" className="hover:text-white transition-colors">FD Calculator</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold mb-6 text-sm uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-amber-400" />
              Company
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>© {new Date().getFullYear()} MyDocReady. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
}