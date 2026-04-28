import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import apis from "../apis";

import { toast } from "@/hooks";
import { Loader } from "@/components";
import { setAuth } from "@/store/slices/auth-slice";

const VerifyUser = () => {
  const [search] = useSearchParams();
  const token = search.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useQuery({
    queryFn: () => apis.getSelf({ data: { token } }),
    onSuccess: ({ data: response }) => {
      toast({
        title: "Success",
        description: "successfully logged in",
      });
      dispatch(
        setAuth({
          user: response.data.user,
          authToken: response.data.token,
        })
      );
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error while verifying user",
        variant: "destructive",
      });
      navigate("/auth/sign-up");
    },
    retry: false,
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default VerifyUser;
