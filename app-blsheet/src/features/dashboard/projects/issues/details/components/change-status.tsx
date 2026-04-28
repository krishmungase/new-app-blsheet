import { formatDistance } from "date-fns";
import { CircleDot, LoaderCircle } from "lucide-react";

import { Button } from "@/components";
import { IssueStatus } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useIssueContext } from "../provider";
import { useMutation } from "react-query";
import apis from "../../apis";
import { toast, useAuth } from "@/hooks";

const ChangeStatus = () => {
  const { issue, refetchIssue } = useIssueContext();
  const { authToken } = useAuth();

  const { isLoading, mutate } = useMutation({
    mutationFn: ({ data }: any) => apis.changeStatus({ data, authToken }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Issue status updated successfully",
      });
      refetchIssue();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message,
      });
    },
    retry: 0,
  });

  const handleChangeStatus = (status: IssueStatus) => {
    mutate({ data: { issueId: issue?._id, status } });
  };

  if (!issue) return null;

  if (issue.status === IssueStatus.OPEN) {
    return (
      <div className="flex items-center md:justify-end">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleChangeStatus(IssueStatus.CLOSED)}
        >
          {isLoading ? <LoaderCircle /> : <CircleDot />}
          Close Issue
        </Button>
      </div>
    );
  }

  return (
    <div className="flex xl:items-center xl:space-x-3 justify-between flex-col space-y-2 xl:space-y-0 xl:flex-row">
      <div className="flex justify-between items-center space-x-1 flex-row">
        <div className="flex xl:items-center xl:justify-center space-x-1">
          <Avatar className="flex items-center justify-center size-6">
            <AvatarImage
              src={issue?.closedBy?.avatar?.url}
              alt="profile-picture"
            />
            <AvatarFallback className="flex bg-foreground items-center text-sm justify-center w-full h-full text-card">
              {issue?.closedBy?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground text-xs items-center justify-center hidden sm:flex">
            {issue?.closedBy?.fullName}
          </span>
        </div>

        <span className="text-xs">
          Closed this {formatDistance(issue.closedDate, new Date())} ago
        </span>
      </div>

      <div className="w-full xl:w-fit">
        <Button
          size="sm"
          variant="primary"
          className="w-full"
          onClick={() => handleChangeStatus(IssueStatus.OPEN)}
        >
          {isLoading ? <LoaderCircle /> : <CircleDot />}
          Open Issue
        </Button>
      </div>
    </div>
  );
};

export default ChangeStatus;
