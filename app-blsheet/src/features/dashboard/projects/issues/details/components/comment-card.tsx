import { formatDistance } from "date-fns";
import { useParams } from "react-router-dom";

import { Comment, MemberRole } from "@/types";
import { DottedSeparator } from "@/components";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useProject from "@/hooks/use-project";
import ProseStyleComponent from "@/components/shared/prose-style-comp";

import UpdateComment from "./update-comment";
import DeleteComment from "./delete-comment";

interface CommentCardProps {
  comment: Comment;
  refetchIssue: () => void;
}

const CommentCard = ({ comment, refetchIssue }: CommentCardProps) => {
  const { issueId } = useParams();
  const { project } = useProject();

  return (
    <div>
      <DottedSeparator direction="vertical" className="h-6 px-6" color="blue" />
      <div className="border rounded-md">
        <div className="bg-secondary flex items-center justify-between w-full px-3 border-b py-1 md:py-2">
          <div className="flex items-center justify-center space-x-1">
            <Avatar className="flex items-center justify-center size-6">
              <AvatarFallback className="bg-foreground text-card text-sm">
                {comment?.author?.user?.fullName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{comment?.author?.user?.fullName}</span>
          </div>
        </div>

        <ProseStyleComponent content={comment.content} />

        {/* <div className="text-foreground !min-w-full prose-sm px-6 md:px-8 prose py-1 md:py-2 prose-a:text-blue-500 hover:prose-a:text-blue-500/80 prose-ol:ml-5 prose-ul:ml-5">
          <div dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div> */}

        <div className="flex items-center justify-between px-6 md:px-8 border-t py-1">
          <div className="text-xs py-1 text-muted-foreground">
            {formatDistance(comment.createdAt, new Date())} ago
          </div>

          {(comment?.author?.isAuthor ||
            project?.role !== MemberRole.MEMBER) && (
            <div className="space-x-3 flex items-center">
              <UpdateComment
                comment={comment}
                issueId={issueId as string}
                refetchIssue={refetchIssue}
              />
              <DeleteComment
                issueId={issueId as string}
                refetchIssue={refetchIssue}
                commentId={comment._id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
