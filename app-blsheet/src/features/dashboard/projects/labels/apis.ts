import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  createLabel: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.labelBaseUrl,
      authToken,
      data,
    }),
  updateLabel: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.labelBaseUrl,
      authToken,
      data,
    }),
  deleteLabel: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.labelBaseUrl,
      authToken,
      data,
    }),
  getLabels: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.labelBaseUrl,
      authToken,
      params,
    }),
};

export default apis;
