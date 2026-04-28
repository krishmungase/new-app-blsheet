import { useMutation } from "react-query";
import { toast, useAuth } from "@/hooks";
import apis from "../apis";

interface UseCreateTeamProps {
  refetch: () => void;
  onClose: () => void;
}

const useCreateTeam = ({ refetch, onClose }: UseCreateTeamProps) => {
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createTeam({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Team created successfully",
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

export default useCreateTeam;
