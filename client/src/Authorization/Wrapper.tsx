// import { useOrg } from "@/context/OrgContext";
// import { Navigate } from "react-router-dom";

// export function ProtectedRoute({ isAuth, children }: any) {
//   const { loading, isOrgAuth, orgId } = useOrg();
//   if (!isAuth) return <Navigate to="/signin" replace />;
//   return children;
// }

// export function GuestRoute({ isAuth, children }: any) {

//   const { loading, isOrgAuth, orgId } = useOrg();

//   if (loading) return <p>Loading...</p>;

//   if (isOrgAuth) {
//     // ✅ You can even redirect to org-specific dashboard
//     return <Navigate to={`/dashboard/${orgId}`} replace />;
//   }
//   return children;
// }



import { Navigate } from "react-router-dom";
import { useOrg } from "@/context/OrgContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isOrgAuth } = useOrg();

  if (loading) return <p>Loading...</p>;

  if (!isOrgAuth) return <Navigate to="/signin" replace />;

  return children;
}


export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { loading, isOrgAuth, orgId } = useOrg();

  if (loading) return <p>Loading...</p>;

  if (isOrgAuth) {
    return <Navigate to={`/dashboard/${orgId}`} replace />;
  }

  return children;
}
