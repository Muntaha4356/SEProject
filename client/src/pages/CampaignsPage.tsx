import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import CampaignCard from "@/components/CampaignCard";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";


const CampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(true);
  const {id} = useParams();

  // Mock campaigns - in real app, fetch from backend
  // const campaigns = [
  //   {
  //     id: "camp1",
  //     name: "Support Education for Children",
  //     description: "Help us provide quality education and resources to children who need it most.",
  //     banner: "",
  //     targetAmount: 10000,
  //     raised: 3500,
  //     status: "active" as const,
  //   },
  //   {
  //     id: "camp2",
  //     name: "Clean Water Initiative",
  //     description: "Bringing clean drinking water to communities in need.",
  //     banner: "",
  //     targetAmount: 15000,
  //     raised: 8200,
  //     status: "active" as const,
  //   },
  // ];

  useEffect(() => {
  const fetchCampaigns = async () => {
    try {

      const res = await fetch(`${API_BASE_URL}/api/campaigns/getcampoforg`, {
        method: "POST",
        credentials: "include", // IMPORTANT so cookies (token) are sent
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      const data = await res.json();

      if (res.ok && data.success) {
        console.log(data)
        const transformed = data.campaigns.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.purpose, // assuming 'purpose' is used as description
          banner: c.banner || "", // fallback if banner is missing
          targetAmount: Number(c.target_amount) || 0,
          raised: Number(c.collected_amount) || 0,
          status: c.status || "active",
        }));
        
        setCampaigns(transformed);
      } else {
        console.error("Failed to fetch campaigns:", data.message);
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchCampaigns();
}, [id]);


  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Campaigns</h1>
          <Button
            onClick={() => navigate("/create-campaign")}
            className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No campaigns yet. Create your first campaign to get started!</p>
            <Button
              onClick={() => navigate("/create-campaign")}
              className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignsPage;