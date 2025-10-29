import * as React from "react";

interface EmailTemplateProps {
  billToName: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currencySymbol: string;
  totalAmount: string | number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  billToName,
  companyName,
  companyEmail,
  companyPhone,
  invoiceNumber,
  invoiceDate,
//   dueDate,
  currencySymbol,
  totalAmount,
}) => (
  <div
    style={{
      backgroundColor: "#f5f7fa",
      padding: "40px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "auto",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ fontSize: "22px", marginBottom: "15px", color: "#111" }}>
        Invoice from {companyName}
      </h1>

      <p style={{ marginBottom: "15px", color: "#333" }}>Hello {billToName},</p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        Thank you for doing business with us. Please find attached your invoice{" "}
        <strong>#{invoiceNumber}</strong> issued on{" "}
        <strong>{invoiceDate}</strong>.
      </p>

      <div
        style={{
          backgroundColor: "#f4f4f4",
          padding: "15px",
          borderRadius: "6px",
          margin: "20px 0",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
          <strong>Total Due:</strong> {currencySymbol}
          {totalAmount}
          <br />
          {/* <strong>Due Date:</strong> {dueDate} */}
        </p>
      </div>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        You can review the invoice details in the attached PDF. If you have any
        questions or discrepancies, kindly reply to this email.
      </p>

      <p style={{ marginTop: "20px", marginBottom: "5px", color: "#333" }}>
        Best regards,
      </p>
      <p style={{ fontWeight: "bold", margin: 0, color: "#000" }}>
        {companyName}
      </p>
      <p style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>
        {companyEmail} | {companyPhone}
      </p>

      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: "25px",
          paddingTop: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#999" }}>
          This email was sent automatically from {companyName}’s invoicing
          system.
        </p>
      </div>
    </div>
  </div>
);
