import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { toast, useAuth } from "@/hooks";
import apis from "../../apis";

const useDeleteChannel = () => {
  const { authToken } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.deleteChannel({ authToken, data }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Channel deleted successfully",
      });
    },
    onSettled: () => {
      navigate(`/dashboard/chats/${projectId}/channels`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while deleting channels",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useDeleteChannel;
