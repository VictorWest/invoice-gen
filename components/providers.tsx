"use client";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <SessionProvider>
        <InvoiceProvider>
            {children}
        </InvoiceProvider>
    </SessionProvider>
  )
}
