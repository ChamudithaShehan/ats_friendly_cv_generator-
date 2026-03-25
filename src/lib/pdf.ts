import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generatePDF(element: HTMLElement, filename: string = "resume.pdf") {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const width = imgWidth * ratio;
  const height = imgHeight * ratio;

  pdf.addImage(imgData, "PNG", (pdfWidth - width) / 2, 0, width, height);
  pdf.save(filename);
}
