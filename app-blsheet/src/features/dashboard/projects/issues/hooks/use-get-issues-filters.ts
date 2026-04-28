import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { IssuePriority, IssueStatus } from "@/types";

export interface GetIssueFilters {
  title?: string;
  priority?: IssuePriority | "All";
  status?: IssueStatus | "All";
  assignedToMe?: string;
  createdByMe?: string;
  sortByCreated?: string;
  limit?: number;
  page?: number;
}

const PER_PAGE_ISSUES = 10;

const useGetIssueFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title");
  const status = searchParams.get("status") ?? IssueStatus.OPEN;
  const priority = searchParams.get("priority");
  const assignedToMe = searchParams.get("assignedToMe");
  const createdByMe = searchParams.get("createdByMe");
  const sortByCreated = searchParams.get("sortByCreated");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : PER_PAGE_ISSUES;

  const setFilters = useCallback((filters: GetIssueFilters) => {
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
      if (filters?.sortByCreated === "true")
        params.set("sortByCreated", filters.sortByCreated);
      else params.delete("sortByCreated");
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());
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
    setFilters,
  };
};

export default useGetIssueFilters;
