import { useEffect, useState } from "react";

export function useVerifyCampaign(campaignId: string | undefined) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const verify = async () => {
      if (!campaignId) {
        setError("Campaign ID is missing");
        setIsValid(false);
        setLoading(false);
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_BASE_URL}/api/campaigns/verify-campId/${campaignId}`);
        clearTimeout(timeout);

        const data = await res.json();

        if (!res.ok) {
          setIsValid(false);
          setError(data.message || "Campaign not found");
          return;
        }
        if (data.success && data.campaign?.status === "active") {
          setIsValid(true);
        } else {
          setIsValid(false);
          setError(data.message || "Campaign is not active");
        }
      } catch (err) {
        if (err.name === "AbortError") {
          setError("Verification timed out");
        }
        console.error("Verification error:", err);
        setError("Server error during campaign verification");
        setIsValid(false);
      }

      setLoading(false);
    };

    verify();
  }, [campaignId]);

  return { isValid, loading, error };
}
