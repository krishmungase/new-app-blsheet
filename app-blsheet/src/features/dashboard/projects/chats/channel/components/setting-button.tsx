import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit, Settings } from "lucide-react";
import { Channel, Member, MemberRole } from "@/types";

import DeleteChannel from "./delete-channel";
import { useParams } from "react-router-dom";
import { useState } from "react";
import UpdateChannel from "./update-channel";
import useProject from "@/hooks/use-project";
import MemberDrawer from "./member-drawer";

interface SettingButtonProps {
  channel: Channel;
  refetch: () => void;
  members: Member[];
}

const SettingButton = ({ channel, refetch, members }: SettingButtonProps) => {
  const { project } = useProject();
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);

  if (project?.role === MemberRole.MEMBER) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="iconSm" variant="transparent" className="group">
          <Settings className="transition-transform" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        <div className="flex flex-col gap-1">
          <button
            className="hover:bg-muted rounded-md cursor-pointer flex items-center gap-1 px-2 py-1"
            onClick={() => setOpen(true)}
          >
            <Edit size={12} />
            <span className="text-sm">Edit</span>
          </button>
          <MemberDrawer
            projectId={projectId as string}
            refetch={refetch}
            members={members}
            channelId={channel._id}
          />
          <UpdateChannel
            open={open}
            setOpen={setOpen}
            refetch={refetch}
            channel={channel}
          />
          <DeleteChannel
            channelId={channel._id}
            projectId={projectId as string}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingButton;
