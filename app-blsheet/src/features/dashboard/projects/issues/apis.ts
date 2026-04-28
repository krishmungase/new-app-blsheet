import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getIssue: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getIssue,
      authToken,
      params,
    }),
  getIssues: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getIssues,
      authToken,
      params,
    }),
  createIssue: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.createIssue,
      authToken,
      data,
    }),
  updateIssue: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updateIssue,
      authToken,
      data,
    }),
  deleteIssue: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.deleteIssue,
      authToken,
      data,
    }),
  assignMember: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.assignMember,
      authToken,
      data,
    }),
  removeAssignedMember: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.removeAssignedMember,
      authToken,
      data,
    }),
  addComment: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.addComment,
      authToken,
      data,
    }),
  removeComment: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.removeComment,
      authToken,
      data,
    }),
  updateComment: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updateComment,
      authToken,
      data,
    }),
  changeStatus: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.changeStatus,
      authToken,
      data,
    }),
  getUserAssignedIssues: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      params,
      url: urls.getUserAssignedIssues,
      authToken,
    }),
};

export default apis;
