import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  isAuthed: boolean;
  role: "admin" | "employee";
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  isAuthed,
  role,
  children,
}) => {
  if (!isAuthed) return <Navigate to="/" replace />;
  if (role !== "admin") return <Navigate to="/select-unit" replace />;

  return <>{children}</>;
};

export default AdminRoute;
