"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export function Provider({ children }: { children: ReactNode }) {
  return <SessionProvider>
    <ToastContainer/>
    {children}
    </SessionProvider>;
}
