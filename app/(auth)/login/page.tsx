'use client'
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      setError("Email and Password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await auth.login(data);
      router.push("/");
      
    }catch(err: unknown){
      if(typeof err === "string"){
        console.log(err.toUpperCase);
        setError(err);
      }else if(err instanceof Error){
        console.log(err.message);
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-secondary p-4">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-1 text-center">Wisata Pulo Aceh</h1>
        <h3 className="text-md mb-4 text-center text-black/30">Login sebagai Admin</h3>
        <div className="flex flex-col gap-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Input
            placeholder="Email"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            placeholder="Password"
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`py-2 px-4 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
