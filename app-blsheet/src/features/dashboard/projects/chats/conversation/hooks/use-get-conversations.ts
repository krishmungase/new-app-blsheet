import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";
import { QUERY } from "@/constants";
import { Conversation } from "@/types";

const useGetConversations = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.CHAT.CONVERSATION.GET_CONVERSATIONS, projectId],
    queryFn: () => apis.getConversations({ authToken, params: { projectId } }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message ||
          "Error while fetching conversations",
      });
    },
  });

  return {
    loadingConversations: isLoading,
    refetchConversations: refetch,
    conversations: (response?.data?.data ?? []) as Conversation[],
  };
};

export default useGetConversations;
