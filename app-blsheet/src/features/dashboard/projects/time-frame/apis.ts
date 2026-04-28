import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getTimeFrame: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.timeFrameBaseUrl,
      authToken,
      params,
    }),
  getTimeFrames: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getTimeFrames,
      authToken,
      params,
    }),
  createTimeFrame: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.timeFrameBaseUrl,
      authToken,
      data,
    }),
  updateTimeFrame: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.timeFrameBaseUrl,
      authToken,
      data,
    }),
  deleteTimeFrame: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.timeFrameBaseUrl,
      authToken,
      data,
    }),
  getObjective: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.objectiveBaseUrl,
      authToken,
      params,
    }),
  getObjectives: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getObjectives,
      authToken,
      params,
    }),
  createObjective: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.objectiveBaseUrl,
      authToken,
      data,
    }),
  updateObjective: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.objectiveBaseUrl,
      authToken,
      data,
    }),
  deleteObjective: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.objectiveBaseUrl,
      authToken,
      data,
    }),
  getKeyResult: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.keyResultBaseUrl,
      authToken,
      params,
    }),
  getKeyResults: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getKeyResults,
      authToken,
      params,
    }),
  createKeyResult: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.keyResultBaseUrl,
      authToken,
      data,
    }),
  updateKeyResult: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.keyResultBaseUrl,
      authToken,
      data,
    }),
  deleteKeyResult: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.keyResultBaseUrl,
      authToken,
      data,
    }),
  updateKRCurrentValue: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.updateKRCurrentValue,
      authToken,
      data,
    }),
};

export default apis;
