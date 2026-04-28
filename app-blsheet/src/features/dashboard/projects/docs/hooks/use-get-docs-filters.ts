import { DocStatus } from "@/types";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface GetDocsFilters {
  title?: string;
  status?: DocStatus | "All";
  assignedToMe?: string;
  isPublic?: string;
  createdByMe?: string;
  sortByCreated?: string;
  page?: number;
  limit?: number;
}

const useGetDocsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title");
  const status = searchParams.get("status");
  let isPublic = searchParams.get("isPublic");
  const assignedToMe = searchParams.get("assignedToMe");
  const createdByMe = searchParams.get("createdByMe");
  const sortByCreated = searchParams.get("sortByCreated");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;

  if (
    (!createdByMe || createdByMe === "false") &&
    (!assignedToMe || assignedToMe === "false")
  )
    isPublic = "true";

  const setFilters = useCallback((filters: GetDocsFilters) => {
    setSearchParams((params) => {
      if (filters?.title) params.set("title", filters.title);
      else params.delete("title");

      if (filters?.status) params.set("status", filters.status);

      if (filters?.assignedToMe === "true")
        params.set("assignedToMe", filters.assignedToMe);
      else params.delete("assignedToMe");

      if (filters?.createdByMe === "true")
        params.set("createdByMe", filters.createdByMe);
      else params.delete("createdByMe");

      if (filters?.isPublic === "true")
        params.set("isPublic", filters.isPublic);
      else params.delete("isPublic");

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
    assignedToMe,
    createdByMe,
    sortByCreated,
    page,
    limit,
    isPublic,
    setFilters,
  };
};

export default useGetDocsFilters;
