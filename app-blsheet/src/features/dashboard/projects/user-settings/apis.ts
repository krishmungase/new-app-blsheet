import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  createSecretKey: ({ authToken }: RequestType) =>
    request({ authToken, url: urls.secretKeyBaseUrl, method: "POST" }),
  updateSecretKey: ({ authToken }: RequestType) =>
    request({ authToken, url: urls.secretKeyBaseUrl, method: "PUT" }),
  deleteSecretKey: ({ authToken }: RequestType) =>
    request({ authToken, url: urls.secretKeyBaseUrl, method: "DELETE" }),
  getSecretKey: ({ authToken }: RequestType) =>
    request({ authToken, url: urls.secretKeyBaseUrl, method: "GET" }),
};

export default apis;
