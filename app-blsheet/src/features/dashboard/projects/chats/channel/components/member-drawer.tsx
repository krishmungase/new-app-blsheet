import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Member } from "@/types";

import MemberCard from "./member-card";
import AddMember from "./add-member";

interface AssignMemberProps {
  members: Member[];
  refetch: () => void;
  projectId: string;
  channelId: string;
}

const MemberDrawer = ({
  members,
  refetch,
  channelId,
  projectId,
}: AssignMemberProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="hover:bg-muted rounded-md cursor-pointer flex items-center gap-1 px-2 py-1"
          onClick={() => setOpen(true)}
        >
          <UserPlus size={12} />
          <span className="text-sm">Member</span>
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">Add Members</SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <div className="sm:bg-active/10 sm:rounded-lg sm:border sm:border-active/10 sm:p-6 space-y-4">
          <AddMember
            channelId={channelId}
            projectId={projectId}
            refetch={refetch}
          />
          {members?.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {members.map((member) => (
                <MemberCard
                  projectId={projectId}
                  channelId={channelId}
                  key={member._id}
                  member={member}
                  refetch={refetch}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center text-sm font-medium text-center">
              No members in this channel
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MemberDrawer;
