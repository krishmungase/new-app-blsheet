import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TeamForm from "./team-form";

interface CreateTeamProps {
  refetch: () => void;
  projectId: string;
}

function CreateTeam({ refetch, projectId }: CreateTeamProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="h-fit px-3 py-1.5 rounded-lg w-full sm:w-fit font-normal"
          onClick={() => setOpen(true)}
        >
          <Plus />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">Create Team</DialogTitle>
        </DialogHeader>
        <div className="flex items-center w-full">
          <TeamForm
            refetch={refetch}
            projectId={projectId}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeam;
