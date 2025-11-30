import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, TrendingUp, Megaphone, AlertCircle } from "lucide-react";
import { useOrg } from "@/context/OrgContext";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { orgId } = useOrg();
  const [metrics, setMetrics] = useState({
    total_donations: 0,
    active_campaigns: 0,
    pending_requests: 0,
  });
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/org/metrics/${orgId}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error("Metrics fetch error:", err);
      }
    };

    if (orgId) fetchMetrics();
  }, [orgId]);

  const metricCards = [
    {
      label: "Total Donations",
      value: metrics.total_donations,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Active Campaigns",
      value: metrics.active_campaigns,
      icon: Megaphone,
      color: "text-primary",
    },
    {
      label: "Pending Verification",
      value: metrics.pending_requests,
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ];

  const steps = [
    { number: "1", title: "Create Campaign", description: "Design your donation form" },
    { number: "2", title: "Connect Payment", description: "Setup payment processing" },
    { number: "3", title: "Share Campaign", description: "Spread the word" },
    { number: "4", title: "Receive Donations", description: "Start making impact" },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Here's what's happening with your campaigns</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="p-6 rounded-xl shadow-soft hover:shadow-medium transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  <div className={cn("w-10 h-10 rounded-lg bg-accent flex items-center justify-center", metric.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{metric.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Get Started Section */}
        <Card className="p-8 rounded-xl shadow-medium mb-8 bg-gradient-to-br from-accent/50 to-background border-primary/20">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Launch Your First Campaign</h2>
            <p className="text-muted-foreground max-w-md">
              Get started in minutes with our simple campaign builder
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              onClick={() => navigate("/create-campaign")}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-12 px-8 text-base font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Campaign
            </Button>
          </div>
        </Card>

        {/* Steps Guide */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 rounded-xl shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default DashboardPage;
