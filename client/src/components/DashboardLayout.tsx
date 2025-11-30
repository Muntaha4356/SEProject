import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LayoutDashboard, Megaphone, Users, CreditCard, UserCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState(undefined);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
  const fetchOrgId = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/org/getId`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setId(data.orgId.toString());
      } else {
        console.error("Failed to fetch org ID:", data.message);
      }
    } catch (err) {
      console.error("Error fetching org ID:", err);
    } 
  };

  fetchOrgId();
}, []);

if (!id) return <p>Organization ID not found</p>;


  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: `/dashboard/${id}` },
    { icon: Megaphone, label: "Your Campaigns", path: `/campaigns/${id}` },
    // { icon: Users, label: "Team Members", path: "/team" },
    { icon: UserCircle, label: "Account Info", path: `/account/${id}` },
  ];

  const handleLogout = async() => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/org/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.clear();
        window.location.reload();
        navigate("/signup");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">FundRaise</h2>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full justify-start rounded-lg transition-all",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
          <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
        </nav>

        
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
