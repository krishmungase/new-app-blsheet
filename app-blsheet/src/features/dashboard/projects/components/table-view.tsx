import { cn } from "@/lib/utils";
import { Project } from "@/types";
import { MEMBER_ROLE_COLORS } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface TableViewProps {
  projects: Project[];
}

const TableView = ({ projects }: TableViewProps) => {
  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Name
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Description
            </TableHead>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Owner
            </TableHead>
            <TableHead className="text-foreground">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(projects || []).map((project) => (
            <TableRow key={project.projectId}>
              <TableCell className="font-medium border-r">
                <Link
                  to={`/dashboard/projects/${project.projectId}/details`}
                  className="text-active hover:text-active/80"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="border-r">{project.description}</TableCell>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={project?.owner?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {project.owner.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{project.owner.fullName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    MEMBER_ROLE_COLORS[project.role],
                    "w-[100px] flex items-center justify-center"
                  )}
                >
                  {project.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
