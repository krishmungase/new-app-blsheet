import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "@/components";
import { Document, Member } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetDocsFilters from "../hooks/use-get-docs-filters";
import DeleteDoc from "./delete-doc";
import { DOC_ACCESS_TYPE_COLOR, DOC_STATUS_TYPE_COLOR } from "@/constants";

interface DocTableProps {
  docs: Document[];
  isLoading: boolean;
  refetchDocs: () => void;
}

const DocTable = ({ docs, isLoading, refetchDocs }: DocTableProps) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { createdByMe } = useGetDocsFilters();

  if (isLoading) return <Loader />;

  if (!docs?.length) {
    return (
      <div className="flex items-center justify-center py-8">
        <h1>Documents not found.</h1>
      </div>
    );
  }

  return (
    <div className="border rounded-tl-lg rounded-tr-lg overflow-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px] text-foreground border-r">
              Title
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Creator
            </TableHead>
            <TableHead className="min-w-[200px] text-foreground border-r">
              Members
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground border-r">
              Status
            </TableHead>
            <TableHead className="min-w-[150px] text-foreground border-r">
              Shared
            </TableHead>
            {createdByMe === "true" && (
              <TableHead className="min-w-[150px] text-foreground">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((doc: Document) => (
            <TableRow key={doc._id}>
              <TableCell
                onClick={() =>
                  navigate(`/dashboard/workspace/${projectId}/docs/${doc._id}`)
                }
                className="text-active hover:text-active/80 cursor-pointer font-medium border-r"
              >
                {doc.title}
              </TableCell>
              <TableCell className="border-r">
                <div className="flex items-center space-x-2">
                  <Avatar className="flex items-center justify-center size-6">
                    <AvatarImage
                      src={doc?.creator?.avatar?.url}
                      alt="profile-picture"
                    />
                    <AvatarFallback className="bg-foreground text-card">
                      {doc.creator.fullName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{doc.creator.fullName}</span>
                </div>
              </TableCell>
              {doc?.members?.length ? (
                <TableCell className="border-r">
                  <div className="flex items-center">
                    {doc.members.map((member: Member) => (
                      <Tooltip key={member._id}>
                        <TooltipContent className="text-xs">
                          {member.email}
                        </TooltipContent>
                        <TooltipTrigger>
                          <Avatar
                            key={member._id}
                            className="size-6 flex items-center justify-center"
                          >
                            <AvatarFallback className="bg-active text-white">
                              {member.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
              ) : (
                <TableCell className="border-r">-</TableCell>
              )}
              <TableCell className="border-r">
                <span
                  className={`${
                    DOC_STATUS_TYPE_COLOR[doc.status]
                  } text-white rounded-full text-xs px-3 py-1`}
                >
                  {doc.status}
                </span>
              </TableCell>

              <TableCell className="border-r">
                <span
                  className={`${
                    DOC_ACCESS_TYPE_COLOR[doc.accessType]
                  } text-white rounded-full text-xs px-3 py-1`}
                >
                  {doc.accessType}
                </span>
              </TableCell>
              {createdByMe === "true" && (
                <TableCell>
                  <DeleteDoc
                    projectId={projectId as string}
                    docId={doc?._id}
                    refetch={refetchDocs}
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

export default DocTable;
