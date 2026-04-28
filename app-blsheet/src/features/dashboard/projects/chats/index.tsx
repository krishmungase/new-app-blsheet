import { AlertTriangle, Loader2 } from "lucide-react";
import useGetChannels from "./channel/hooks/use-get-channels";
import { useUpdateDocumentTitle } from "@/hooks";
import useProject from "@/hooks/use-project";

const ProjectChatPage = () => {
  const { project } = useProject();
  const { loadingChannels, channels } = useGetChannels();

  useUpdateDocumentTitle({ title: `Chat - ${project?.name}` });

  if (loadingChannels) {
    return (
      <div className="h-full flex items-center gap-y-2 flex-col justify-center">
        <Loader2 className="animate-spin" />
        <span>Wait for featching channels.</span>
      </div>
    );
  }

  if (!channels?.length) {
    return (
      <div className="h-full flex items-center gap-y-2 flex-col justify-center">
        <AlertTriangle />
        <span>Channels not found please create channel.</span>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      Please choose a channel to continue.
    </div>
  );
};

export default ProjectChatPage;
