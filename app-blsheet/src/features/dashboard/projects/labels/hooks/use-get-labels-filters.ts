import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface GetLabelsFilters {
  name?: string;
  page?: number;
  limit?: number;
}

const useGetLabelsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;
  const name = searchParams.get("name");

  const setFilters = useCallback((filters: GetLabelsFilters) => {
    setSearchParams((params) => {
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());
      if (filters.name) params.set("name", filters.name);
      else params.delete("name");
      return params;
    });
  }, []);

  return {
    page,
    limit,
    name,
    setFilters,
  };
};

export default useGetLabelsFilters;
