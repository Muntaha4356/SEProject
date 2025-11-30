import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purpose: "",
    targetAmount: 0,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.purpose ||
      !formData.targetAmount ||
      !bannerPreview
    ) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill out all required fields before submitting.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/create`, {
        method: "POST",
        credentials: "include", // VERY IMPORTANT → allows cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          purpose: formData.purpose,
          targetAmount: formData.targetAmount,
          banner: bannerPreview,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Campaign creation failed",
          description: data.error || "Something went wrong. Please check your inputs.",
        });
        return;
      }


      console.log(data)
      // Store the returned campaign for next page
      localStorage.setItem("campaignData", JSON.stringify(data.campaign));
      const campaignId = data.campaign.id;

      navigate(`/verification`);

    } catch (err) {
      console.error("Request error:", err);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Unable to reach the server. Please try again later.",
      });
    }
  };


  return (
    <DashboardLayout>
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground">Fill in the details for your fundraising campaign</p>
        </div>

        <Card className="p-8 rounded-xl shadow-medium max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter campaign name"
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your campaign"
                required
                className="rounded-lg min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="What will the funds be used for?"
                required
                className="rounded-lg min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Campaign Banner *</Label>
              {!bannerPreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    id="banner"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleBannerChange}
                    className="hidden"
                    required
                  />
                  <label htmlFor="banner" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload campaign banner
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accepts .jpg, .jpeg, .png, .webp
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-64 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount ($) *</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({ ...formData, targetAmount: Number(e.target.value) })
                }
                placeholder="10000"
                required
                min="1"
                className="rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-12 text-base font-semibold"
            >
              Continue to Form Creator
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCampaignPage;
