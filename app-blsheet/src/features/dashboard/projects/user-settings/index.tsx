import { Loader2 } from "lucide-react";
import SecretKey from "./components/secret-key";
import useGetSecretKey from "./hooks/use-get-secret-key";

const UserSettingsPage = () => {
  const { data, isLoading, refetch } = useGetSecretKey();
  return (
    <div className="relative">
      <div className="pb-5 scroll-smooth">
        <div className="md:px-8 mx-auto overflow-y-auto h-[calc(100vh_-160px)]">
          <div className="space-y-4">
            <h1 className="text-foreground font-medium text-lg border-b pb-2">
              BL Sheet Secret Key
            </h1>
            {isLoading ? (
              <div className="h-[50px] flex items-center justify-center">
                <Loader2 className="animate-spin" />{" "}
              </div>
            ) : (
              <SecretKey secretKey={data} refetch={refetch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
