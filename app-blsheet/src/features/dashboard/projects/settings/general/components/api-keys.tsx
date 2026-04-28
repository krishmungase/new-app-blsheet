import UpdateOpenAIKeyCard from "./update-openai-key-card";
import { Project } from "@/types";

interface APIKeysProps {
  project: Project;
  refetch: () => void;
}

const APIKeys = ({ project, refetch }: APIKeysProps) => {
  return (
    <div className="flex flex-col gap-3">
      <UpdateOpenAIKeyCard project={project} refetchProject={refetch} />
    </div>
  );
};

export default APIKeys;
