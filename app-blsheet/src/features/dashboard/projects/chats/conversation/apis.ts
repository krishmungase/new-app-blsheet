import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getConversation: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.conversationBaseUrl,
      authToken,
      params,
    }),
  createconversation: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.conversationBaseUrl,
      authToken,
      data,
    }),
  updateconversation: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.conversationBaseUrl,
      authToken,
      data,
    }),
  deleteconversation: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.conversationBaseUrl,
      authToken,
      data,
    }),
  getConversations: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getConversations,
      authToken,
      params,
    }),
};

export default apis;
