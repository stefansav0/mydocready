"use client";

import React from "react";
import Link from "next/link";
import { 
  Presentation, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  MonitorPlay, // <-- Add this instead
  Monitor
} from "lucide-react";

export default function PresentationMakerLanding() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      
      {/* --- HERO SECTION --- */}
      <section className="relative border-b border-gray-100 bg-gray-50/50 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            Create and Export Slides to PowerPoint <br />
            <span className="text-blue-600">Instantly in Your Browser</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            A privacy-first pitch deck and slide builder designed for modern workflows. Shape layouts, arrange imagery, and type out your ideas seamlessly across desktops and smartphones—then download real, editable .pptx files.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/presentation-maker/slide-maker" 
              className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-98 text-lg w-full sm:w-auto"
            >
              Open Free Workspace
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-500 mt-10">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-600"/> Client-Side Security</span>
            <span className="flex items-center gap-1.5"><MonitorPlay size={16} className="text-orange-500"/> Native PPTX Outputs</span>
            <span className="flex items-center gap-1.5"><Smartphone size={16} className="text-purple-600"/> Mobile Gesture Support</span>
          </div>

        </div>
      </section>

      {/* --- CORE FEATURES MATRIX --- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          
          <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
  <MonitorPlay className="w-6 h-6" />
</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Native Editable Vectors</h3>
            <p className="text-gray-600 leading-relaxed">
              We do not export static flat images wrapped inside flat file envelopes. Your downloaded files contain structurally compliant XML objects, meaning your text nodes, bounds, and asset images remain completely interactive and editable in Microsoft PowerPoint, Keynote, or Google Slides.
            </p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Adaptive Mobile Execution</h3>
            <p className="text-gray-600 leading-relaxed">
              Built on responsive layout listeners, our design space adapts instantly to structural screen constraints. Mobile gestures are prioritized so you can effortlessly reposition nodes, modify colors, or add assets while working on touch interfaces.
            </p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Zero-Trust Local Processing</h3>
            <p className="text-gray-600 leading-relaxed">
              Your business pitch decks, academic findings, and internal data charts should remain confidential. Because our presentation builder processes data directly within browser RAM cache, your work never hits a remote host server.
            </p>
          </div>

        </div>
      </section>

      {/* --- RICH LONG-FORM CONTENT / ADSEN-ORIENTED COGNITIVE LAYER --- */}
      <section className="bg-gray-50/50 border-y border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 tracking-tight">
              The Strategy Behind High-Impact Presentation Design
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A visually cluttered deck distracts audiences and dilutes core value assertions. Whether pitching venture capitalists, training team members, or presenting data summaries, professional communication relies on fundamental design standards.
            </p>
          </div>

          <div className="space-y-14 text-gray-600 text-lg leading-relaxed">
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-sm bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center font-mono">1</span>
                Managing Cognitive Load and Visual Hierarchy
              </h3>
              <p className="mb-4">
                When an individual views a presentation slide, their working memory experiences cognitive load. Overloading a canvas with raw paragraphs, massive blocks of nested metrics, and non-essential graphic assets forces the viewer's brain to filter background noise rather than process your messaging.
              </p>
              <p>
                To resolve this, modern presentation principles emphasize clean typography and intentional whitespace. Establish a clear typographical hierarchy: your slide headers should use strong weights to map the primary context immediately, while supporting bullet lists should use lighter weights and concise sentence lengths. Space your canvas elements generously to let your information rest cleanly.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-sm bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center font-mono">2</span>
                The 10/20/30 Rule of Pitch Decks
              </h3>
              <p className="mb-4">
                Popularized by veteran technology evangelists, the 10/20/30 rule states that a venture presentation should optimally contain no more than <strong>10 slides</strong>, last no longer than <strong>20 minutes</strong>, and utilize a font size no smaller than <strong>30 points</strong>. 
              </p>
              <p>
                Limiting slide count forces you to distill your value proposition down to its raw mechanics. Restricting text scaling guarantees you write brief, impactful summaries rather than dense, micro-text logs. This combination keeps your audience focused directly on your voice while the presentation operates cleanly in the background as a supporting visual aid.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-sm bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center font-mono">3</span>
                Cross-Platform Interoperability via Open XML Formats
              </h3>
              <p className="mb-4">
                One of the deepest pain points in modern document ecosystems is software lock-in. Exporting layouts to flat formats like PDF removes standard structural text layers, while flat raster imagery scales poorly and loses sharpness on modern high-DPI displays.
              </p>
              <p>
                Our platform uses structurally precise Open XML protocols to export directly into native `.pptx` bundles. Because the downstream markup matches international spreadsheet and office computing standards, you can create a preliminary layout on a mobile browser using our tool and finish the presentation inside Microsoft Office, Google Slides, or Apple Keynote without broken layouts or lost font structures.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --- EXTENSIVE FAQ DEEP SEARCH NODE --- */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="p-3 bg-gray-100 text-gray-800 rounded-full mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2 text-lg">
            Answers to common technical, architectural, and data privacy inquiries.
          </p>
        </div>

        <div className="space-y-6">
          
          <FAQNode 
            question="Is this presentation builder genuinely free to use?"
            answer="Yes. Every tool inside the MyDocReady ecosystem is completely free. We do not use sneaky pricing strategies like allowing you to design a presentation only to block downloads behind a premium paywall. There are no trial periods, account requirements, or watermarks applied."
          />
          
          <FAQNode 
            question="Are my presentation files editable after I export them to .pptx format?"
            answer="Absolutely. The exported file is a true PowerPoint document containing interactive text fields, shape boundaries, and scalable layout arrays. You can open the downloaded document inside any primary office software—such as Microsoft Office, Google Slides, or LibreOffice—and continue making standard adjustments."
          />

          <FAQNode 
            question="How does client-side WebAssembly handle my uploaded images?"
            answer="Our presentation workspace processes data locally using browser engine runtimes. When you import custom photographs or media assets, they are read as local base64 chunks or object bitmaps within your computer's sandboxed RAM. They are never uploaded to a remote file cloud server, guaranteeing complete information privacy."
          />

          <FAQNode 
            question="Why are some elements or menus locked when I touch them on mobile interfaces?"
            answer="To ensure a smooth layout experience across varying viewports, touch controls are contextualized. Selecting a component targets its focus array, revealing a specialized mobile floating tool bar. Tap the Pencil icon inside that bar to safely toggle the editor drawer for styling without locking up your screen."
          />

          <FAQNode 
            question="What is the default canvas aspect ratio for the generated slides?"
            answer="The workspace initializes with a true widescreen 16:9 layout orientation canvas scaled to 960x540 coordinates. This layout standard perfectly mirrors modern displays, casting systems, and overhead conference hardware setups."
          />

          <FAQNode 
            question="Can I customize typography color metrics directly by entering color codes?"
            answer="Yes. The text options drawer features integrated hexadecimal input mapping. You can click the specialized color module to pull open a systemic visual spectrum color-picker, or directly target your enterprise brand rules by configuring standard hex values."
          />

          <FAQNode 
            question="What happens to my slide deck data if I reload or close the tab?"
            answer="Because our platform operates under a local-first browser architectural model, reloading or closing your tab purges the current workspace memory cache. To preserve your design iteration progress, we advise exporting your deck frequently as a local backup .pptx document."
          />

          <FAQNode 
            question="Does this tool support bulk image processing or multiple slide drops?"
            answer="Yes. You can expand your presentation horizontally by hitting the 'Add Slide' module at the base timeline rail. Images can be dropped individually on separate canvas slides, and the system engine compiles them all cleanly into a single unified PowerPoint file structure during the compilation phase."
          />

        </div>
      </section>

      {/* --- FOOTER FINAL CONVERSION CTA --- */}
      <section className="bg-gray-900 py-20 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Build Elegant Presentations Hassle-Free
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Experience real-time slide drafting with no paywalls, zero accounts, and complete security. 
          </p>
          <Link 
            href="/presentation-maker/slide-maker" 
            className="inline-block bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg active:scale-98"
          >
            Start Designing Free
          </Link>
        </div>
      </section>

    </div>
  );
}

/* --- ISOLATED COMPONENT ELEMENTS --- */

interface FAQNodeProps {
  question: string;
  answer: string;
}

function FAQNode({ question, answer }: FAQNodeProps) {
  return (
    <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:border-gray-200 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{question}</h3>
      <p className="text-base text-gray-600 leading-relaxed">{answer}</p>
    </div>
  );
}