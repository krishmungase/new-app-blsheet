import useProject from "@/hooks/use-project";
import DeleteProject from "./delete-project";

const DeleteProjectCard = () => {
  const { project } = useProject();
  return (
    <div className="relative space-y-1 rounded-lg border border-red-500/40  p-3 ">
      <div className="flex items-center justify-between space-x-3">
        <div className="space-y-1">
          <h1 className="text-foreground font-medium">Delete this project</h1>
          <p className="text-sm text-muted-foreground">
            Once you delete a project, there is no going back. Please be
            certain.
          </p>
        </div>
        <DeleteProject projectId={project?.projectId!} />
      </div>
    </div>
  );
};

export default DeleteProjectCard;
