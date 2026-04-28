import { useAuth } from "@/hooks";
import { useUpdateDocumentTitle } from "@/hooks";

import UpdateFullName from "./components/update-full-name";
import UpdateProfileImg from "./components/update-profile-img";
import DashboardHome from "../home";

const Profile = () => {
  const { user } = useAuth();

  useUpdateDocumentTitle({
    title: `Profile - BL Sheet`,
  });

  return (
    <div className="relative">
      <div className="p-4 mb-4 sm:p-8 border rounded-lg shadow-sm w-full bg-muted">
        <div className="flex items-center sm:space-x-10 flex-col sm:flex-row">
          <UpdateProfileImg />
          <div className="flex flex-col space-y-6">
            <UpdateFullName />
            <div className="flex sm:items-center sm:space-x-8 flex-col space-y-4 sm:space-y-0 sm:flex-row">
              <div className="flex flex-col">
                <h1 className="text-primary font-medium text-sm">Role</h1>
                <h1 className="text-sm">{user?.role}</h1>
              </div>
              <div className="flex flex-col">
                <h1 className="text-primary font-medium text-sm">
                  Email Adress
                </h1>
                <h1 className="text-sm">{user?.email}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardHome />
    </div>
  );
};

export default Profile;
