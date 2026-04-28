import useProject from "@/hooks/use-project";
import General from "./general";
import { MemberRole } from "@/types";
import AlertMSG from "./components/alert-msg";
import { useUpdateDocumentTitle } from "@/hooks";

const ProjectSettings = () => {
  const { project } = useProject();

  useUpdateDocumentTitle({
    title: `Settings - ${project?.name}`,
  });

  if (project?.role !== MemberRole.OWNER) {
    return <AlertMSG />;
  }

  return (
    <div className="relative">
      <div className="pb-5 scroll-smooth">
        <div className="md:px-8 overflow-y-auto h-[calc(100vh_-160px)]">
          <General />
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
