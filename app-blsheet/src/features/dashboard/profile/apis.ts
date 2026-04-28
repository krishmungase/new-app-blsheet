import { request } from "@/configs";
import { RequestType } from "@/types";
import urls from "./urls";

const apis = {
  updatefullName: ({ data, authToken }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updatefullName,
      data,
      authToken,
    }),

  updateProfileImage: ({ data, authToken }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.UpdateProfileImg,
      data,
      authToken,
      isFormData: true,
    }),
};

export default apis;
