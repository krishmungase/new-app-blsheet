import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface GetMessagesFilters {
  page?: number;
  limit?: number;
  search?: string;
}

const useGetMessagesFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 20;

  const setFilters = useCallback((filters: GetMessagesFilters) => {
    setSearchParams((params) => {
      if (filters?.search) params.set("search", filters.search);
      else params.delete("search");
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());

      return params;
    });
  }, []);

  return {
    page,
    limit,
    search,
    setFilters,
  };
};

export default useGetMessagesFilters;
