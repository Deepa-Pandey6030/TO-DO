/* HomePage.jsx — replaced by DashboardPage.
   This redirect exists to avoid broken imports during transition.
*/
import { Navigate } from "react-router-dom";
export default function HomePage() {
  return <Navigate to="/dashboard" replace />;
}