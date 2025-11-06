import { PlanStatus } from "@/generated/prisma";
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

interface WelcomeEmailProps {
  name: string;
  planName: PlanStatus
}

export const InvoiceEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
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

export const WelcomePremiumEmailTemplate: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  planName,
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
        Welcome to InvoiceGen Premium!
      </h1>

      <p style={{ marginBottom: "15px", color: "#333" }}>Hi {name},</p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        We’re thrilled to have you onboard as a Premium member! You’ve
        successfully subscribed to our <strong>{planName === "ANNUALLY" ? "ANNUAL" : planName} plan.</strong>.  
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
          As a Premium user, you now have access to exclusive features,
          priority support, and regular updates to enhance your experience.
        </p>
      </div>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        You can start exploring your Premium benefits right away by logging into
        your account. We’re confident you’ll love what’s ahead!
      </p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        If you ever have questions or need assistance, simply reply to this
        email — we’re here to help.
      </p>

      <p style={{ marginTop: "20px", marginBottom: "5px", color: "#333" }}>
        Welcome once again to the Premium family!
      </p>

      <p style={{ fontWeight: "bold", margin: 0, color: "#000" }}>
        The InvoiceGen Team
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
          This email was sent automatically from InvoiceGen’s subscription
          system. Thank you for choosing us!
        </p>
      </div>
    </div>
  </div>
);

export const GoodbyePremiumEmailTemplate: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  planName,
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
        We're Sorry to See You Go
      </h1>

      <p style={{ marginBottom: "15px", color: "#333" }}>Hi {name},</p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        Your <strong>{planName === "ANNUALLY" ? "ANNUAL" : planName}</strong> Premium plan with InvoiceGen has been successfully canceled.  
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
          We truly appreciate the time you spent with us as a Premium member.
          Your feedback and experience help us improve and serve you better.
        </p>
      </div>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        You’ll still have access to your account and invoices under our free plan.
        However, Premium-only features will no longer be available after your
        current billing cycle ends.
      </p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        If there’s anything we could’ve done differently — or if you’d like to
        share why you decided to cancel — we’d love to hear your feedback.
      </p>

      <p style={{ marginBottom: "15px", color: "#333" }}>
        And of course, you can rejoin Premium anytime — your data and settings
        will always be waiting for you.
      </p>

      <p style={{ marginTop: "20px", marginBottom: "5px", color: "#333" }}>
        Thank you for being part of the InvoiceGen community.
      </p>

      <p style={{ fontWeight: "bold", margin: 0, color: "#000" }}>
        The InvoiceGen Team
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
          This email was sent automatically from InvoiceGen’s subscription
          system. We hope to see you again soon!
        </p>
      </div>
    </div>
  </div>
);
