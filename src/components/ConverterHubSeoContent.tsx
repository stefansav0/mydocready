export default function ConverterHubSeoContent() {
  return (
    <section className="bg-white py-24 border-t">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Free Online Document Converter for PDF, Word, Excel, PowerPoint & Images
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-9">
            MyDocReady provides a complete collection of free online document
            conversion tools that help individuals, students, businesses,
            teachers, freelancers, accountants, and professionals convert files
            quickly without installing software. Whether you need to convert Word
            to PDF, PDF to Word, Excel to PDF, PDF to Excel, PowerPoint to PDF,
            PDF to PowerPoint, JPG to PDF, or PDF to JPG, our browser-based tools
            make the process simple, secure, and efficient.
          </p>
        </div>

        <div className="space-y-20">

          <div>
            <h3 className="text-3xl font-bold mb-6">
              One Platform for Every Document Conversion
            </h3>

            <p className="text-gray-700 leading-8 mb-5">
              Instead of visiting multiple websites for different file formats,
              MyDocReady brings every major document converter together in one
              easy-to-use platform. Our tools are designed with simplicity,
              speed, and privacy in mind. Upload your document, choose the
              desired conversion, and download the result within seconds.
            </p>

            <p className="text-gray-700 leading-8">
              Every converter is built to preserve document quality while making
              the output compatible with widely used applications such as
              Microsoft Office, Google Workspace, LibreOffice, Apple iWork, and
              Adobe Acrobat Reader.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">

            <div className="border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                PDF Conversion Tools
              </h3>

              <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-8">
                <li>Word to PDF</li>
                <li>Excel to PDF</li>
                <li>PowerPoint to PDF</li>
                <li>JPG to PDF</li>
                <li>Merge images into PDF</li>
                <li>Professional PDF generation</li>
              </ul>
            </div>

            <div className="border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                PDF Extraction Tools
              </h3>

              <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-8">
                <li>PDF to Word</li>
                <li>PDF to Excel</li>
                <li>PDF to PowerPoint</li>
                <li>PDF to JPG</li>
                <li>Extract tables</li>
                <li>Extract images</li>
              </ul>
            </div>

          </div>

          <div>

            <h3 className="text-3xl font-bold mb-6">
              Why Professionals Choose MyDocReady
            </h3>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="border rounded-xl p-6">
                <h4 className="font-bold text-xl mb-3">
                  Privacy First
                </h4>

                <p className="text-gray-700 leading-7">
                  Files are processed directly in your browser whenever
                  possible, reducing the need to upload sensitive documents to
                  remote servers.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h4 className="font-bold text-xl mb-3">
                  Fast Performance
                </h4>

                <p className="text-gray-700 leading-7">
                  Modern browser technologies allow conversions to complete
                  quickly while maintaining document quality.
                </p>
              </div>

              <div className="border rounded-xl p-6">
                <h4 className="font-bold text-xl mb-3">
                  Professional Results
                </h4>

                <p className="text-gray-700 leading-7">
                  Converted files are designed to preserve formatting,
                  readability, and compatibility across common office software.
                </p>
              </div>

            </div>

          </div>

          <div>

            <h3 className="text-3xl font-bold mb-6">
              Who Uses Our Document Converter?
            </h3>

            <div className="grid md:grid-cols-4 gap-5">

              {[
                "Students",
                "Teachers",
                "Businesses",
                "Accountants",
                "Law Firms",
                "Healthcare",
                "Government Offices",
                "Freelancers",
                "Researchers",
                "HR Teams",
                "Marketing Agencies",
                "Developers"
              ].map((item)=>(
                <div
                  key={item}
                  className="bg-indigo-50 rounded-xl p-5 text-center font-semibold"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          <div>

            <h3 className="text-3xl font-bold mb-6">
              Why PDF Remains the Most Trusted Document Format
            </h3>

            <p className="text-gray-700 leading-8 mb-5">
              PDF has become the global standard for sharing digital documents
              because it preserves fonts, layouts, images, and formatting across
              different devices and operating systems. Whether you're sending an
              invoice, submitting a resume, sharing a research paper, or
              archiving business records, PDF ensures recipients see the
              document exactly as intended.
            </p>

            <p className="text-gray-700 leading-8">
              Our document converters help bridge the gap between editable file
              formats like DOCX, XLSX, PPTX, and image files while maintaining
              high-quality output suitable for professional use.
            </p>

          </div>

          <div>

            <h3 className="text-3xl font-bold mb-6">
              Frequently Used File Formats
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {[
                "PDF",
                "DOC",
                "DOCX",
                "XLS",
                "XLSX",
                "PPT",
                "PPTX",
                "CSV",
                "JPG",
                "JPEG",
                "PNG",
                "GIF",
                "WEBP",
                "BMP",
                "TIFF",
                "SVG"
              ].map((item)=>(
                <div
                  key={item}
                  className="border rounded-lg py-3 text-center font-semibold"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

          <div>

            <h3 className="text-3xl font-bold mb-6">
              Start Converting Your Files Today
            </h3>

            <p className="text-gray-700 leading-8">
              Whether you're converting documents for work, school, business,
              legal purposes, finance, presentations, reports, or personal
              projects, MyDocReady gives you one reliable place to convert files
              quickly and efficiently. With support for PDF, Microsoft Word,
              Excel, PowerPoint, and image formats, our growing collection of
              browser-based tools is designed to simplify document management
              while keeping the conversion process straightforward and easy to
              use.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}