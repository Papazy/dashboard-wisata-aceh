'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "../globals.css";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";


  export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const {isAuthenticated} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    

    useEffect(()=>{
      const fetchUser = async() =>{
        if(isAuthenticated()){
          router.push("/");
        }else{
          setIsLoading(false);
        }
      }
      fetchUser();
    },[])

    if(isLoading){
      return <div className="w-full h-screen flex justify-center items-center "><p>Loading...</p></div>
    }

    return (
      <main>
        {children}
      </main>   
    );
  }
