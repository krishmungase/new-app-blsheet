import { Link, useParams } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { Member } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MemberItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal px-4 h-7 px-[18px] text-sm overflow-hidden",
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

interface MemberItemProps {
  id: string;
  member: Member;
  variant?: VariantProps<typeof MemberItemVariants>["variant"];
}

const MemberItem = ({ id, member, variant }: MemberItemProps) => {
  const { projectId } = useParams();
  return (
    <Button
      asChild
      variant="transparent"
      size="sm"
      className={cn(MemberItemVariants({ variant }))}
    >
      <Link
        to={`/dashboard/chats/${projectId}/conversation/${id}`}
        className="w-full"
      >
        <Avatar className="bg-primary size-5 shrink-0">
          <AvatarImage src={member?.user?.avatar?.url} alt="profile" />
          <AvatarFallback className="flex bg-foreground items-center justify-center w-full text-xs h-full text-card">
            {member?.user?.fullName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{member?.user?.fullName}</span>
      </Link>
    </Button>
  );
};

export default MemberItem;
