import { SearchInput } from "@/components";

import useGetDocsFilters from "../hooks/use-get-docs-filters";
import CreateDoc from "./create-doc";

const DocsFilters = () => {
  const {
    title,
    setFilters,
    isPublic,
    assignedToMe,
    createdByMe,
    sortByCreated,
  } = useGetDocsFilters();

  return (
    <div className="flex items-center sm:space-x-2 flex-col sm:flex-row gap-2">
      <SearchInput
        fn={(title?: string) =>
          setFilters({
            assignedToMe: assignedToMe as string,
            createdByMe: createdByMe as string,
            sortByCreated: sortByCreated as string,
            isPublic: isPublic as string,
            title,
          })
        }
        text={title ? title : ""}
        placeholder="Search all documents"
      />

      <CreateDoc />
    </div>
  );
};

export default DocsFilters;
