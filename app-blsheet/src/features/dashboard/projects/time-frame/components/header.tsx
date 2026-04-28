import { MemberRole } from "@/types";
import { SearchInput } from "@/components";
import useProject from "@/hooks/use-project";

import useGetTimeFramesFilters from "../hooks/use-get-time-frames-filters";
import Create from "./create";

interface HeaderProps {
  total: number;
  refetch: () => void;
}

const Header = ({ total, refetch }: HeaderProps) => {
  const { setFilters, label } = useGetTimeFramesFilters();
  const { project } = useProject();

  return (
    <div className="p-2 bg-muted border flex-col sm:flex-row rounded-lg flex gap-2 sm:items-center sm:justify-between">
      <div className="text-center">
        <span className="text-base">Time Frames</span>{" "}
        <span className="text-card bg-secondary-foreground rounded-xl sm:px-2 px-4 md:px-4 text-xs md:text-sm py-1">
          {total}
        </span>
      </div>

      <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2 sm:w-fit">
        <SearchInput
          fn={(label?: string) => setFilters({ label })}
          text={label ? label : ""}
          placeholder="Search all time frames"
        />
        {project?.role !== MemberRole.MEMBER && <Create refetch={refetch} />}
      </div>
    </div>
  );
};

export default Header;
