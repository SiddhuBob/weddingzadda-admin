import React, { createContext, useContext, useState } from "react";
import DrawerComp from "../components/Drower/Drawer";

const DrawerContext = createContext();

export const useDrawerContext = () => useContext(DrawerContext);

const FormDrawerProvider = ({ children }) => {
  const [drawerData, setDrawerData] = useState({
    title: "",
    type: "",
    width: 0,
    isOpen: false,
  });

  const closedDrawer = () => setDrawerData({ ...drawerData, isOpen: false });

  const contextValue = {
    drawerData,
    closedDrawer,
    setDrawerData,
  };


  return (
    <DrawerContext.Provider value={contextValue}>
      <DrawerComp />
      {children}
    </DrawerContext.Provider>
  );
};

export default FormDrawerProvider;
