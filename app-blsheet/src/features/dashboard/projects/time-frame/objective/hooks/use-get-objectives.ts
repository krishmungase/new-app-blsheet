import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../../apis";
import useGetObjectiveFilters from "./use-get-objective-filters";

const useGetObjectives = () => {
  const { projectId, timeFrameId } = useParams();
  const { authToken } = useAuth();
  const { page, limit, title } = useGetObjectiveFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.OBJECTIVE.GET_OBJECTIVES,
      { projectId, page, limit, title, timeFrameId },
    ],
    queryFn: () =>
      apis.getObjectives({
        authToken,
        params: { projectId, page, limit, title, timeFrameId },
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
    objectives: response?.data?.data?.objectives ?? [],
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
  };
};

export default useGetObjectives;
