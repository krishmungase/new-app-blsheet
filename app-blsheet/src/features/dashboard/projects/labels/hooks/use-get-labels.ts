import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";
import useGetLabelsFilters from "./use-get-labels-filters";

const useGetLabels = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();
  const { name, page, limit } = useGetLabelsFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.LABEL.GET_LABELS, projectId, { name, page, limit }],
    queryFn: () =>
      apis.getLabels({
        params: { projectId, name, page, limit },
        authToken,
      }),
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return {
    isLoading,
    refetch,
    labels: response?.data?.data?.lables,
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
  };
};

export default useGetLabels;
