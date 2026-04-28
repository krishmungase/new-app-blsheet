import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getTask: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.getTask,
      authToken,
      params,
    }),
  getTasks: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getTasks,
      authToken,
      params,
    }),
  createTask: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.createTask,
      authToken,
      data,
    }),
  updateTask: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.updateTask,
      authToken,
      data,
    }),
  deleteTask: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.deleteTask,
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
      method: "POST",
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
  getLast30DaysTasks: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      params,
      url: urls.getLast30DaysTasks,
      authToken,
    }),
  getUserAssignedTasks: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      params,
      url: urls.getUserAssignedTasks,
      authToken,
    }),
  getCompletedTasks: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      params,
      url: urls.getCompletedTasks,
      authToken,
    }),
  getMembersCompletedTasks: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      params,
      url: urls.getMembersCompletedTasks,
      authToken,
    }),

  generateTask: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.generateTask,
      authToken,
      data,
    }),
};

export default apis;
