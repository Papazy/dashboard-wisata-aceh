import { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pulo Aceh Dashboard",
  description: "Pulo Aceh Dashboard",
};

export default function RootLayout({children} : {children: React.ReactNode}){
  return(
    <html lang="en">
      {/* <meta http-equiv="Content-Security-Policy" content="block-all-mixed-content"></meta>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}  
        </AuthProvider>
      </body>
    </html>
  )
}