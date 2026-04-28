import { SearchInput } from "@/components";
import useGetKeyResultFilters from "../hooks/use-get-key-result-filters";

interface HeaderProps {
  total: number;
}

const KeyResultHeader = ({ total }: HeaderProps) => {
  const { setFilters, title } = useGetKeyResultFilters();

  return (
    <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
      <div className="text-center flex items-center gap-2 justify-center sm:justify-start">
        <span className="text-base">Key Results</span>{" "}
        <span className="text-card bg-secondary-foreground rounded-xl sm:px-2 px-4 md:px-4 text-xs md:text-sm py-1">
          {total}
        </span>
      </div>

      <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2 sm:w-fit">
        <SearchInput
          fn={(title?: string) => setFilters({ title })}
          text={title ? title : ""}
          className="md:w-[400px]"
          placeholder="Search all key results"
        />
      </div>
    </div>
  );
};

export default KeyResultHeader;
