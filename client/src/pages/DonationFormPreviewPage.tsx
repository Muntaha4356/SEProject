import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDonation } from "@/hooks/DonationContext";
const DonationFormPreviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#827ebf");
  const [backgroundColor, setBackgroundColor] = useState("#F8F9FC");
  const [copied, setCopied] = useState(false);
  const { setAmount } = useDonation();
  // const campaignData = JSON.parse(localStorage.getItem("campaignData") || '{"name":"Campaign","targetAmount":"10000"}');
  const [campaignData, setCampaignData] = useState<any>({});
  const raised = Number(campaignData?.collected_amount || 0);
  const targetAmount = Number(campaignData?.target_amount || 0);

  const progress = targetAmount > 0 ? (raised / targetAmount) * 100 : 0;
  const remaining = Math.max(targetAmount - raised, 0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const presetAmounts = [500, 1000, 5000];
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const campaignUrl = `http://localhost:8080/donation-form-preview/${id}`;

  useEffect(() => {
    if (!id) {
      navigate(`/donation-form-creator/${id}`);
      return;
    }

    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/campaigns/info/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch campaign:", data);
          return;
        }

        setCampaignData(data.campaign);
        console.log(campaignData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCampaign();
  }, [id, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Campaign link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Support our campaign: ${campaignData.name}`;
    const url = campaignUrl;

    const urls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <div className="p-8">


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card className="p-8 rounded-xl shadow-medium" style={{ backgroundColor }}>
            <div className="mb-6">
              {campaignData.banner ? (
                <img
                  src={campaignData.banner}
                  alt={campaignData.name}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-muted-foreground">Campaign Banner</span>
                </div>
              )}

              <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                {campaignData.name}
              </h1>

              <p className="text-muted-foreground mb-6">
                {campaignData.description}
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">${raised.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">
                    raised of ${targetAmount.toLocaleString()} goal
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  ${remaining.toLocaleString()} remaining to reach goal
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-4 block">Select Amount</Label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className="rounded-lg h-12 text-base font-semibold"
                      style={
                        selectedAmount === amount
                          ? { backgroundColor: primaryColor, color: "white" }
                          : {}
                      }
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="rounded-lg"
                />
              </div>

              <Button
                className="w-full rounded-lg h-12 text-base font-semibold"
                style={{ backgroundColor: primaryColor, color: "white" }}
                onClick={() => {
                  const finalAmount = selectedAmount || Number(customAmount);
                  // Guard: must be a positive number
                  if (!finalAmount || finalAmount <= 0) {
                    toast({
                      variant: "destructive",
                      title: "Invalid donation amount",
                      description: "Please select or enter a valid amount before continuing.",
                    });
                    return; // stop here
                  }
                  setAmount(finalAmount);
                  navigate(`/payment-setup/${id}`);
                }}
              >
                Donate Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Customization Panel */}
        <div className="space-y-6">

          <Card className="p-6 rounded-xl shadow-medium">
            <h3 className="font-semibold mb-4 flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share Campaign
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={campaignUrl}
                  readOnly
                  className="rounded-lg text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="rounded-lg shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <Separator />

              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="w-full rounded-lg"
              >
                Share on WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={() => handleShare("facebook")}
                className="w-full rounded-lg"
              >
                Share on Facebook
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>

  );
};

export default DonationFormPreviewPage;