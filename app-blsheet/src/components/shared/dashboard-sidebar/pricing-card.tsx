import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { PricingInfo } from "@/constants";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const PricingCard = () => {
  const { open } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className={cn("bg-muted border p-4 rounded-md", !open && "hidden")}>
      <h1 className="font-medium mb-2">{user?.pricingModel} Plan</h1>
      <ul className="list-disc ml-6 text-sm">
        <li>{PricingInfo[user?.pricingModel].projectCount} Project </li>
        <li>{PricingInfo[user?.pricingModel].memberCount} Members</li>
      </ul>

      <div className="mt-4">
        <Button onClick={() => navigate("/pricing")} className="w-full">
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
