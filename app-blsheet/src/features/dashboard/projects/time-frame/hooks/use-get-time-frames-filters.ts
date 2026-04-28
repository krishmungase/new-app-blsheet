import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface GetTeamsFilter {
  page?: number;
  limit?: number;
  label?: string;
}

const useGetTimeFramesFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const label = searchParams.get("label");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;

  const setFilters = useCallback((filters: GetTeamsFilter) => {
    setSearchParams((params) => {
      if (filters.label) params.set("label", filters.label);
      else params.delete("label");
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());
      return params;
    });
  }, []);

  return { page, limit, label, setFilters };
};

export default useGetTimeFramesFilters;
