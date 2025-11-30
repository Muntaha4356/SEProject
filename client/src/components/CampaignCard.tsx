import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


interface CampaignCardProps {
  id: string;
  name: string;
  description: string;
  banner: string;
  targetAmount: number;
  raised: number;
  status: "active" | "completed" | "pending";

}

const CampaignCard = ({ id, name, description, banner, targetAmount, raised, status }: CampaignCardProps) => {

  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const progress = (raised / targetAmount) * 100;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const handleClick = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/campaigns/verify-ownership/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      console.log("isOwner:", data.isOwner);

      if (data.success && data.isOwner) {
        navigate(`/campaign/${id}`);
      } else {
        navigate(`/donation-form-preview/${id}`);
      }

    } catch (err) {
      console.error("Ownership check failed:", err);
    }
  };


  const statusColors = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    pending: "bg-orange-500",
  };


  return (

    // <Link to={link}>

    <Card
      onClick={handleClick}
      className="overflow-hidden rounded-xl shadow-soft hover:shadow-medium transition-all cursor-pointer hover:-translate-y-1"
    >
      <div className="relative w-full">
        {banner ? (
          <div className="h-64 w-full overflow-hidden">
            <img
              src={banner}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-primary/10 h-64">
            <span className="text-muted-foreground">No banner</span>
          </div>
        )}
        <Badge className={`absolute top-3 right-3 ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>


      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">${raised.toLocaleString()}</span>
            <span className="text-muted-foreground">
              of ${targetAmount.toLocaleString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}% funded
          </p>
        </div>
      </div>
    </Card>
    // </Link>
  );
};

export default CampaignCard;