import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getProject: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getProject,
      authToken,
      params,
    }),

  getProjects: ({ authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getProjects,
      authToken,
    }),

  createProject: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.createProject,
      authToken,
      data,
    }),

  updateProject: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updateProject,
      authToken,
      data,
    }),

  deleteProject: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.deleteProject,
      authToken,
      data,
    }),

  updateOpenAIKey: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updateOpenAIKey,
      authToken,
      data,
    }),
  removeOpenAIKey: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.removeOpenAIKey,
      authToken,
      data,
    }),
};

export default apis;
