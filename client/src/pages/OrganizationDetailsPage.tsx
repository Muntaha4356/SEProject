import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
// import { useOrgAuth } from "@/Authorization/useOrgAuth";

const OrganizationDetailsPage = () => {
  const navigate = useNavigate();
  const orgName = localStorage.getItem("orgName") || "Your Organization";
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    orgType: "",
    website: "",
    about: "",
    country: "",
    phone: "",
    office_address:"",
    serial_num:"",
  });

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const step1 = JSON.parse(localStorage.getItem("signup_step1"));

    const finalPayload = {
    name: step1.orgName,
    org_email: step1.email,
    password: step1.password,
    subscribed: step1.mailingList,   // true/false
    org_type: formData.orgType,
    website_url: formData.website,
    about: formData.about,
    country: formData.country,
    phone_number: formData.phone,
    office_address: formData.office_address,
    serial_number: formData.serial_num,
  };
    try {
    const res = await fetch(`${API_BASE_URL}/api/org/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ⬅ IMPORTANT if backend sets cookies
      body: JSON.stringify(finalPayload),
    });

    const data = await res.json();
    if (data.success) {
      console.log("meow")
      localStorage.removeItem("signup_step1");
      window.location.reload();
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error("Signup error", error);
    alert("Something went wrong.");
  }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mr-3">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg">{orgName}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 text-sm mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">✓</div>
              <span className="text-muted-foreground">Account</span>
            </div>
            <div className="w-12 h-0.5 bg-primary"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</div>
              <span className="font-medium">Details</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Tell Us About Your Cause</h1>
          <p className="text-center text-muted-foreground">Help us understand your mission better</p>
        </div>

        <Card className="p-8 shadow-medium rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Organization Details</h2>
              
              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type</Label>
                <Select value={formData.orgType} onValueChange={(value) => setFormData({ ...formData, orgType: value })}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                    <SelectItem value="charity">Charity</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                    <SelectItem value="community">Community Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourorganization.com"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Office Address</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.office_address}
                  onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
                  placeholder="Street 2, Dt.London"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Serial Number</Label>
                <Input
                  id="website"
                  type="text"
                  value={formData.serial_num}
                  onChange={(e) => setFormData({ ...formData, serial_num: e.target.value })}
                  placeholder="19826"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Your Mission</h2>
              
              <div className="space-y-2">
                <Label htmlFor="about">About Your Organization</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Describe your organization's mission and values..."
                  rows={4}
                  className="rounded-lg resize-none"
                  required
                />
              </div>

              
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Contact Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select your country" />
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
                  placeholder="+1 (555) 000-0000"
                  className="rounded-lg"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-11 text-base font-semibold mt-8">
              Complete Setup
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDetailsPage;
