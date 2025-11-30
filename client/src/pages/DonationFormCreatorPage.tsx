import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Wand2, ArrowLeft } from "lucide-react";


const DonationFormCreatorPage = () => {
  const navigate = useNavigate();
  const [font, setFont] = useState("inter");
  const { id } = useParams() ;
  const [loading, setLoading] = useState(true);

  interface Campaign {
  id: number;
  organization_id: number;
  name: string;
  purpose: string;
  description: string;
  target_amount: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  status: string | null;
  admin_id: number | null;
  banner: string;
  collected_amount: number;
}

const [campaignData, setCampaignData] = useState<Campaign | null>(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!id) {
      navigate("/create-campaign");
      return;
    }

    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campaigns/info/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch campaign:", data);
          navigate("/create-campaign");
          return;
        }

        setCampaignData(data.campaign); 
        localStorage.setItem("campaignData", JSON.stringify({ ...data.campaign, font }));
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/create-campaign");
      }
    };

    fetchCampaign();
  }, [id, navigate]);

  const handleGenerate = () => {
    if (!campaignData) return;
    const updatedData = { ...campaignData, font };
    localStorage.setItem("campaignData", JSON.stringify(updatedData));
    navigate(`/donation-form-preview/${id}`);
  };

  if (loading) {
    return (
        <div className="p-8 text-center text-lg">Loading campaign...</div>
      
    );
  }

  if (!campaignData) {
    return null;
  }

  return (
      <div className="p-8">
        {/* <Button
          variant="ghost"
          onClick={() => navigate("/create-campaign")}
          className="mb-6 rounded-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaign Details
        </Button> */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customize Donation Form</h1>
          <p className="text-muted-foreground">Choose how your donation form looks</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 rounded-xl shadow-medium">
            <div className="mb-6 p-4 bg-accent/20 rounded-lg">
              <h3 className="font-semibold mb-2">Campaign Summary</h3>
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Name:</span> {campaignData.name}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Goal:</span> ${campaignData.target_amount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="font">Form Font</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="open-sans">Open Sans</SelectItem>
                    <SelectItem value="lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-11 text-base font-semibold mt-6"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Continue to Customize Form
              </Button>
            </div>
          </Card>

          <Card className="mt-6 p-6 rounded-xl shadow-soft bg-accent/30 border-primary/20">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              Next, you'll be able to customize colors and configure donation amounts before sharing your campaign with supporters.
            </p>
          </Card>
        </div>
      </div>
  );
};

export default DonationFormCreatorPage;
