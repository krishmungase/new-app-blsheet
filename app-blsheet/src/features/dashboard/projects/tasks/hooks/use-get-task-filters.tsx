import { TaskPriority, TaskStatus } from "@/types";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface GetTaskFilters {
  title?: string;
  priority?: TaskPriority | "All";
  status?: TaskStatus | "All";
  assignedToMe?: string;
  createdByMe?: string;
  sortByCreated?: string;
  page?: number;
  limit?: number;
  view?: string;
}

const useGetTaskFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title");
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const assignedToMe = searchParams.get("assignedToMe");
  const createdByMe = searchParams.get("createdByMe");
  const sortByCreated = searchParams.get("sortByCreated");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 6;
  const view = searchParams.get("view") ?? "board";

  const setFilters = useCallback((filters: GetTaskFilters) => {
    setSearchParams((params) => {
      if (filters?.title) params.set("title", filters.title);
      else params.delete("title");
      if (filters?.status) params.set("status", filters.status);
      if (filters?.priority) params.set("priority", filters.priority);
      if (filters?.assignedToMe === "true")
        params.set("assignedToMe", filters.assignedToMe);
      else params.delete("assignedToMe");
      if (filters?.createdByMe === "true")
        params.set("createdByMe", filters.createdByMe);
      else params.delete("createdByMe");
      if (filters?.view) params.set("view", filters.view);
      else params.delete("view");
      if (filters?.sortByCreated === "true")
        params.set("sortByCreated", filters.sortByCreated);
      else params.delete("sortByCreated");
      if (filters?.page) params.set("page", filters.page.toString());
      if (filters?.limit) params.set("limit", filters.limit.toString());
      return params;
    });
  }, []);

  return {
    title,
    status,
    priority,
    assignedToMe,
    createdByMe,
    sortByCreated,
    page,
    limit,
    view,
    setFilters,
  };
};

export default useGetTaskFilters;
