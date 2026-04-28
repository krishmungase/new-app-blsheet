import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateTeamForm from "../forms/create-doc-form";

function CreateDoc() {
  const { projectId } = useParams();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="w-full sm:w-fit"
          size="sm"
          onClick={() => setOpen(true)}
        >
          New Doc
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">
            Create Document
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center w-full">
          <CreateTeamForm projectId={projectId as string} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDoc;
