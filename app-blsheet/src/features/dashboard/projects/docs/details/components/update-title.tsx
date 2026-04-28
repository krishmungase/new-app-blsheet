import { useState } from "react";
import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import RenameTitleForm from "../../forms/rename-title-form";

function UpdateTitle({ title }: { title: string }) {
  const { projectId, docId } = useParams();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-green-500 hover:text-green-500/80"
          onClick={() => setOpen(true)}
        >
          <Edit size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">
            Rename Document
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center w-full">
          <RenameTitleForm
            projectId={projectId as string}
            docId={docId as string}
            title={title}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateTitle;
