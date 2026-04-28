import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/lib/utils";
import { SETUP_LINKS } from "@/constants";
import useProject from "@/hooks/use-project";

const ProjectSetupHeader = () => {
  const { project } = useProject();

  return (
    <div className="flex items-center space-x-4 border-b print:hidden overflow-x-auto">
      {SETUP_LINKS.map((link) => (
        <NavLink
          key={link.id}
          to={`/dashboard/setup/${project?.projectId}/${link.path}`}
          className={({ isActive }) =>
            cn(
              "flex items-center justify-center gap-2 pb-1.5",
              isActive && "text-active border-b-2 border-active"
            )
          }
        >
          <link.icon size={15} />
          <span className="text-sm">{link.title}</span>
        </NavLink>
      ))}
    </div>
  );
};

const ProjectSetupLayout = () => {
  return (
    <div className="flex flex-col">
      <ProjectSetupHeader />
      <div className="mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectSetupLayout;
