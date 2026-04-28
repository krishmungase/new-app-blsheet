import { useInfiniteQuery } from "react-query";
import { useParams } from "react-router-dom";

import { Message } from "@/types";
import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";
import useGetMessagesFilters from "./use-get-messages-filters";

const useGetMessages = ({
  parentMessageId = null,
}: {
  parentMessageId?: string | null;
}) => {
  const { limit, search } = useGetMessagesFilters();
  const { projectId, channelId, conversationId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      QUERY.CHAT.MESSAGE.GET_MESSAGES,
      {
        projectId,
        ...(channelId && { channelId }),
        ...(conversationId && { conversationId }),
        ...(parentMessageId && { parentMessageId }),
        ...(search && { search }),
      },
    ],
    queryFn: ({ pageParam }) =>
      apis.getMessages({
        authToken,
        params: {
          projectId,
          channelId,
          page: pageParam,
          limit,
          parentMessageId,
          conversationId,
          search,
        },
      }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while fetching messages",
      });
    },
    getNextPageParam: ({ data }) => {
      return data?.data?.nextPage;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const len = response?.pages?.length ? response?.pageParams?.length - 1 : 0;
  return {
    isLoading,
    refetch,
    fetchNextPage,
    messages: response?.pages.reduce(
      (acc, curr) => acc.concat(curr?.data?.data?.messages),
      []
    ) as Message[],
    total: response?.pages[len]?.data?.data?.total,
    totalPages: response?.pages[len]?.data?.data?.totalPages,
    hasPrevPage: response?.pages[len]?.data?.data?.hasPrevPage,
    hasNextPage: response?.pages[len]?.data?.data?.hasNextPage,
  };
};

export default useGetMessages;
