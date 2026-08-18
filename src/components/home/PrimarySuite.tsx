import FeatureCard from "./FeatureCard";

type CardColor =
  | "indigo"
  | "violet"
  | "blue"
  | "emerald"
  | "teal"
  | "amber"
  | "rose"
  | "fuchsia";

interface PrimaryTool {
  image: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  color: CardColor;
}

const PRIMARY_TOOLS: PrimaryTool[] = [
  {
    image: "/resume.png",
    title: "Resume Builder",
    description:
      "Create a professional resume with structured sections, clean layouts, and downloadable PDF output.",
    link: "/resume-maker",
    buttonText: "Create Resume",
    color: "emerald",
  },
  {
    image: "/pass.png",
    title: "Passport Photo Maker",
    description:
      "Create passport, visa, and ID-style photos using customizable dimensions for printing or online applications.",
    link: "/passport-photo",
    buttonText: "Create Photo",
    color: "violet",
  },
  {
    image: "/resize.png",
    title: "Image Resizer",
    description:
      "Resize and compress images to suitable dimensions or file sizes for forms, applications, and online uploads.",
    link: "/resize",
    buttonText: "Resize Image",
    color: "indigo",
  },
];

export default function PrimarySuite() {
  return (
    <section
      className="py-16 sm:py-20"
      aria-labelledby="primary-tools-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Popular tools
          </p>

          <h2
            id="primary-tools-heading"
            className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Popular Document Tools
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Create resumes, prepare photos, and optimize images with simple
            online tools designed for everyday document and application needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PRIMARY_TOOLS.map((tool) => (
            <FeatureCard
              key={tool.link}
              image={tool.image}
              title={tool.title}
              description={tool.description}
              link={tool.link}
              buttonText={tool.buttonText}
              color={tool.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}