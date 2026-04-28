import MultiSelectFilters from "@/components/shared/multi-select-filters";
import useGetIssueFilters from "../hooks/use-get-issues-filters";

const IssueFilters = () => {
  const {
    setFilters,
    assignedToMe,
    createdByMe,
    sortByCreated,
    title,
    status,
  } = useGetIssueFilters();
  return (
    <MultiSelectFilters
      title="Filters"
      options={[
        {
          value: "assignedToMe",
          label: "Assigned To Me",
          isSelected: assignedToMe === "true",
        },
        {
          value: "createdByMe",
          label: "Created By Me",
          isSelected: createdByMe === "true",
        },
        {
          value: "sortByCreated",
          label: "Sort By Created",
          isSelected: sortByCreated === "true",
        },
      ]}
      fn={(value: any) => {
        setFilters({
          assignedToMe,
          sortByCreated,
          createdByMe,
          title: title as string,
          status,
          ...value,
        });
      }}
    />
  );
};

export default IssueFilters;
