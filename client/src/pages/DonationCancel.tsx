import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DonationCancel = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <XCircle className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Donation Cancelled</CardTitle>
          <CardDescription>Your donation was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            No charges were made. You can try again anytime.
          </p>
          <Link to="/" className="block">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationCancel;