import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import {
  Settings,
  Wrench,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { MemberRole } from "@/types";

const navMain = [
  {
    id: 1,
    title: "Setup",
    path: "/dashboard/setup",
    icon: Wrench,
    endPoint: "details",
  },
  {
    id: 2,
    title: "Workspace",
    path: "/dashboard/workspace",
    icon: SlidersHorizontal,
    endPoint: "tasks",
  },
  {
    id: 4,
    title: "Chats",
    path: "/dashboard/chats",
    icon: MessageCircle,
    endPoint: "channels",
  },
];

const NavMain = () => {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { project } = useProject();
  const { pathname } = useLocation();

  if (!project) {
    if (!open)
      return (
        <div className="h-full flex items-center justify-center flex-col gap-2"></div>
      );
    return (
      <div className="h-full flex items-center justify-center">
        Project not found!
      </div>
    );
  }

  return (
    <SidebarContent>
      <SidebarGroup className="space-y-1">
        {[
          ...navMain,
          ...(project?.role === MemberRole.OWNER
            ? [
                {
                  id: 3,
                  title: "Settings",
                  path: "/dashboard/settings",
                  icon: Settings,
                  endPoint: "general",
                },
              ]
            : []),
        ].map((item) => (
          <SidebarMenu key={item.id}>
            <NavLink
              onClick={() => setOpenMobile(false)}
              to={`${item.path}/${project?.projectId}/${item.endPoint}`}
              className={cn(
                "flex items-center space-x-2 hover:bg-muted p-2 rounded-lg text-foreground",
                pathname.includes(item.path) && "bg-muted text-active"
              )}
            >
              <item.icon size={15} />
              <span className={cn("text-sm", !open && !isMobile && "hidden")}>
                {item.title}
              </span>
            </NavLink>
          </SidebarMenu>
        ))}
      </SidebarGroup>
    </SidebarContent>
  );
};

export default NavMain;
