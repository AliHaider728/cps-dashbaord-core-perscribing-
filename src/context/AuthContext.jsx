import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Create the custom hook
export const useAppContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppContext must be used within AuthContextProvider');
  }
  return context;
};

// Create the Provider Component
const AuthContextProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = {
    // Staff data
    selectedStaff,
    setSelectedStaff,
    
    // Client data
    selectedClient,
    setSelectedClient,
    
    // Leave data
    selectedLeave,
    setSelectedLeave,
    
    // Auth data
    authUser,
    setAuthUser,
    token,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;