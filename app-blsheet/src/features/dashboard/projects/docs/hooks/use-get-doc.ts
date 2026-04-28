import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";

import apis from "../apis";

const useGetDoc = () => {
  const { projectId, docId } = useParams();
  const { authToken } = useAuth();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.DOC.GET_DOC, , projectId, docId],
    queryFn: () =>
      apis.getDoc({
        params: {
          projectId,
          docId,
        },
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
    doc: response?.data?.data,
  };
};

export default useGetDoc;
