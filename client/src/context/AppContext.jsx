import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsloggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const value = {
    backendUrl,
    isLoggedin,
    setIsloggedin,
    userData,
    setUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
