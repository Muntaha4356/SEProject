import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    mailingList: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store org name for next step
     localStorage.setItem("signup_step1", JSON.stringify(formData));
    navigate("/organization-details");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-medium rounded-xl">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">Create Your Account</h1>
        <p className="text-center text-muted-foreground mb-6">Start making a difference today</p>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</div>
              <span className="font-medium">Account</span>
            </div>
            <div className="w-12 h-0.5 bg-border"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">2</div>
              <span className="text-muted-foreground">Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              placeholder="Enter organization name"
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Organization Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@organization.com"
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a strong password"
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
              className="rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the Terms & Conditions
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="mailingList"
              checked={formData.mailingList}
              onCheckedChange={(checked) => setFormData({ ...formData, mailingList: checked as boolean })}
            />
            <label htmlFor="mailingList" className="text-sm text-muted-foreground cursor-pointer">
              Subscribe to our mailing list
            </label>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg h-11 text-base font-semibold mt-6">
            Continue
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
