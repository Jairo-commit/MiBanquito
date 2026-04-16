import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import api from "~/api/api";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "~/constants/tokenConstants";
import { Box } from "@mui/material";

export function ProtectedRoute({ children } : { children: React.ReactElement }) {
  const [isAuthorized, setIsAuthorized] = useState<Boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (!tokenExpiration || tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <Box>Loading...</Box>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}
