import { Button } from "@/components";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProject from "@/hooks/use-project";
import { Label, MemberRole } from "@/types";
import DeleteLabel from "./delete-label";

const LabelTable = ({
  total,
  labels,
  setUpdateLabel,
  refetch,
}: {
  total: number;
  labels: Label[];
  setUpdateLabel: any;
  refetch: () => void;
}) => {
  const { project } = useProject();

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] text-foreground">
              {total} labels
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(labels || []).map((label: Label) => (
            <TableRow key={label._id}>
              <TableCell>
                <Badge
                  style={{
                    background: `${label.color}40`,
                    color: `${label.color}`,
                    border: `${label.color}`,
                  }}
                >
                  {label.name}
                </Badge>
              </TableCell>
              <TableCell className="text-xs">
                <div className="hidden sm:block">{label?.description}</div>
              </TableCell>
              {project?.role !== MemberRole.MEMBER && (
                <TableCell className="text-xs gap-2 flex">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setUpdateLabel(label)}
                  >
                    Edit
                  </Button>
                  <DeleteLabel
                    labelId={label._id}
                    projectId={project?.projectId as string}
                    refetch={refetch}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LabelTable;
