import { useState } from "react";
import { Plus, Edit } from "lucide-react";
import { useParams } from "react-router-dom";

import { MemberRole } from "@/types";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useProject from "@/hooks/use-project";

import { useTeamContext } from "../provider/team-provider";
import AddLeaderForm from "./add-leader-form";

function AddLeader({ isUpdate = false }: { isUpdate?: boolean }) {
  const { team } = useTeamContext();
  const { project } = useProject();
  const { teamId, projectId } = useParams();

  const [open, setOpen] = useState<boolean>(false);

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <button
            onClick={() => setOpen(true)}
            className="text-green-500 hover:text-green-500/80 transition-all"
          >
            <Edit size={15} />
          </button>
        ) : (
          <Button
            variant="outline"
            className="h-fit font-medium px-3 py-1.5 rounded-lg w-full sm:w-fit"
            onClick={() => setOpen(true)}
          >
            <Plus />
            <span>{isUpdate ? "Update" : "Add"} Leader</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">
            {isUpdate ? "Update" : "Add"} leader to {team?.name}
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the member you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center w-full">
          {team?.members.length ? (
            <AddLeaderForm
              onClose={() => setOpen(false)}
              teamId={teamId as string}
              projectId={projectId as string}
            />
          ) : (
            <div className="text-center py-2 text-sm text-red-500 w-full">
              No member added yet. Please add a team member to get started!
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddLeader;
