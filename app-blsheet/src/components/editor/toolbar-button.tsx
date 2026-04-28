import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ToolbarButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  isActive?: boolean;
}

const ToolbarButton = ({
  icon: Icon,
  onClick = () => {},
  isActive,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-primary/10",
        isActive && "bg-primary/10"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export default ToolbarButton;
