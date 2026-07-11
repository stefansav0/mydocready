export default function ExcelToPdfContent() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12">

        <h2 className="text-4xl font-black text-gray-900 mb-6">
          Excel to PDF Converter – Convert Excel Spreadsheets to Professional PDF Documents Online
        </h2>

        <p className="text-lg text-gray-700 leading-8 mb-6">
          Excel spreadsheets are one of the most widely used formats for storing,
          calculating, and organizing data. Whether you're preparing invoices,
          financial reports, payroll records, inventory sheets, sales reports,
          project plans, budgets, or business documents, Excel makes editing easy.
          However, when it's time to share those files with clients, colleagues,
          or customers, PDF is often the preferred format because it preserves the
          layout across all devices.
        </p>

        <p className="text-lg text-gray-700 leading-8 mb-8">
          Our Excel to PDF Converter allows you to convert Excel (.xlsx, .xls)
          and CSV files into high-quality PDF documents within seconds. The tool
          automatically removes unnecessary blank rows, optimizes table layouts,
          scales large spreadsheets to fit the page, and generates professional
          PDF files that are ready to print or share.
        </p>

        <hr className="my-10" />

        <h3 className="text-3xl font-bold mb-5">
          Why Convert Excel to PDF?
        </h3>

        <p className="text-gray-700 leading-8 mb-6">
          While Excel files are ideal for editing, formulas, and calculations,
          they may display differently depending on the software version or
          operating system. PDF files preserve formatting, fonts, tables, and page
          layouts exactly as intended.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-10">

          <div className="border rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-3">Professional Appearance</h4>
            <p className="text-gray-700 leading-7">
              Convert spreadsheets into polished PDF documents that look the same
              on every computer, smartphone, and tablet.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-3">Easy Sharing</h4>
            <p className="text-gray-700 leading-7">
              PDF documents are easier to email, upload, print, and archive than
              editable spreadsheets.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-3">Prevent Accidental Editing</h4>
            <p className="text-gray-700 leading-7">
              PDF protects your formatting and prevents unintended modifications
              before sharing important documents.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h4 className="text-xl font-bold mb-3">Universal Compatibility</h4>
            <p className="text-gray-700 leading-7">
              PDF files can be opened on Windows, macOS, Linux, Android, and iOS
              without requiring spreadsheet software.
            </p>
          </div>

        </div>

        <h3 className="text-3xl font-bold mb-5">
          Features
        </h3>

        <ul className="space-y-4 list-disc pl-8 text-gray-700 leading-8 mb-12">
          <li>Convert Excel (.xlsx) to PDF</li>
          <li>Convert XLS to PDF</li>
          <li>Convert CSV to PDF</li>
          <li>Automatic blank row removal</li>
          <li>Smart table cropping</li>
          <li>Landscape and portrait orientation</li>
          <li>Fast document generation</li>
          <li>High-quality printable PDF output</li>
          <li>Professional formatting</li>
          <li>Compatible with Microsoft Excel and Google Sheets exports</li>
        </ul>

        <h3 className="text-3xl font-bold mb-5">
          How to Convert Excel to PDF
        </h3>

        <div className="space-y-8 mb-12">

          <div>
            <h4 className="font-bold text-xl mb-2">
              Step 1 – Upload Your Spreadsheet
            </h4>

            <p className="text-gray-700 leading-8">
              Choose an Excel (.xlsx or .xls) or CSV file from your computer or
              drag and drop it into the upload area.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Step 2 – Choose Page Orientation
            </h4>

            <p className="text-gray-700 leading-8">
              Select Portrait for narrow tables or Landscape for spreadsheets with
              many columns.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Step 3 – Generate PDF
            </h4>

            <p className="text-gray-700 leading-8">
              Click Generate PDF. The converter automatically removes empty rows,
              crops unused areas, scales your spreadsheet, and creates a clean PDF.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Step 4 – Download
            </h4>

            <p className="text-gray-700 leading-8">
              Save the generated PDF to your device and share it with colleagues,
              clients, or customers.
            </p>
          </div>

        </div>

        <h3 className="text-3xl font-bold mb-5">
          Perfect For
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          {[
            "Businesses",
            "Students",
            "Teachers",
            "Accountants",
            "HR Teams",
            "Sales Reports",
            "Invoices",
            "Financial Statements",
            "Inventory Sheets",
            "Payroll Documents",
            "Budgets",
            "Project Reports"
          ].map((item) => (
            <div
              key={item}
              className="bg-green-50 rounded-xl p-5 text-center font-semibold"
            >
              {item}
            </div>
          ))}

        </div>

        <h3 className="text-3xl font-bold mb-5">
          Benefits of PDF Documents
        </h3>

        <ul className="space-y-4 list-disc pl-8 text-gray-700 leading-8 mb-12">
          <li>Easy to print</li>
          <li>Smaller file sizes</li>
          <li>Universal compatibility</li>
          <li>Professional presentation</li>
          <li>Consistent formatting</li>
          <li>Suitable for email attachments</li>
          <li>Long-term document storage</li>
          <li>Secure document sharing</li>
        </ul>

        <h3 className="text-3xl font-bold mb-5">
          Frequently Asked Questions
        </h3>

        <div className="space-y-8">

          <div>
            <h4 className="font-bold text-xl mb-2">
              Is this converter free?
            </h4>
            <p className="text-gray-700 leading-8">
              Yes. You can convert Excel spreadsheets into PDF documents without
              installing additional software.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Can I upload CSV files?
            </h4>
            <p className="text-gray-700 leading-8">
              Yes. CSV files are fully supported and can be converted into PDF
              documents.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Will formulas be included?
            </h4>
            <p className="text-gray-700 leading-8">
              The PDF displays the calculated values visible in your spreadsheet,
              making it ideal for reports and document sharing.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-2">
              Does it work on mobile?
            </h4>
            <p className="text-gray-700 leading-8">
              Yes. You can convert spreadsheets using modern mobile and desktop
              browsers.
            </p>
          </div>

        </div>

        <hr className="my-12" />

        <h3 className="text-3xl font-bold mb-5">
          Final Thoughts
        </h3>

        <p className="text-gray-700 leading-8">
          Whether you're preparing invoices, financial statements, payroll
          reports, business presentations, budgets, inventory records, or school
          assignments, our Excel to PDF Converter provides a quick and reliable
          way to generate professional-quality PDF documents. Smart page scaling,
          automatic cropping, blank row removal, and clean formatting ensure that
          every converted file looks polished and is easy to print or share.
        </p>

      </div>
    </section>
  );
}