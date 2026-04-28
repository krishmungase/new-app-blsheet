import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../../../apis";
import useGetKeyResultFilters from "./use-get-key-result-filters";

const useGetKeyResults = () => {
  const { projectId, objectiveId } = useParams();
  const { authToken } = useAuth();
  const { page, limit, title } = useGetKeyResultFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.KEY_RESULT.GET_KEY_RESULTS,
      { projectId, page, limit, title, objectiveId },
    ],
    queryFn: () =>
      apis.getKeyResults({
        authToken,
        params: { projectId, page, limit, title, objectiveId },
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
    keyResults: response?.data?.data?.keyResults ?? [],
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
  };
};

export default useGetKeyResults;
