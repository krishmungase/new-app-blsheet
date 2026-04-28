import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Issue } from "@/types";
import { formatDistance } from "date-fns";
import { CircleDot } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const navigate = useNavigate();
  const handleOnClick = () =>
    navigate(`/dashboard/workspace/${issue.projectId}/issues/${issue._id}`);
  return (
    <div className="border-b p-3 last:border-b-0">
      <div
        className="flex items-center space-x-2 text-foreground hover:text-active transition-all cursor-pointer"
        onClick={handleOnClick}
      >
        <div className="relative hidden sm:block">
          <CircleDot size={15} />
        </div>
        <h1 className="font-semibold text-sm md:text-base">{issue.title}</h1>
      </div>
      <div className="flex space-y-2 sm:space-y-0 sm:items-center flex-col sm:flex-row sm:justify-between mt-3">
        <div className="flex items-center sm:justify-center space-x-2">
          <Avatar className="flex items-center justify-center size-6">
            <AvatarImage
              src={issue?.creator?.avatar?.url}
              alt="profile-picture"
            />
            <AvatarFallback className="flex items-center bg-foreground text-sm justify-center w-full h-full text-card">
              {issue?.creator?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px]">{issue.creator.fullName}</span>
        </div>

        <span className="text-xs text-muted-foreground">
          Opened {formatDistance(issue.createdAt, new Date())} ago
        </span>
      </div>
    </div>
  );
};

export default IssueCard;
