import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getDocs: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.docUrl,
      authToken,
      params,
    }),

  createDoc: ({ params, authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.docUrl,
      authToken,
      params,
      data,
    }),

  getDoc: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getDoc,
      authToken,
      params,
    }),

  updateDoc: ({ params, authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.docUrl,
      authToken,
      params,
      data,
    }),

  deleteDoc: ({ params, authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.docUrl,
      authToken,
      params,
      data,
    }),

  assignMember: ({ params, authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.assing,
      authToken,
      params,
      data,
    }),

  removeMember: ({ params, authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.assing,
      authToken,
      params,
      data,
    }),
};

export default apis;
