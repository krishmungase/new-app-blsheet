import { useDispatch } from "react-redux";
import { useMutation } from "react-query";

import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/store/slices/auth-slice";

import apis from "../apis";

const useUpdateName = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { authToken, user } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.updatefullName({ authToken, data }),
    onSuccess: ({ data: response }) => {
      const fullName = response?.data?.user?.fullName;
      dispatch(setUser({ ...user, fullName }));
      toast({
        title: "Success",
        description: response.message,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
    retry: false,
  });

  return { isLoading, mutate };
};

export default useUpdateName;
