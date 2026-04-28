import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateDocumentTitle } from "@/hooks";

import TaskAnalytics from "./components/task-analytics";
import MemberAnalytics from "./components/member-analytics";
import useProject from "@/hooks/use-project";

const ProjectDetails = () => {
  const { project } = useProject();

  useUpdateDocumentTitle({
    title: `Details - ${project?.name}`,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-accent relative border p-4 rounded-lg overflow-hidden">
        <h1 className="text-lg font-medium">{project?.name}</h1>
        <p className="text-sm mt-1 text-muted-foreground">
          {project?.description}
        </p>
        <div className="mt-2 flex items-center justify-end">
          <Avatar className="flex items-center justify-center size-6">
            <AvatarImage
              src={project?.owner?.avatar?.url}
              alt="owner-profile"
            />
            <AvatarFallback className="bg-foreground font-medium border text-sm text-card">
              {project?.owner?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {project?.owner?.fullName}
          </span>
        </div>
      </div>
      <TaskAnalytics />
      <MemberAnalytics />
    </div>
  );
};

export default ProjectDetails;
