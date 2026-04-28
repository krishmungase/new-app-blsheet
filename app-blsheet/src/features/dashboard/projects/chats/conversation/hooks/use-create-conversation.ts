import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";

import apis from "../apis";
import { useNavigate, useParams } from "react-router-dom";

interface UseCreateConversationProps {
  callAfterSuccess: () => void;
}

const useCreateConversation = ({
  callAfterSuccess,
}: UseCreateConversationProps) => {
  const { authToken } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createconversation({ authToken, data }),
    onSuccess: ({ data }) => {
      toast({
        title: "Success",
        description: "Conversation created successfully",
      });
      callAfterSuccess();
      navigate(`/dashboard/chats/${projectId}/conversation/${data?.data?._id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while creating conversation",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    mutate,
  };
};

export default useCreateConversation;
