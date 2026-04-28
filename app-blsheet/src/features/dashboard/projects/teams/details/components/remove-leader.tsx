import { useState } from "react";
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

import { useTeamContext } from "../provider/team-provider";
import useAddOrRemoveLeader from "../hooks/use-add-or-remove-leader";
import useProject from "@/hooks/use-project";
import { MemberRole } from "@/types";

interface RemoveLeaderProps {
  teamId: string;
  projectId: string;
  memberId: string;
}

const RemoveLeader = ({ projectId, teamId, memberId }: RemoveLeaderProps) => {
  const { refetchTeam } = useTeamContext();
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useAddOrRemoveLeader({
    refetchTeam,
    onClose: () => {},
    isRemove: true,
  });

  const handleRemove = () => {
    mutate({ data: { projectId, teamId, memberId, isRemove: true } });
  };

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="text-red-500 hover:text-red-500/80 transition-all"
        >
          <Trash2 size={15} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Leader?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this leader?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span> Remove</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveLeader;
