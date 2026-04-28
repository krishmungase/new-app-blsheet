import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../apis";

interface useDeleteTeamProps {
  refetch: () => void;
  onClose: () => void;
}

const useDeleteTeam = ({ refetch, onClose }: useDeleteTeamProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteTeam({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      refetch();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return { isLoading, mutate };
};

export default useDeleteTeam;
