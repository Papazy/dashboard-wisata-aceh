'use client'
import { useEffect, useState } from "react";
import { WisataType, columns } from "./columns"
import { DataTable } from "./data-table"
import LoadingIndicator from "@/components/loading";


async function getData(): Promise<WisataType[]> {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL+'/places?limit=1000');
    const resData : WisataType[] = await res.json();
    return resData
  }catch(err:any){
    console.log('Error ', err);
    throw new Error("tidak dapat mendapatkan data")
  }
}

export default function Wisata(){

  const [data, setData] = useState<WisataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(()=>{
    const fetchData = async() =>{

      const res= await getData()
      console.log('data', res);
      setData(res);
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
    <div className="w-full flex justify-center">

    <DataTable columns={columns} data={data} isLoading={isLoading}/>
  </div>
  )
}