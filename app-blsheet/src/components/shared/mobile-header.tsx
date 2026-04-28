import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, PanelBottomOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants";
import { useAuth, useLogout } from "@/hooks";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import UserAvatar from "./user-avatar";

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useLogout();
  const { isAuth } = useAuth();

  if (!isAuth) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="md:hidden">
        {isOpen ? (
          <X />
        ) : (
          <PanelBottomOpen
            strokeWidth={1.2}
            size={30}
            className="text-muted-foreground"
          />
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex-col flex gap-3 my-6">
          <div className="flex items-start px-3 py-1">
            <UserAvatar />
          </div>
          {NAV_LINKS.map((link) => {
            if (link.isProtected && !isAuth) return null;
            return (
              <NavLink
                onClick={() => setIsOpen(false)}
                key={link.id}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "hover:text-primary transition-all space-x-2 flex items-center text-muted-foreground w-full px-3 py-1",
                    isActive && "text-primary bg-secondary"
                  )
                }
              >
                <link.icon className="size-4" />
                <span className="text-sm">{link.title}</span>
              </NavLink>
            );
          })}
          {isAuth && (
            <button
              onClick={logout}
              className="hover:text-primary transition-all space-x-2 flex items-center text-muted-foreground w-full px-3 py-1"
            >
              <LogOut className="size-4" />
              <span className="text-sm">Logout</span>
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileHeader;
