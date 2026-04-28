import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";

import { QUERY } from "@/constants";
import { Conversation } from "@/types";
import { toast, useAuth } from "@/hooks";

const useGetConversation = () => {
  const { projectId, conversationId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.CHAT.CONVERSATION.GET_CONVERSATION,
      { projectId, conversationId },
    ],
    queryFn: () =>
      apis.getConversation({
        authToken,
        params: { projectId, conversationId },
      }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while fetching conversation",
      });
    },
  });

  return {
    loadingConversation: isLoading,
    refetchConversation: refetch,
    conversation: response?.data?.data as Conversation | null,
  };
};

export default useGetConversation;
