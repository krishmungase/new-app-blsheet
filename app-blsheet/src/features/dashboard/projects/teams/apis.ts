import { request } from "@/configs";
import { RequestType } from "@/types";

import urls from "./urls";

const apis = {
  getTeams: ({ params, authToken }: RequestType) =>
    request({
      method: "GET",
      url: urls.teamUrl,
      authToken,
      params,
    }),
  createTeam: ({ authToken, data }: RequestType) =>
    request({
      method: "POST",
      url: urls.teamUrl,
      authToken,
      data,
    }),
  updateTeam: ({ authToken, data }: RequestType) =>
    request({
      method: "PATCH",
      url: urls.teamUrl,
      authToken,
      data,
    }),
  deleteTeam: ({ authToken, data }: RequestType) =>
    request({
      method: "DELETE",
      url: urls.teamUrl,
      authToken,
      data,
    }),
  addOrRemoveTeamMember: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.teamUrl,
      authToken,
      data,
    }),
  addOrRemoveLeader: ({ authToken, data }: RequestType) =>
    request({
      method: "PUT",
      url: urls.leaderUrl,
      authToken,
      data,
    }),
  getTeam: ({ authToken, params }: RequestType) =>
    request({
      method: "GET",
      url: urls.getTeam,
      authToken,
      params,
    }),
};

export default apis;
