import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const PrivateRoute: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
