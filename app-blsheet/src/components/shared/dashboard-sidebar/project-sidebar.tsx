import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import NavMain from "./nav-main";
import NavSecondary from "./nav-secondary";
import ProjectSwitcher from "./project-switcher";
import NavHeader from "./nav-header";

const DashboardSidebar = () => {
  return (
    <Sidebar collapsible="icon" className="print:hidden">
      <NavHeader />
      <Separator />
      <ProjectSwitcher />
      <NavMain />
      <NavSecondary />
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
