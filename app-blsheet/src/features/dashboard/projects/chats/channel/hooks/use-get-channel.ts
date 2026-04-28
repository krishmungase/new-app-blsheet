import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../../apis";
import { QUERY } from "@/constants";
import { Channel } from "@/types";

const useGetChannel = () => {
  const { projectId, channelId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.CHAT.CHANNEL.GET_CHANNEL, projectId, channelId],
    queryFn: () =>
      apis.getChannel({ authToken, params: { projectId, channelId } }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while fetching channel",
      });
    },
  });

  return {
    loadingChannel: isLoading,
    refetchChannel: refetch,
    channel: response?.data?.data as Channel,
  };
};

export default useGetChannel;
