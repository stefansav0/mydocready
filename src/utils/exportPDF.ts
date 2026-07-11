export const exportPDF = async (
  element: HTMLElement | null
) => {
  if (!element) return;

  const html2pdf =
    (
      await import("html2pdf.js")
    ).default;

  const options = {
    margin: 0,

    filename: "resume.pdf",

    image: {
      type: "jpeg" as const,

      quality: 1,
    },

    html2canvas: {
      scale: 3,

      useCORS: true,

      logging: false,

      scrollY: 0,
    },

    jsPDF: {
      unit: "px",

      format: [794, 1123] as [number, number],

      orientation: "portrait" as const,
    },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save();
};
