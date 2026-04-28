import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

interface GetMessagesFilter {
  parentMessageId?: string;
}

const useGetMessagesFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const parentMessageId = searchParams.get("parentMessageId");

  const setFilters = useCallback((filters: GetMessagesFilter) => {
    setSearchParams((params) => {
      if (filters.parentMessageId)
        params.set("parentMessageId", filters.parentMessageId);
      else params.delete("parentMessageId");
      return params;
    });
  }, []);

  return { parentMessageId, setFilters };
};

export default useGetMessagesFilter;
