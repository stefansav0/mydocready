import {
  FileImage,
  FileText,
  RefreshCcw,
  ScanLine,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function CreativeSuite() {
  return (
    <section
      id="document-tools"
      className="max-w-7xl mx-auto px-4 pt-10 pb-20 scroll-mt-10"
    >
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Document Tools for Everyday Use
        </h2>

        <p className="text-lg text-slate-600">
          Prepare documents, edit PDFs, convert files, and create
          print-ready pages with easy-to-use online tools designed for
          students, professionals, and everyday users.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          Icon={FileImage}
          title="Passport Photo Maker"
          description="Create passport, visa, and ID photos with standard sizes ready for printing or online applications."
          link="/passport-photo"
          buttonText="Create Photo"
          color="blue"
        />

        <FeatureCard
          Icon={RefreshCcw}
          title="PDF Converter"
          description="Convert PDF, Word, Excel, PowerPoint, and image files into the format you need."
          link="/converter"
          buttonText="Convert Files"
          color="emerald"
        />

        <FeatureCard
          Icon={ScanLine}
          title="Image & PDF Tools"
          description="Resize, crop, compress, rotate, and optimize images and PDF documents for everyday use."
          link="/image-edit"
          buttonText="Open Tools"
          color="amber"
        />

        <FeatureCard
          Icon={FileText}
          title="Document Creator"
          description="Generate print-ready documents, forms, letters, and A4 layouts for personal and professional use."
          link="/insert-doc"
          buttonText="Create Document"
          color="indigo"
        />
      </div>
    </section>
  );
}