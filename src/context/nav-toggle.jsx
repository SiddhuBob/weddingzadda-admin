import React, { createContext, useContext, useState } from 'react';
const SideBarContext = createContext();

export const useSideBar = () => useContext(SideBarContext);

const SideBarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(prev => prev === true ? false : true);
  // Value that will be provided to the components consuming this context
  const contextValue = {
    isOpen,
    setIsOpen,
    toggle
  };

  return (
    <SideBarContext.Provider value={contextValue}>
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarProvider;