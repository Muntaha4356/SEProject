import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DonationSuccessPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>Your donation was successful</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We greatly appreciate your generous contribution. Your support helps us make a difference.
          </p>
          <Link to="/" className="block">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccessPage;
