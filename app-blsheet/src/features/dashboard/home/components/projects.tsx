import { Loader } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PanelsTopLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import useGetProjects from "../../projects/hooks/use-get-projects";
import { MemberRole, Project } from "@/types";

const Projects = () => {
  const { isLoading, projects } = useGetProjects();
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <PanelsTopLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-[140px]">
            <Loader />
          </div>
        ) : (
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length}</div>
            <div className="flex sm:items-center flex-col gap-2 sm:flex-row sm:justify-between mt-2 text-xs">
              <Badge className="bg-orange-100 text-orange-500 flex items-center justify-center w-full">
                Owner (
                {
                  projects.filter((p: Project) => p.role === MemberRole.OWNER)
                    .length
                }
                )
              </Badge>
              <Badge className="bg-red-100 text-red-500 flex items-center justify-center w-full">
                Admin (
                {
                  projects.filter((p: Project) => p.role === MemberRole.ADMIN)
                    .length
                }
                )
              </Badge>
              <Badge className="bg-blue-100 text-blue-500 flex items-center justify-center w-full">
                Member (
                {
                  projects.filter((p: Project) => p.role === MemberRole.MEMBER)
                    .length
                }
                )
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default Projects;
