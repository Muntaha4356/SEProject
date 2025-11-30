import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type OrgContextType = {
  loading: boolean;
  isOrgAuth: boolean;
  orgId: string | null;
};

const OrgContext = createContext<OrgContextType>({
  loading: true,
  isOrgAuth: false,
  orgId: null,
});

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isOrgAuth, setIsOrgAuth] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/org/auth`, {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();

        setIsOrgAuth(data.authenticated);
        setOrgId(data.organization_id || null);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsOrgAuth(false);
        setOrgId(null);
      }
      setLoading(false);
    };
    check();
  }, []);

  return (
    <OrgContext.Provider value={{ loading, isOrgAuth, orgId }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => useContext(OrgContext);
