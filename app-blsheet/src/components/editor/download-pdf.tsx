import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ArrowDownToLineIcon } from "lucide-react";

import { useEditorContext } from "./editor-provider";

const DownloadPdf: React.FC = () => {
  const { editor } = useEditorContext();

  const downloadPDF = async () => {
    if (!editor) return;

    const editorElement = document.querySelector(".ProseMirror");
    if (!editorElement) return;

    const clone = editorElement.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("document.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.removeChild(clone);
    }
  };

  return (
    <>
      <button
        onClick={downloadPDF}
        className={
          "h-7 min-w-7 shrink-0 flex items-center flex-col justify-center rounded-sm hover:bg-primary/10 px-1.5 overflow-hidden text-sm"
        }
      >
        <ArrowDownToLineIcon className="size-4" />
      </button>
    </>
  );
};

export default DownloadPdf;
