import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useGetTimeFrame = () => {
  const { projectId, timeFrameId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.TIME_FRAME.GET_TIME_FRAME, { projectId, timeFrameId }],
    queryFn: () =>
      apis.getTimeFrames({
        authToken,
        params: { projectId, timeFrameId },
      }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    refetch,
    timeFrame: response?.data?.data,
  };
};

export default useGetTimeFrame;
