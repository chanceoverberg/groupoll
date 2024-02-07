import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/outline";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Groupoll",
  description: "Groups for polls with anonymous responses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white`}>
        <Link href="/" className="absolute top-2 left-2 text-white">
          <HomeIcon className="w-5 h-5"/>
        </Link>
        {children}
      </body>
    </html>
  );
}
