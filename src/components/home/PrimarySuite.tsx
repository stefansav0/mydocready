import FeatureCard from "./FeatureCard";

export default function PrimarySuite() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl mb-14">
          <h2 className="text-4xl font-bold text-slate-900">
            Popular Document Tools
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Prepare professional documents, create passport photos, and optimize
            images with simple online tools designed for students,
            professionals, and everyday document needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            image="/resume.png"
            title="Resume Builder"
            description="Create professional resumes with clean layouts and export them as print-ready PDF documents."
            link="/resume-maker"
            buttonText="Create Resume"
            color="emerald"
          />

          <FeatureCard
            image="/pass.png"
            title="Passport Photo Maker"
            description="Generate passport, visa, and ID photos in standard sizes suitable for printing or online use."
            link="/passport-photo"
            buttonText="Create Photo"
            color="violet"
          />

          <FeatureCard
            image="/resize.png"
            title="Image Resizer"
            description="Resize, compress, and optimize images to meet upload size requirements while maintaining quality."
            link="/resize"
            buttonText="Resize Image"
            color="indigo"
          />

        </div>
      </div>
    </section>
  );
}