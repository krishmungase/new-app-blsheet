import { toast, useAuth } from "@/hooks";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import apis from "../apis";

const useCreateDoc = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.createDoc({ data, authToken }),
    onSuccess: ({ data }) => {
      const url = `/dashboard/workspace/${data?.data?.doc?.projectId}/docs/${data?.data?.doc?._id}`;
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      navigate(url);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message,
      });
    },
    retry: false,
  });

  return { mutate, isLoading };
};
export default useCreateDoc;
