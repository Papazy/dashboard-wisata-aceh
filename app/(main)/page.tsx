'use client'
import DashboardCard from '@/components/dashboardCard';
import LoadingIndicator from '@/components/loading';
import { useAuth } from '@/hooks/useAuth';
import { User, MapPinHouse } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
    const [data, setData] = useState({
      user : 0,
      wisata : 0
    });

    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
      if(!token){
        console.error("Token is not available");
        return;
      }
      const fetchData = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const users = await res.json();
        const res2 = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL+'/places?limit=1000');
        const wisata = await res2.json();
        setData({
          user : users.length,
          wisata : wisata.length
        })
        setIsLoading(false);
      }
      fetchData();
    },[])

    if(isLoading){
      return (
      <div className="flex w-full h-full justify-center items-center">
        <LoadingIndicator />
      </div>)
    }
    return (
      <div className="m-3">
        {/* Menampilkan semua info yang ada */}
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Buat card informasi di dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          <DashboardCard title="Total User" value={data.user} icon={<User/>} link="/users" />
          <DashboardCard title="Jumlah Wisata" value={data.wisata} icon={<MapPinHouse/>} link="/wisata" />
        </div>
        
  

      </div>
    )

}
