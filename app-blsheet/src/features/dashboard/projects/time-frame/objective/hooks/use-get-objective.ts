import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../../apis";
import { Objective } from "@/types";

const useGetObjective = () => {
  const { projectId, objectiveId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.OBJECTIVE.GET_OBJECTIVE, { projectId, objectiveId }],
    queryFn: () =>
      apis.getObjective({
        authToken,
        params: { projectId, objectiveId },
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
    objective: response?.data?.data as Objective,
  };
};

export default useGetObjective;
