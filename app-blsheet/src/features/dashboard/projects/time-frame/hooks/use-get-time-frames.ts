import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";
import useGetTimeFramesFilters from "./use-get-time-frames-filters";

const useGetTimeFrames = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();
  const { page, limit, label } = useGetTimeFramesFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.TIME_FRAME.GET_TIME_FRAMES,
      { projectId, page, limit, label },
    ],
    queryFn: () =>
      apis.getTimeFrames({
        authToken,
        params: { projectId, page, limit, label },
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
    timeFrames: response?.data?.data?.timeFrames ?? [],
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
  };
};

export default useGetTimeFrames;
