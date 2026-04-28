import { SearchInput } from "@/components";
import useGetLabelsFilters from "../hooks/use-get-labels-filters";

const SearchFilter = () => {
  const { setFilters, name } = useGetLabelsFilters();
  return (
    <SearchInput
      fn={(name?: string) => setFilters({ name })}
      text={name ? name : ""}
      placeholder="Search all labels"
    />
  );
};

export default SearchFilter;
