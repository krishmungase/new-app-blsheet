import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../../apis";
import { useNavigate, useParams } from "react-router-dom";

interface UseCreateChannelProps {
  callAfterSuccess: () => void;
}

const useCreateChannel = ({ callAfterSuccess }: UseCreateChannelProps) => {
  const { authToken } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createChannel({ authToken, data }),
    onSuccess: ({ data }) => {
      toast({
        title: "Success",
        description: "Channel created successfully",
      });
      callAfterSuccess();
      navigate(
        `/dashboard/chats/${projectId}/channels/${data?.data?.channel?._id}`
      );
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating channels",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateChannel;
