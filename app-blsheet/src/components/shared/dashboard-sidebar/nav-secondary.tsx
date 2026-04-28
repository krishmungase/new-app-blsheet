import { NavLink } from "react-router-dom";
import { CircleUserRound, LogOut, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks";
import { Separator } from "@/components/ui/separator";
import {
  SidebarFooter,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import PricingCard from "./pricing-card";

const NavSecondary = () => {
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { logout } = useLogout();

  return (
    <SidebarFooter>
      <PricingCard />
      <Separator />
      <SidebarMenu>
        <NavLink
          to={"/dashboard/profile"}
          onClick={() => setOpenMobile(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-2 hover:bg-muted p-2 rounded-lg text-foreground",
              isActive && "bg-muted text-active"
            )
          }
        >
          <CircleUserRound size={15} />
          <span className={cn("text-sm", !open && !isMobile && "hidden")}>
            Profile
          </span>
        </NavLink>
        <NavLink
          to={"/dashboard/user-settings"}
          onClick={() => setOpenMobile(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center space-x-2 hover:bg-muted p-2 rounded-lg text-foreground",
              isActive && "bg-muted text-active"
            )
          }
        >
          <Settings size={15} />
          <span className={cn("text-sm", !open && !isMobile && "hidden")}>
            User Settings
          </span>
        </NavLink>
        <button
          className={cn(
            "flex items-center space-x-2 hover:bg-muted p-2 rounded-lg text-foreground"
          )}
          onClick={logout}
        >
          <LogOut size={15} />
          <span className={cn("text-sm", !open && !isMobile && "hidden")}>
            Logout
          </span>
        </button>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default NavSecondary;
