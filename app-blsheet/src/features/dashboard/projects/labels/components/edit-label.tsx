import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import CreateLabelForm from "./create-label-form";
import { Label } from "@/types";
import { Button } from "@/components";

interface EditLabel {
  refetch: () => void;
  label: Label;
}

const EditLabel = ({ refetch, label }: EditLabel) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Label</DialogTitle>
        </DialogHeader>
        <CreateLabelForm
          refetch={refetch}
          label={label}
          forUpdate={true}
          closeCreateLabelForm={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditLabel;
