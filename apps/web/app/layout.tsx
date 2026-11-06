import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Provider } from "../components/Provider";


const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
});


export const metadata: Metadata = {
  title: "TaskMatrix App"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
