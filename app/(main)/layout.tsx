'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "../globals.css";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";



  const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
  });
  const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
  });


  export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const {isAuthenticated} = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
      if(!isAuthenticated){
        return redirect('/login')
      }

      setIsLoading(false);
    },[])

    if(isLoading){
      return <div className="w-full h-screen flex justify-center items-center "><p>Loading...</p></div>
    }

    return (
      
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
    );
  }
