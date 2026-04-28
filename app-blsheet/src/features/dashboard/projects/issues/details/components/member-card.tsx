import { Trash2, LoaderCircle } from "lucide-react";
import { Button } from "@/components";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Member } from "@/types";

import useRemoveMember from "../hooks/use-remove-member";

interface MemberCardProps {
  member: Member;
  refetchIssues: () => void;
  issueId: string;
  projectId: string;
}

const MemberCard = ({
  member,
  refetchIssues,
  projectId,
  issueId,
}: MemberCardProps) => {
  const [open, setOpen] = useState(false);
  const { isLoading, mutate } = useRemoveMember({ refetchIssues });

  const handleRemove = () => {
    mutate({ data: { projectId, memberId: member._id, issueId } });
  };

  return (
    <div className="flex items-center justify-between px-2 py-1 bg-muted-foreground/20 border rounded-sm w-full">
      <span className="text-primary text-sm truncate">{member.email}</span>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="text-red-500 hover:text-red-500/80 transition-all">
            {false ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove member?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <Button variant="destructive" onClick={handleRemove}>
              {isLoading && (
                <LoaderCircle className="ml-2 size-4 animate-spin" />
              )}
              <span> Remove</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemberCard;
