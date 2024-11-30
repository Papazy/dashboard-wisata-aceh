"use client"
import React, { createContext, useContext, useState } from "react";
import { ProviderProps, LoginProps, userType } from "@/types/auth";

// context
const AuthContext = createContext<ProviderProps>({
  user: null,
  token: "",
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false
});


// provider
export const AuthProvider: React.FC<{children : React.ReactNode}> = ({children}) => {

  // set variable awal
  const [user, setUser] = useState<userType | null>(null);
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mnedapatkan nilai awal dari local storage
  React.useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log("user , ", storedUser)
    console.log("token , ", storedToken)
    if(storedUser){
      // set true jika user login
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setToken(storedToken || "");
  },[])


  // login untuk mendapatkan access
  const login = async (data : LoginProps) => {
    console.log("Masuk ke fungsi auth : ", data);
    const {email, password} = data;
    fetch(process.env.NEXT_PUBLIC_BACKEND_API_URL+"/users/auth/login?secret_key=" + process.env.NEXT_PUBLIC_BACKEND_API_KEY,{
      method: "POST",
      headers: {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "username" : email,
        "password" : password
      })
    }).then((res) => (res.json())).then((resData) => {
      console.log(resData);
      setIsAuthenticated(true);
      localStorage.setItem('token', resData.access_token);
      setToken(resData.access_token);
    })
  }
  
  // logout dengan menghapus token
  const logout =  async() => {
    setToken("");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  ) 
}

// penggunaan useAuth
export const useAuth = () => useContext(AuthContext);


