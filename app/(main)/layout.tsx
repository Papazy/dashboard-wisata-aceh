'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "../globals.css";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

  export default function MainLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const {isAuthenticated} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(()=>{
      
      const fetchUser = async() =>{

        // console.log("Masuk ke fetchUser");
        if(!isAuthenticated()){
          setIsAuth(false);
          router.replace("/login");
        }else{
          setIsAuth(true);
          setIsLoading(false);
        }
      }
      fetchUser();
    },[isAuthenticated])

    if(isLoading){
      return <div className="w-full h-screen flex justify-center items-center "><p>Loading...</p></div>
    }

    return (
      
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
    );
  }
