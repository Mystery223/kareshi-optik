"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface AppChromeProps {
  children: React.ReactNode;
}

const HIDE_CHROME_PREFIXES = ["/dashboard", "/admin"];

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const hideChrome = HIDE_CHROME_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
