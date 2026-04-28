import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface GetTeamsFilter {
  page?: number;
  limit?: number;
  name?: string;
}

const useGetTeamsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;

  const setFilters = useCallback((filters: GetTeamsFilter) => {
    setSearchParams((params) => {
      if (filters.name) params.set("name", filters.name);
      else params.delete("name");

      if (filters?.page) params.set("page", filters?.page?.toString());
      if (filters?.limit) params.set("limit", filters?.limit?.toString());

      return params;
    });
  }, []);

  return { page, limit, name, setFilters };
};

export default useGetTeamsFilters;
