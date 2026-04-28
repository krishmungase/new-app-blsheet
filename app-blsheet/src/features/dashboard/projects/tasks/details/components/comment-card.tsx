import { formatDistance } from "date-fns";
import { useParams } from "react-router-dom";

import { Comment, CommentType, MemberRole } from "@/types";
import { DottedSeparator } from "@/components";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useProject from "@/hooks/use-project";
import ProseStyleComponent from "@/components/shared/prose-style-comp";

import UpdateComment from "./update-comment";
import DeleteComment from "./delete-comment";
import {
  AlignVerticalJustifyStartIcon,
  CircleDashedIcon,
  LucideIcon,
  Pencil,
  PencilIcon,
  UngroupIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react";

interface CommentCardProps {
  comment: Comment;
  refetchTask: () => void;
}

const ICON_MAP: Record<CommentType, LucideIcon> = {
  [CommentType.GENERAL]: AlignVerticalJustifyStartIcon,
  [CommentType.COMMENT_UPDATED]: PencilIcon,
  [CommentType.STATUS_UPDATED]: CircleDashedIcon,
  [CommentType.ASSIGNED_MEMBER]: UserPlusIcon,
  [CommentType.REMOVE_ASSIGNED_MEMBER]: UserMinusIcon,
  [CommentType.SUBTASK_UPDATED]: UngroupIcon,
};

const CommentCard = ({ comment, refetchTask }: CommentCardProps) => {
  const { taskId } = useParams();
  const { project } = useProject();
  const IconComponent = ICON_MAP[comment.commentType];

  if (
    comment.commentType === CommentType.COMMENT_UPDATED ||
    comment.commentType === CommentType.SUBTASK_UPDATED
  ) {
    return (
      <div>
        <DottedSeparator
          direction="vertical"
          className="h-6 px-6"
          color="blue"
        />
        <div className="border rounded-md">
          <div className="bg-muted items-center justify-between w-full px-3 border-b py-1 md:py-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <div className="flex items-center bg-foreground justify-center size-6 rounded-full">
                <Pencil size={12} className="text-card" />
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
            <div className="text-xs py-1 text-muted-foreground justify-end items-center flex">
              <span>{formatDistance(comment.createdAt, new Date())} ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (
    comment.commentType === CommentType.STATUS_UPDATED ||
    comment.commentType === CommentType.ASSIGNED_MEMBER ||
    comment.commentType === CommentType.REMOVE_ASSIGNED_MEMBER
  ) {
    return (
      <div>
        <DottedSeparator
          direction="vertical"
          className="h-6 px-6"
          color="blue"
        />
        <div className="border bg-muted rounded-md">
          <div className="flex items-center justify-between w-full px-3 py-1 md:py-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center bg-foreground justify-center size-6 rounded-full">
                  <IconComponent size={12} className="text-card" />
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <Avatar className="flex items-center justify-center size-5">
                    <AvatarFallback className="bg-foreground text-card text-xs">
                      {comment?.author?.user?.fullName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {comment?.author?.user?.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm px-6 md:px-8">{comment.content}</p>
          <div className="flex items-center justify-end px-4 py-2">
            <div className="text-xs text-muted-foreground">
              {formatDistance(comment.createdAt, new Date())} ago
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DottedSeparator direction="vertical" className="h-6 px-6" color="blue" />
      <div className="border rounded-md">
        <div className="bg-secondary flex items-center justify-between w-full px-3 border-b py-1 md:py-2">
          <div className="flex items-center justify-center space-x-2">
            <Avatar className="flex items-center justify-center size-6">
              <AvatarFallback className="bg-foreground text-card text-sm">
                {comment?.author?.user?.fullName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{comment?.author?.user?.fullName}</span>
          </div>
        </div>
        <ProseStyleComponent content={comment.content} />

        <div className="flex items-center justify-between px-6 md:px-8 border-t py-1">
          <div className="text-xs py-1 text-muted-foreground">
            {formatDistance(comment.createdAt, new Date())} ago
          </div>

          {(comment?.author?.isAuthor ||
            project?.role !== MemberRole.MEMBER) && (
            <div className="space-x-3 flex items-center">
              <UpdateComment
                comment={comment}
                taskId={taskId as string}
                refetchTask={refetchTask}
              />
              <DeleteComment
                taskId={taskId as string}
                refetchTask={refetchTask}
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
