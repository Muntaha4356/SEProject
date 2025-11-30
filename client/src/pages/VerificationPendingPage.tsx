import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Clock, Bell } from "lucide-react";

const VerificationPendingPage = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="p-12 rounded-xl shadow-soft max-w-2xl w-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-6 relative">
              <Clock className="w-12 h-12 text-primary" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Verification Pending</h1>
            
            <p className="text-muted-foreground text-lg mb-6 max-w-md">
              Your campaign is currently under review. You will be notified once the campaign is verified and approved.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-6 w-full">
              <h3 className="font-semibold mb-3 text-left">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground text-left">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Our team will review your campaign details and supporting documents</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You'll receive an email notification once the review is complete</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>This process typically takes 24-48 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VerificationPendingPage;
