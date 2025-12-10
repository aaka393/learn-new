import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Profile {
  // define proper fields later based on your API response
  id?: string;
  name?: string;
  email?: string;
  address?:string;
  mobile?:string;
}

interface MainContextType {
  loading: boolean;
  profile: Profile | null;
  fetchProfile: () => Promise<void>;
  LogoutHandler: () => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within MainContextProvider");
  }
  return context;
};

interface Props {
  children: ReactNode;
}

const MainContextProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate()

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      if (!token) return;

      setLoading(true);
      const response = await axiosClient.get("/auth/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setProfile(response.data);
      console.log(response)
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const LogoutHandler=() =>{
    localStorage.removeItem("token")
    toast.success("logout success")
    navigate("/login")
    setProfile(null)
  }

  useEffect(() => {
    fetchProfile();
  }, []); // added dependency array

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <MainContext.Provider value={{ loading, profile, fetchProfile, LogoutHandler }}>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
