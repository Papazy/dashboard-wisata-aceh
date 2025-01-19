'use client'
 
import { useRouter } from 'next/navigation'
import React from 'react'
type DashboardCardType = {
    title: string,
    value: any,
    icon: any,
    link?: string
}
const DashboardCard = ({title, value, icon, link} : DashboardCardType) => {
  const router = useRouter();
  const handleClick = () => {
    if(link){
      router.push(link);
    }
  }

    return (
        <div className="bg-slate-50 p-4 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg cursor-pointer transition " onClick={handleClick}>
            <div className="bg-gray-100 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <h1 className="text-lg font-bold">{title}</h1>
                <p className="text-gray-500">{value}</p>
            </div>
        </div>
    )
}

export default DashboardCard