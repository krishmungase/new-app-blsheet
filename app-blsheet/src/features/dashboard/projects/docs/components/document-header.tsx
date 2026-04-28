import { cn } from "@/lib/utils";
import { ContactRoundIcon, FilePlusIcon, NotepadTextIcon } from "lucide-react";
import useGetDocsFilters from "../hooks/use-get-docs-filters";

const DocumentHeader = () => {
  const { title, setFilters, isPublic, assignedToMe, createdByMe } =
    useGetDocsFilters();

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 sm:gap-6 border-b">
        {[
          {
            value: "isPublic",
            label: "Public",
            isSelected: isPublic === "true",
            icon: <NotepadTextIcon size={12} />,
          },
          {
            value: "assignedToMe",
            label: "Assigned",
            isSelected: assignedToMe === "true",
            icon: <ContactRoundIcon size={12} />,
          },
          {
            value: "createdByMe",
            label: "Created",
            isSelected: createdByMe === "true",
            icon: <FilePlusIcon size={12} />,
          },
        ].map((filter) => (
          <button
            onClick={() =>
              setFilters({
                [filter.value]: "true",
                title: title as string,
              })
            }
            key={filter.value}
            className={cn(
              "pb-2 text-sm flex gap-1 items-center",
              filter.isSelected && "text-primary border-b border-primary"
            )}
          >
            <span>{filter.icon}</span>
            <span> {filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DocumentHeader;
