import jsPDF from "jspdf";
import { DiscountData, InvoiceData, LineItemType, TaxData, UploadedImage } from "./interfaces/interfaces";
import { months } from "./data";

export function formatCurrency(number: number, currency: string = "$") {
    const isNegative = number < 0;

    const absoluteNumber = Math.abs(number);
    
    // Format the number as currency
    const formattedNumber = new Intl.NumberFormat('en-US', {
        // style: 'currency',
        // currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(absoluteNumber);
    
    return isNegative ? `-${currency}${formattedNumber}` : `${currency}${formattedNumber}`;
}


export function formatDateDayMonth(timestamp: string | Date){
    timestamp = timestamp.toLocaleString()

    const match = timestamp.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)

    if (match) {
        const [_, year, month, day] = match;
        return `${months[+month - 1]} ${day}, ${year}`
    } 
    return timestamp
}

export const generatePDF = async (
  invoiceData: InvoiceData,
  lineItems: LineItemType[],
  selectedCurrency: any,
  discountData: DiscountData,
  taxData: TaxData,
  uploadedImage: UploadedImage | null,
  templateColour: string,
  forEmail?: boolean
) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 20;
  let y = 20;

  // === HEADER BAR ===
  doc.setFillColor(
    templateColour === "white"
      ? "#ffffff"
      : templateColour === "black"
      ? "#000000"
      : templateColour
  );
  doc.rect(0, 0, pageWidth, 6, "F");

  // === COMPANY INFO + LOGO ===
  if (uploadedImage?.url) {
    try {
      const img = await fetch(uploadedImage.url);
      const blob = await img.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((res) => (reader.onloadend = res));
      if (typeof reader.result === "string") {
        doc.addImage(reader.result, "JPEG", marginX, y, 25, 25);
      }
    } catch (err) {
      console.warn("Could not load logo:", err);
    }
  }

  doc.setFont("lato", "bold");
  doc.setFontSize(18);
  doc.text(invoiceData?.invoiceTitle || "INVOICE", pageWidth - marginX, y + 8, {
    align: "right",
  });

  doc.setFontSize(10);
  doc.setFont("lato", "normal");
  const infoY = y + 16;
  doc.text(`Invoice No: ${invoiceData?.invoiceNumber || "-"}`, pageWidth - marginX, infoY, {
    align: "right",
  });
  doc.text(`Date: ${invoiceData?.date || "-"}`, pageWidth - marginX, infoY + 5, {
    align: "right",
  });
  doc.text(`Due: ${invoiceData?.terms || "-"}`, pageWidth - marginX, infoY + 10, {
    align: "right",
  });

  y += 35;

  // === FROM / BILL TO SECTION ===
  doc.setFontSize(12);
  doc.setFont("lato", "bold");
  doc.text("FROM", marginX, y);
  doc.text("BILL TO", pageWidth / 2 + 10, y);

  doc.setFont("lato", "normal");
  doc.setFontSize(10);
  y += 6;

  // FROM column
  const fromLines = [
    invoiceData?.fromName,
    invoiceData?.fromBusiness,
    invoiceData?.fromAddress,
    invoiceData?.fromPhone,
    invoiceData?.fromEmail,
  ].filter(Boolean) as string[];

  fromLines.forEach((line, i) => {
    doc.text(line, marginX, y + i * 5);
  });

  // BILL TO column
  const billLines = [
    invoiceData?.billToName,
    invoiceData?.billToAddress,
    invoiceData?.billToPhone && `Phone: ${invoiceData.billToPhone}`,
    invoiceData?.billToEmail && `Email: ${invoiceData.billToEmail}`,
  ].filter(Boolean) as string[];

  billLines.forEach((line, i) => {
    doc.text(line, pageWidth / 2 + 10, y + i * 5);
  });

  y += Math.max(fromLines.length, billLines.length) * 5 + 12;

  // === LINE ITEMS ===
  doc.setFont("lato", "bold");
  doc.setFontSize(11);
  doc.text("Description", marginX, y);
  doc.text("Rate", 115, y);
  doc.text("Qty", 140, y);
  doc.text(`Amount (${selectedCurrency?.symbol || ""})`, pageWidth - marginX, y, {
    align: "right",
  });

  y += 3;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  doc.setFont("lato", "normal");
  doc.setFontSize(10);

  lineItems.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(item.description || "-", marginX, y);
    doc.text(String(formatCurrency(item.rate || 0, selectedCurrency?.symbol)), 115, y, { align: "right" });
    doc.text(String(item.quantity || 0), 140, y, { align: "right" });
    doc.text(String(formatCurrency(item.amount || 0, selectedCurrency?.symbol)), pageWidth - marginX, y, { align: "right" });
    y += 6;
  });

  y += 5;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 10;

  // === NOTES ===
  if (invoiceData?.notes) {
    doc.setFont("lato", "bold");
    doc.text("NOTES", marginX, y);
    y += 6;
    doc.setFont("lato", "normal");
    const wrapped = doc.splitTextToSize(invoiceData.notes, pageWidth - 2 * marginX);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 5 + 10;
  }

  // === SUMMARY ===
  doc.setFont("lato", "bold");
  doc.setFontSize(11);
  doc.text("SUMMARY", marginX, y);
  y += 8;

  const rightColX = pageWidth - marginX;
  const labelX = 125;

  doc.setFontSize(10);
  doc.setFont("lato", "normal");

  const addSummaryRow = (label: string, value: string | number) => {
    doc.text(label, labelX, y);
    doc.text(String(value), rightColX, y, { align: "right" });
    y += 6;
  };

  addSummaryRow("Subtotal:", formatCurrency(invoiceData?.subtotal || 0, selectedCurrency?.symbol));

  if (discountData?.type !== "None") {
    const label =
      discountData.type === "Percent"
        ? `Discount (${discountData.amount}%)`
        : "Discount";
    addSummaryRow(label, formatCurrency(discountData?.calculatedAmount || 0, selectedCurrency?.symbol));
  }

  if (taxData?.type !== "None") {
    addSummaryRow(`${taxData.label.toUpperCase()} (${taxData.rate}%)`, formatCurrency(invoiceData?.tax || 0, selectedCurrency?.symbol));
  }

  doc.line(labelX, y, rightColX, y);
  y += 6;

  doc.setFont("lato", "normal");
  addSummaryRow("TOTAL:", formatCurrency(invoiceData?.total || 0, selectedCurrency?.symbol));
  doc.setFont("lato", "bold");
  addSummaryRow("BALANCE DUE:", `${selectedCurrency?.name || ""} ${formatCurrency(invoiceData?.balance || 0, selectedCurrency?.symbol)}`);

  y += 10;

  // === SIGNATURE ===
  if (invoiceData?.signatureUrl) {
    try {
      const img = await fetch(invoiceData.signatureUrl);
      const blob = await img.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((res) => (reader.onloadend = res));
      if (typeof reader.result === "string") {
        doc.addImage(reader.result, "PNG", 90, y, 30, 15);
      }
    } catch (err) {
      console.warn("Could not load signature:", err);
    }
  }
  doc.text(`For: ${invoiceData?.fromName}`, 90, y + 25);

  // === FOOTER ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: "center" });
    doc.text("Generated with Invoice Generator", marginX, 290);
  }

  const filename = `${invoiceData?.invoiceNumber + "-" + invoiceData?.invoiceTitle || "invoice"}.pdf`;
  
  if (forEmail){
      const arrayBuffer = doc.output("arraybuffer");

      const buffer = new Uint8Array(arrayBuffer);

      const base64 = doc.output("datauristring").split(",")[1];

      return { filename, buffer, base64 };
  } else {
      doc.save(`${invoiceData?.invoiceNumber + "-" + invoiceData?.invoiceTitle || "invoice"}.pdf`);
  }
};
