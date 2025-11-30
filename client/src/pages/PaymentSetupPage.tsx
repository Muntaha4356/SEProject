import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Smartphone, Building2, Star } from "lucide-react";
import { useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { useParams } from "react-router-dom";
import { useVerifyCampaign } from "@/hooks/useVerifyCampaign";
import { Navigate } from "react-router-dom";
import { useDonation } from "@/hooks/DonationContext"; 

const PaymentSetupPage = () => {
  const [paymentMethods, setPaymentMethods] = useState({
    stripe: true,
    paypal: false,
    venmo: false,
    applePay: false,
    googlePay: false,
    bankTransfer: false,
  });
  const { amount } = useDonation();
  
  // #123
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { isValid, loading, error: verifyError } = useVerifyCampaign(id);
  const makePayment = async () => {
    setIsLoading(true);
    setPaymentError(null);

    // Ensure Stripe is the selected method (or just proceed if this is the only path)
    if (!paymentMethods.stripe) {
      setPaymentError("Stripe payment method is not enabled.");
      setIsLoading(false);
      return;
    }

    // 2. Prepare payload for the backend
    const payload = {
      amount: amount,
      campaignId: id, // The donation amount in the smallest currency unit
      currency: 'usd', // Assuming USD
    };


    try {
      // 3. Call the backend API route
      const response = await fetch(`${API_BASE_URL}/api/pay/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP errors or custom errors from the donateOnline controller
        throw new Error(data.error || 'Failed to initiate payment. Check server logs.');
      }

      // 4. Redirect the user to the Stripe Checkout page
      if (data.url) {
        // This is where the magic happens! Stripe takes over.
        window.location.href = data.url;
        // Note: We intentionally leave isLoading true here as the user is navigating away.
      } else {
        throw new Error('Stripe Checkout URL missing from response.');
      }

    } catch (e) {
      console.error("Payment initiation error:", e);
      setPaymentError(e.message || 'An unknown network error occurred during payment setup.');
      setIsLoading(false);
    }
  }


  const methods = [
    {
      id: "stripe",
      name: "Stripe",
      icon: CreditCard,
      description: "Credit & debit cards",
      recommended: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: DollarSign,
      description: "PayPal account",
      recommended: false,
    },
    {
      id: "venmo",
      name: "Venmo",
      icon: Smartphone,
      description: "Venmo mobile payments",
      recommended: false,
    },
    {
      id: "applePay",
      name: "Apple Pay",
      icon: Smartphone,
      description: "Apple Pay wallet",
      recommended: false,
    },
    {
      id: "googlePay",
      name: "Google Pay",
      icon: Smartphone,
      description: "Google Pay wallet",
      recommended: false,
    },
    {
      id: "bankTransfer",
      name: "Bank Transfer",
      icon: Building2,
      description: "Direct bank transfer",
      recommended: false,
    },
  ];

  const handleToggle = (methodId: string) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [methodId]: !prev[methodId as keyof typeof prev],
    }));
  };

  if (loading) return <div className="p-8">Verifying campaign...</div>;
if (!loading && isValid === false) {
  return <Navigate to="/invalid-campaign" replace />;
}

  return (

    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
        <p className="text-muted-foreground">
          Choose how you want to receive donations from your supporters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => {
          const Icon = method.icon;
          const isEnabled = paymentMethods[method.id as keyof typeof paymentMethods];

          return (
            <Card
              key={method.id}
              className={`p-6 rounded-xl shadow-soft hover:shadow-medium transition-all ${isEnabled ? "ring-2 ring-primary" : ""
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {method.name}
                      {method.recommended && (
                        <Badge className="bg-gradient-primary text-primary-foreground text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm font-medium">
                  {isEnabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(method.id)}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-6 rounded-xl shadow-soft bg-accent/30 border-primary/20">
        <h3 className="font-semibold mb-2">Setup Instructions</h3>
        <p className="text-sm text-muted-foreground">
          To start accepting payments, you'll need to connect your accounts for each payment method. Click on an enabled method to configure your account details and start receiving donations.
        </p>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={makePayment}
          // onClick = makePayment()
          className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-lg px-8"
        >
          Continue
        </Button>
      </div>
    </div>

  );
};

export default PaymentSetupPage;
