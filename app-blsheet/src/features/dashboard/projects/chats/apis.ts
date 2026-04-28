import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getChannel: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.channelBaseUrl,
      authToken,
      params,
    }),
  createChannel: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.channelBaseUrl,
      authToken,
      data,
    }),
  updateChannel: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.channelBaseUrl,
      authToken,
      data,
    }),
  deleteChannel: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.channelBaseUrl,
      authToken,
      data,
    }),
  getChannels: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getChannels,
      authToken,
      params,
    }),
  getMessages: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getMessages,
      authToken,
      params,
    }),
  createMessage: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.messageBaseUrl,
      authToken,
      data,
      isFormData: true,
    }),
  updateMessage: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.messageBaseUrl,
      authToken,
      data,
    }),
  deleteMessage: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.messageBaseUrl,
      authToken,
      data,
    }),
  getMessage: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.messageBaseUrl,
      authToken,
      params,
    }),
  addReaction: ({ data, authToken }: RequestType) =>
    request({
      method: "POST",
      url: urls.reactionBaseUrl,
      authToken,
      data,
    }),
  addMember: ({ data, authToken }: RequestType) =>
    request({
      method: "POST",
      url: urls.channelMember,
      authToken,
      data,
    }),
  removeMember: ({ data, authToken }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.channelMember,
      authToken,
      data,
    }),
};

export default apis;
