import Link from "next/link";
import {
  Palette,
  Layout,
  ArrowRight,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

type CardColor = "fuchsia" | "violet";

interface ToolItem {
  Icon: typeof Palette;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: CardColor;
}

const TOOLS: ToolItem[] = [
  {
    Icon: Palette,
    title: "Image Editor",
    description:
      "Edit and enhance images with useful tools for adjustments, background removal, and everyday image preparation.",
    link: "/image-edit",
    buttonText: "Edit Image",
    color: "fuchsia",
  },
  {
    Icon: Layout,
    title: "Presentation Maker",
    description:
      "Create editable presentations for school, work, projects, and everyday presentations.",
    link: "/presentation-maker",
    buttonText: "Create Presentation",
    color: "violet",
  },
];

export default function CreativeSuite() {
  return (
    <section
      id="more-tools"
      className="w-full py-16 sm:py-20 bg-white scroll-mt-10"
      aria-labelledby="more-tools-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            More tools
          </p>

          <h2
            id="more-tools-heading"
            className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900"
          >
            More Tools for Everyday Tasks
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore additional tools for editing images and creating
            presentations without installing extra software.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl">
          {TOOLS.map((tool) => (
            <FeatureCard
              key={tool.link}
              Icon={tool.Icon}
              title={tool.title}
              description={tool.description}
              link={tool.link}
              buttonText={tool.buttonText}
              color={tool.color}
            />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 group"
          >
            Explore All Tools
            <ArrowRight
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}