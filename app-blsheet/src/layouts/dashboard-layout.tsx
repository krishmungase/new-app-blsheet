import { Navigate, Outlet } from "react-router-dom";
import { DashboardSidebar, ModeToggle, Loader } from "@/components";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/use-auth";
import { useSelf } from "@/hooks";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="flex h-16 shrink-0 px-4 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 border-b w-full print:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 size-8" />
        <div className="flex items-center justify-center space-x-2">
          <Avatar className="flex items-center justify-center size-6">
            <AvatarImage src={user?.avatar?.url} alt="profile" />
            <AvatarFallback className="bg-foreground text-card text-sm">
              {user?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-foreground text-sm font-medium">
            {user?.fullName}
          </h1>
        </div>
      </div>
      <ModeToggle />
    </header>
  );
};

const OutletComp = () => {
  const { open, isMobile } = useSidebar();
  return (
    <div
      className={cn(
        "p-4",
        open ? "w-[calc(100vw_-225px)]" : "w-[calc(100vw_-50px)]",
        isMobile && "w-full"
      )}
    >
      <Outlet />
    </div>
  );
};

const DashboardLayout = () => {
  const { isAuth } = useAuth();
  const { isLoading } = useSelf();

  if (!isAuth) return <Navigate to="/auth/sign-in" />;
  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full">
        <SidebarInset>
          <Header />
          <OutletComp />
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
