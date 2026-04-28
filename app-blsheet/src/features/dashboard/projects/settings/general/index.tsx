import APIKeys from "./components/api-keys";
import DeleteProjectCard from "./components/delete-project-card";
import UpdateProjectCard from "./components/update-project-card";
import useGetProject from "../../hooks/use-get-project";

import { Loader } from "@/components";

const General = () => {
  const { project, refetch, isLoading } = useGetProject();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-foreground font-medium text-lg border-b pb-2">
        General
      </h1>
      <UpdateProjectCard project={project} refetchProject={refetch} />

      <h1 className="text-foreground font-medium text-lg border-b pb-2">
        API Keys
      </h1>
      <APIKeys project={project} refetch={refetch} />

      <h1 className="text-foreground font-medium text-lg border-b pb-2">
        Danger Zone
      </h1>
      <DeleteProjectCard />
    </div>
  );
};

export default General;
