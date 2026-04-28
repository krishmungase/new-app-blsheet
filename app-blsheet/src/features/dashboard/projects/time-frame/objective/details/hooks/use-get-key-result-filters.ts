import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface GetKeyResultFilters {
  page?: number;
  limit?: number;
  title?: string;
}

const useGetKeyResultFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") as string)
    : 10;

  const setFilters = useCallback((filters: GetKeyResultFilters) => {
    setSearchParams((params) => {
      if (filters.title) params.set("title", filters.title);
      else params.delete("title");
      if (filters.page) params.set("page", filters.page.toString());
      if (filters.limit) params.set("limit", filters.limit.toString());
      return params;
    });
  }, []);

  return { page, limit, title, setFilters };
};

export default useGetKeyResultFilters;
