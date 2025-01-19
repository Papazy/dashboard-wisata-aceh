"use client"
import React, { createContext, useContext, useState } from "react";
import { ProviderProps, LoginProps, userType } from "@/types/auth";
import { useRouter } from "next/navigation";

// context
const AuthContext = createContext<ProviderProps>({
  user: null,
  token: "",
  login: async () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

// provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBrowser = typeof window !== "undefined"; // Periksa apakah window tersedia

  // set variable awal
  const storedUser = isBrowser ? localStorage.getItem("user") : null;
  const storedToken = isBrowser ? localStorage.getItem("token") : null;
  const [user, setUser] = useState<userType | null>(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState<string>(storedToken || "");

  console.log("Masuk ke useAuth");

  const router = useRouter();
  const isAuthenticated = () => {
    if (user) {
      return true;
    }
    return token !== "";
  };

  const getCurrentUser = async (thisToken: string) => {
    const useToken = thisToken || token;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/auth/me?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${useToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (isBrowser) {
          localStorage.setItem("user", JSON.stringify(data));
        }
        console.log("user data ", data);
        return data;
      } else {
        return null;
      }
    } catch (e: any) {
      console.log("Error getCurrentUser", e.message);
      throw new Error("Failed to get user data");
    }
  };

  // login untuk mendapatkan access
  const login = async (data: LoginProps) => {
    try {
      console.log("Masuk ke fungsi auth:", data);
      const { email, password } = data;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/users/auth/login?secret_key=${process.env.NEXT_PUBLIC_BACKEND_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ username: email, password }),
        }
      );

      const resData = await response.json();

      if (response.ok) {
        if (isBrowser) {
          localStorage.setItem("token", resData.access_token);
        }

        await getCurrentUser(resData.access_token);
        setToken(resData.access_token);
      } else {
        throw new Error(resData.message || "Login failed");
      }
    } catch (error) {
      console.log("Login error:", error);
      throw error; // Propagate the error to the caller
    }
  };

  // logout dengan menghapus token
  const logout = async () => {
    if (isBrowser) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// penggunaan useAuth
export const useAuth = () => useContext(AuthContext);
