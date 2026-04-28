import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Link, useParams } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components";
import { cn } from "@/lib/utils";

const SidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:bg-primary/10",
        active: "text-primary bg-primary/10 hover:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof SidebarItemVariants>["variant"];
}

const SidebarItem = ({ label, id, icon: Icon, variant }: SidebarItemProps) => {
  const { projectId } = useParams();
  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(SidebarItemVariants({ variant }))}
    >
      <Link to={`/dashboard/chats/${projectId}/channels/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
