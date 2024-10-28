import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAdmin,
  children,
}) => {
  if (!isAdmin) {
    // Redirect to home if user is not admin
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
