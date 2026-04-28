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

import useProject from "@/hooks/use-project";
import { MemberRole } from "@/types";
import useDeleteTeam from "../hooks/use-delete-team";

interface DeleteTeamProps {
  teamId: string;
  projectId: string;
  refetchTeams: () => void;
}

const DeleteTeam = ({ projectId, teamId, refetchTeams }: DeleteTeamProps) => {
  const { project } = useProject();
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = useDeleteTeam({
    refetch: refetchTeams,
    onClose: () => {},
  });

  const handleRemove = () => {
    mutate({ data: { projectId, teamId } });
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
          <AlertDialogTitle>Delete Team?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this team?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleRemove}>
            {isLoading && <LoaderCircle className="ml-2 size-4 animate-spin" />}
            <span> Delete</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTeam;
