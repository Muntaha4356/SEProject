import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CampaignNotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Campaign Doesn't Exist
          </h1>
          <p className="text-lg text-muted-foreground">
            Donation Not Possible
          </p>
        </div>

        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          The campaign you're looking for could not be found. It may have been removed or the link might be incorrect.
        </p>

        <div className="pt-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignNotFoundPage;