import { useQuery } from "react-query";

import { useAuth, toast } from "@/hooks";
import { QUERY } from "@/constants";

import apis from "../apis";

const useGetSecretKey = () => {
  const { authToken } = useAuth();
  const {
    isLoading,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERY.SECRETE_KEY.GET_SECRET_KEY],
    queryFn: () => apis.getSecretKey({ authToken }),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.reqponse?.data?.message,
        variant: "default",
      });
    },
    retry: false,
  });

  return { isLoading, refetch, data: response?.data?.data };
};

export default useGetSecretKey;
