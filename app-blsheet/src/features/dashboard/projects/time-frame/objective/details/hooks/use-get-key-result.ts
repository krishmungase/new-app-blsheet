import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../../../apis";

const useGetKeyResult = ({ keyResultId }: { keyResultId: string }) => {
  const { projectId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.KEY_RESULT.GET_KEY_RESULT, { projectId, keyResultId }],
    queryFn: () =>
      apis.getKeyResult({
        authToken,
        params: { projectId, keyResultId },
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
    keyResult: response?.data?.data,
  };
};

export default useGetKeyResult;
