import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../../apis";
import { QUERY } from "@/constants";
import { Channel } from "@/types";

const useGetChannels = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.CHAT.CHANNEL.GET_CHANNELS, projectId],
    queryFn: () => apis.getChannels({ authToken, params: { projectId } }),
    onError: (error: any) => {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          error?.response?.data?.message || "Error while fetching channels",
      });
    },
  });

  return {
    loadingChannels: isLoading,
    refetchChannels: refetch,
    channels: (response?.data?.data ?? []) as Channel[],
  };
};

export default useGetChannels;
