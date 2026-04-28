import UpdateProject from "./update-project";
import { Project } from "@/types";

interface UpdateProjectCardProps {
  project: Project | undefined;
  refetchProject: () => void;
}

const UpdateProjectCard = ({
  project,
  refetchProject,
}: UpdateProjectCardProps) => {
  return (
    <div className="relative space-y-1 bg-muted rounded-lg border">
      <div className="flex items-center justify-between space-x-2 border-b border-muted-foreground/40 p-3 ">
        <h1 className="text-[15px] font-medium text-foreground">
          Project info
        </h1>
        <UpdateProject project={project!} refetchProject={refetchProject} />
      </div>
      <div className="flex items-center justify-between space-x-3 p-3 ">
        <div className="space-y-1">
          <h1 className="text-primary font-medium">{project?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectCard;
