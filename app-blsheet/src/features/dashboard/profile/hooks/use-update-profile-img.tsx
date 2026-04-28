import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { useAuth } from "@/hooks";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/store/slices/auth-slice";

import apis from "../apis";

const useUpdateProfile = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { authToken, user } = useAuth();

  const { isLoading, mutate, data } = useMutation({
    mutationFn: (formData: FormData) =>
      apis.updateProfileImage({ authToken, data: formData }),
    onSuccess: ({ data: response }) => {
      const avatar = response?.data?.avatar;
      dispatch(setUser({ ...user, avatar }));
      toast({
        title: "Success",
        description: response.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
    retry: false,
  });

  return { isLoading, mutate, data };
};

export default useUpdateProfile;
