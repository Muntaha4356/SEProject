import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

const AccountInfoPage = () => {
  const { toast } = useToast();
  const {id} = useParams();
  const [formData, setFormData] = useState({
    orgName: localStorage.getItem("orgName") || "Sample Organization",
    website: "https://example.org",
    country: "us",
    phone: "+1 (555) 123-4567",
  });

  const handleSave = () => {
    localStorage.setItem("orgName", formData.orgName);
    toast({
      title: "Settings saved",
      description: "Your account information has been updated successfully.",
    });
  };

  const registrationDate = new Date(2024, 0, 15);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Information</h1>
          <p className="text-muted-foreground">Manage your organization's profile and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-xl shadow-medium">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Organization Logo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl">
                      {formData.orgName.charAt(0)}
                    </div>
                    <Button variant="outline" className="rounded-lg">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Default Country</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-11 text-base font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 rounded-xl shadow-medium">
              <h3 className="font-semibold mb-4">Verification Status</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Account Status</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Your organization has been verified and can accept donations.
              </p>
            </Card>

            <Card className="p-6 rounded-xl shadow-medium">
              <h3 className="font-semibold mb-4">Account Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Registration Date</span>
                  <p className="font-medium">
                    {registrationDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <p className="font-medium">Non-Profit Organization</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountInfoPage;
