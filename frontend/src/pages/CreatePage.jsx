/* CreatePage.jsx — replaced by CreateTaskPage.
   Redirect kept for safety.
*/
import { Navigate } from "react-router-dom";
export default function CreatePage() {
  return <Navigate to="/tasks/new" replace />;
}