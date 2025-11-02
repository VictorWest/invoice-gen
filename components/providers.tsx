"use client";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { UserProvider } from "@/context/UserContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <SessionProvider>
      <UserProvider>
        <InvoiceProvider>
            {children}
        </InvoiceProvider>
      </UserProvider>
    </SessionProvider>
  )
}
