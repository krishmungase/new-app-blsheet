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

import { toast } from "@/hooks";
import { useParams } from "react-router-dom";

import { Channel } from "@/types";
import useUpdateChannel from "../hooks/use-update-channel";
import useGetChannels from "../hooks/use-get-channels";

interface UpdateChannelProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: () => void;
  channel: Channel;
}

const UpdateChannel = ({
  open,
  setOpen,
  refetch,
  channel,
}: UpdateChannelProps) => {
  const { refetchChannels } = useGetChannels();
  const { projectId } = useParams();
  const [value, setValue] = useState<string>(channel.name);
  const { mutate, isLoading } = useUpdateChannel({
    callAfterSuccess: () => {
      setOpen(false);
      refetchChannels();
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

    mutate({
      data: {
        name: value.replace(/\s+/g, "-"),
        projectId,
        channelId: channel._id,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">Edit Channel Name</DialogTitle>
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
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChannel;
