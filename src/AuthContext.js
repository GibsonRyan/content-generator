import React, { createContext, useState, useEffect } from "react";
import { Auth, Hub } from "aws-amplify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();

    const authListener = (data) => {
      switch (data.payload.event) {
        case "signIn":
          setIsAuthenticated(true);
          break;
        case "signOut":
          setIsAuthenticated(false);
          break;
        default:
          break;
      }
    };

    Hub.listen("auth", authListener);

    return () => {
      Hub.remove("auth", authListener);
    };
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
