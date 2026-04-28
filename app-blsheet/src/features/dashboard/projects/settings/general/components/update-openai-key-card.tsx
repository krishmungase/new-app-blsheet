import { Copy } from "lucide-react";

import { toast } from "@/hooks";
import { Project } from "@/types";
import { Input } from "@/components/ui/input";

import UpdateOpenAIKey from "./update-openai-key";
import RemoveOpenAIKey from "./remove-openai-key";

interface UpdateOpenAIKeyProps {
  project: Project;
  refetchProject: () => void;
}

const UpdateOpenAIKeyCard = ({
  project,
  refetchProject,
}: UpdateOpenAIKeyProps) => {
  if (!project) return null;

  return (
    <div className="relative space-y-1 bg-muted rounded-lg border">
      <div className="flex items-center justify-between space-x-2 border-b border-muted-foreground/40 p-3 ">
        <h1 className="text-[15px] font-medium text-foreground">OpenAI Key</h1>
        <div className="flex items-center justify-center gap-3">
          {project?.openAiKey && (
            <RemoveOpenAIKey
              projectId={project?.projectId}
              refetchProject={refetchProject}
            />
          )}
          <UpdateOpenAIKey project={project} refetchProject={refetchProject} />
        </div>
      </div>
      <div className="flex items-center justify-between space-x-3 p-3 ">
        {project.openAiKey ? (
          <>
            <Input value={project?.openAiKey} disabled />
            <button
              className="bg-muted-foreground/20 rounded-md border p-2 hover:bg-muted-foreground/30 transition-all"
              onClick={() => {
                navigator.clipboard.writeText(project?.openAiKey as string);
                toast({
                  title: "OpenAI Key",
                  description: "OpenAI Key copied successfully",
                  variant: "default",
                });
              }}
            >
              <Copy size={15} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            Please add OpenAI key
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateOpenAIKeyCard;
