import { useState } from "react";
import { Plus } from "lucide-react";
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

import AddMemberForm from "./add-member-form";
import { useTeamContext } from "../provider/team-provider";

function AddMember() {
  const { team } = useTeamContext();
  const { project } = useProject();
  const { teamId, projectId } = useParams();

  const [open, setOpen] = useState<boolean>(false);

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="h-fit font-medium px-3 py-1.5 rounded-lg w-full sm:w-fit"
          onClick={() => setOpen(true)}
        >
          <Plus />
          <span>Add Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">
            Add member to {team?.name}
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the member you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center w-full">
          <AddMemberForm
            onClose={() => setOpen(false)}
            teamId={teamId as string}
            projectId={projectId as string}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddMember;
