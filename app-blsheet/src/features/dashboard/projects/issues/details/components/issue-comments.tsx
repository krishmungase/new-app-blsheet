import { Comment } from "@/types";
import { DottedSeparator } from "@/components";

import CommentForm from "./comment-form";
import CommentCard from "./comment-card";

interface IssueCommentsProps {
  issueId: string;
  refetchIssue: () => void;
  comments: Comment[];
}

const IssueComments = ({
  issueId,
  refetchIssue,
  comments,
}: IssueCommentsProps) => {
  return (
    <div className="relative">
      <h1 className="text-sm font-medium text-active">Disscussions</h1>
      {comments.map((comment) => (
        <CommentCard comment={comment} refetchIssue={refetchIssue} />
      ))}
      <DottedSeparator className="my-6" color="blue" />
      <CommentForm issueId={issueId} refetch={refetchIssue} />
    </div>
  );
};

export default IssueComments;
