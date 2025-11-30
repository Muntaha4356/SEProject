import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Share2, Check, Trash2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDonation } from "@/hooks/DonationContext";



import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  // const [campaignStatus, setCampaignStatus] = useState<"active" | "inactive">("active");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasRequestedFund, setHasRequestedFund] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({
    donors_count: 0,
    days_active: 0,
    created_at: "",
  });
  const { setAmount } = useDonation();



  const [orgId, setOrgId] = useState(undefined);
  useEffect(() => {
    const fetchOrgId = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/org/getId`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setOrgId(data.orgId.toString());
        } else {
          console.error("Failed to fetch org ID:", data.message);
        }
      } catch (err) {
        console.error("Error fetching org ID:", err);
      }
    };

    fetchOrgId();
  }, []);

  const fetchStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/campaigns/stats/${id}`);
    
    if (!res.ok) {
      throw new Error(`Stats endpoint failed with status ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Stats endpoint did not return JSON");
    }

    const data = await res.json();
    if (data.success) {
      setStats(data.stats);
    } else {
      console.error("Failed to fetch stats:", data.message);
    }
  } catch (err) {
    console.error("Stats fetch error:", err.message);
  }
};




  const handleFundRequest = async () => {

    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/requestfund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: id }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Request failed");

      toast({
        title: "Fund allocation requested",
        description: "Your request has been submitted for review"
      });
      setHasRequestedFund(true);
    } catch (error) {
      console.error("Fund request error:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

  const handleCancelRequest = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/cancelFundRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: id }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Cancel failed");

      toast({ title: "Request Cancelled", description: "Your fund allocation request has been cancelled." });
      setHasRequestedFund(false);
    } catch (error) {
      console.error("Cancel request error:", error);
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

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
          setLoading(false)
          return;
        }

        const normalized = {
          id: data.campaign.id,
          name: data.campaign.name,
          description: data.campaign.description,
          purpose: data.campaign.purpose,
          banner: data.campaign.banner,
          raised: Number(data.campaign.collected_amount) || 0,
          targetAmount: Number(data.campaign.target_amount) || 0,
          status: data.campaign.status,
          createdAt: data.campaign.created_at || new Date().toISOString(),
          hasRequested: data.campaign.has_requested || false,
        };

        setCampaign(normalized);
        setHasRequestedFund(normalized.hasRequested);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);

      }
    };

    fetchCampaign();
  }, [id, navigate]);

  if (loading) return <p>Loading...</p>;

  const progress = (campaign?.raised / campaign?.targetAmount) * 100;
  const presetAmounts = [500, 1000, 5000];
  const donationUrl = `${window.location.origin}/donation-form-creator/${id}`;
  const embedCode = `<iframe src="${donationUrl}" width="100%" height="800" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(donationUrl);
    setCopied(true);
    toast({ title: "Link copied!", description: "Donation link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({ title: "Embed code copied!", description: "You can now paste this in your website" });
  };




  return (
    <>
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/campaigns/${id}`)}
          className="mb-6 rounded-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            <div className="relative w-full h-64 rounded-xl overflow-hidden">
              {campaign?.banner ? (
                <img
                  src={campaign?.banner}
                  alt={campaign?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-muted-foreground">Campaign Banner</span>
                </div>
              )}

              {/* DELETE BUTTON ON TOP RIGHT */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="absolute top-4 right-4 rounded-lg shadow-lg"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>


            {/* Campaign Info */}
            <Card className="p-6 rounded-xl shadow-medium">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold">{campaign?.name}</h1>
                
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">${campaign?.raised.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">
                    raised of ${campaign?.targetAmount.toLocaleString()} goal
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{campaign?.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Purpose</h2>
                  <p className="text-muted-foreground">{campaign?.purpose}</p>
                </div>
              </div>
              <Separator className="my-6" />

              <Button
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-12 text-base font-semibold"
                onClick={hasRequestedFund ? handleCancelRequest : handleFundRequest}
              >
                <DollarSign className="mr-2 h-5 w-5" />
                {hasRequestedFund ? "Cancel Request" : "Request Fund"}
              </Button>



            </Card>


            {/* Donation Form */}
            <Card className="p-8 rounded-xl shadow-medium">
              <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>

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
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-12 text-base font-semibold"
                  onClick={() => {
                    const finalAmount = selectedAmount || Number(customAmount);
                    setAmount(finalAmount);
                    navigate(`/payment-setup/${id}`);
                  }}
                >
                  Donate Now
                </Button>

              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 rounded-xl shadow-medium">
              <h3 className="font-semibold mb-4 flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share Campaign
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    value={donationUrl}
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

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Embed Code</Label>
                  <div className="relative">
                    <textarea
                      value={embedCode}
                      readOnly
                      className="w-full p-3 text-xs bg-muted rounded-lg border border-border font-mono"
                      rows={4}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyEmbed}
                      className="absolute top-2 right-2 rounded-lg"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-medium">
              <h3 className="font-semibold mb-4">Campaign Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Donors</span>
                  <span className="font-semibold">{stats.donors_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Days Active</span>
                  <span className="font-semibold">{stats.days_active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-semibold">
                    {new Date(campaign?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this campaign? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </>
  );
};

export default CampaignDetailsPage;