import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCreateChannel from "../channel/hooks/use-create-channel";
import { toast } from "@/hooks";
import { useParams } from "react-router-dom";

interface CreateChannelProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: () => void;
}

const CreateChannel = ({ open, setOpen, refetch }: CreateChannelProps) => {
  const { projectId } = useParams();
  const [value, setValue] = useState<string>("");
  const { mutate, isLoading } = useCreateChannel({
    callAfterSuccess: () => {
      setOpen(false);
      refetch();
    },
  });

  const handleOnSubmit = () => {
    if (!value) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter channel name",
      });
      return;
    }

    mutate({ data: { name: value.replace(/\s+/g, "-"), projectId } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">Create New Channel</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-start gap-4">
          <Input
            id="fullName"
            placeholder="e.g.general"
            value={value}
            className="col-span-3"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleOnSubmit}>
            {isLoading && <Loader2 className="animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
