import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import React from "react";
import useAuthStore from "../store/useAuthStore";

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	if (!localStorage.getItem("accessToken")) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
};
