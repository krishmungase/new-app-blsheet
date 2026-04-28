import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";
import { QUERY } from "@/constants";
import { Message } from "@/types";

const useGetMessage = ({ messageId }: { messageId: string }) => {
  const { projectId, channelId, conversationId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.CHAT.MESSAGE.GET_MESSAGE,
      { projectId, channelId, messageId, conversationId },
    ],
    queryFn: () =>
      apis.getMessage({
        authToken,
        params: { projectId, channelId, messageId, conversationId },
      }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while fetching message",
      });
    },
  });

  return {
    isLoading,
    refetch,
    data: response?.data?.data as Message,
  };
};

export default useGetMessage;
