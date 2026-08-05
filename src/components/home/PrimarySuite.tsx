import {
  FileText,
  Image as ImageIcon,
  Minimize2,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function PrimarySuite() {
  return (
    <section
      id="primary-tools"
      className="max-w-7xl mx-auto px-4 pt-20 pb-10 scroll-mt-10"
    >
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Popular Document Tools
        </h2>

        <p className="text-lg text-slate-600">
          Prepare professional documents, create passport photos, and optimize
          images with simple online tools designed for students,
          professionals, and everyday document needs.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          Icon={FileText}
          title="Resume Builder"
          description="Create professional resumes with clean layouts and export them as print-ready PDF documents."
          link="/resume-maker"
          buttonText="Create Resume"
          color="emerald"
        />

        <FeatureCard
          Icon={ImageIcon}
          title="Passport Photo Maker"
          description="Generate passport, visa, and ID photos in standard sizes suitable for printing or online use."
          link="/passport-photo"
          buttonText="Create Photo"
          color="violet"
        />

        <FeatureCard
          Icon={Minimize2}
          title="Image Resizer"
          description="Resize, compress, and optimize images to meet upload size requirements while maintaining quality."
          link="/resize"
          buttonText="Resize Image"
          color="indigo"
        />
      </div>
    </section>
  );
}