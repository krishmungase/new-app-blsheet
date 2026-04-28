import { QUERY } from "@/constants";
import { toast, useAuth } from "@/hooks";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import apis from "../apis";
import useGetDocsFilters from "./use-get-docs-filters";

const useGetDocs = () => {
  const { projectId } = useParams();
  const { authToken } = useAuth();
  const {
    title,
    isPublic,
    assignedToMe,
    createdByMe,
    sortByCreated,
    page,
    limit,
  } = useGetDocsFilters();

  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [
      QUERY.DOC.GET_DOCS,
      projectId,
      {
        title,
        isPublic,
        assignedToMe,
        createdByMe,
        sortByCreated,
        page,
        limit,
      },
    ],
    queryFn: () =>
      apis.getDocs({
        params: {
          projectId,
          title,
          isPublic,
          assignedToMe,
          createdByMe,
          sortByCreated,
          page,
          limit,
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
    docs: response?.data?.data?.docs,
    total: response?.data?.data?.total,
    totalPages: response?.data?.data?.totalPages,
    hasPrevPage: response?.data?.data?.hasPrevPage,
    hasNextPage: response?.data?.data?.hasNextPage,
  };
};

export default useGetDocs;
