import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown, Dot } from "lucide-react";

import { Project } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import useProject from "@/hooks/use-project";
import { setProject } from "@/store/slices/project-slice";
import CreateProject from "@/features/dashboard/projects/components/create-project";
import useGetProjects from "@/features/dashboard/projects/hooks/use-get-projects";

import Loader from "../loader";

const ProjectSwitcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile, open } = useSidebar();
  const { isLoading, projects, refetch } = useGetProjects();
  const { project } = useProject();

  const [activeProject, setActiveProject] = React.useState<Project | null>();

  React.useEffect(() => {
    const activeProject = projects.find(
      (p: Project) => p.projectId === project?.projectId
    );
    if (!activeProject) {
      if (projects.length) {
        setActiveProject(projects[0]);
        dispatch(setProject(projects[0]));
      } else setActiveProject(null);
    } else setActiveProject(activeProject);
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <Loader />
      </div>
    );
  }

  if (!projects.length) {
    dispatch(setProject(null));
    return (
      <div className="p-2">
        <CreateProject
          refetchProjects={refetch}
          title="Create Project"
          isMobile={!open}
        />
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-secondary border focus:outline-none focus-visible:ring-0"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {activeProject?.name?.[0].toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProject?.name}
                </span>
                <span className="truncate text-xs">
                  {activeProject?.owner?.fullName}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground">
              Projects
            </DropdownMenuLabel>

            <DropdownMenuItem className="gap-1 p-2 flex flex-col mb-2 items-start cursor-pointer bg-muted">
              <div className="flex gap-2">
                <span className="truncate">{activeProject?.name}</span>
                <Badge className="text-xs">{activeProject?.role}</Badge>
              </div>
              <div className="flex items-center">
                <Dot
                  size={15}
                  className="animate-pulse text-green-500 !size-7"
                />
                <span className="text-xs text-green-500">Active project</span>
              </div>
            </DropdownMenuItem>

            {projects
              .filter((p: Project) => p.projectId !== activeProject?.projectId)
              .map((project: Project) => (
                <DropdownMenuItem
                  key={project.name}
                  onClick={() => {
                    setActiveProject(project);
                    dispatch(setProject(project));
                    navigate(`/dashboard/setup/${project.projectId}/details`);
                  }}
                  className="gap-2 p-2 cursor-pointer "
                >
                  <span className="truncate">{project.name}</span>
                  <Badge className="text-xs">{project.role}</Badge>
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <CreateProject refetchProjects={refetch} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default ProjectSwitcher;
