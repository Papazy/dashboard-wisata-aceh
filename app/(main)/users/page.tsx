'use client';

import { useState, useEffect } from "react";
import { UserType, columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/hooks/useAuth";
import LoadingIndicator from "@/components/loading";

async function getData(token: string): Promise<UserType[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resData: UserType[] = await res.json();
    console.log("Fetched data: ", resData);
    return resData;
  } catch (err: any) {
    console.error("Error fetching data: ", err);
    throw new Error("tidak dapat mendapatkan data: " + err.message);
  }
}

export default function Users() {
  const [data, setData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    if (token === null) {
      console.error("Token is not available");
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getData(token);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if(loading){
    return (
    <div className="flex w-full h-full justify-center items-center">
      <LoadingIndicator />
    </div>)
  }


  return (
    <div className="w-full flex justify-center">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
