import { format, isToday, isYesterday } from "date-fns";
import { Message, Reaction } from "@/types";

import Toolbar from "./toolbar";
import Hint from "../ui/hint";
import Renderer from "./renderer";
import Thumbnail from "./thumbnail";
import QuillEditor from "../quill-editor";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Reactions from "./reactions";
import usePanel from "@/features/dashboard/projects/chats/channel/hooks/use-panel";

interface DispayMessageProps {
  id: string;
  member: Message["member"];
  body: string;
  image: Message["image"];
  createdAt: Date;
  updatedAt: Date;
  isCreator: boolean;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  isCompact: boolean;
  hideThreadButton: boolean;
  threadCount: number;
  handleEdit: (data: any) => void;
  loadingEditMessage: boolean;
  loadingDeleteMessage: boolean;
  handleDelete: (messageId: string) => void;
  loadingAddReaction: boolean;
  handleReaction: (data: any) => void;
  reactions: Reaction[];
  memberId: string;
  handleThread: () => void;
  hideToolBar?: boolean;
}

const formatFullTime = (createdAt: Date) => {
  return `${
    isToday(createdAt)
      ? "Today"
      : isYesterday(createdAt)
      ? "Yesterday"
      : format(createdAt, "MMM d, yyyy")
  } at ${format(createdAt, "hh:mm:ss a")}`;
};

const DisplayMessage = ({
  id,
  body,
  createdAt,
  updatedAt,
  isCompact,
  image,
  member,
  isEditing,
  isCreator,
  hideThreadButton,
  setEditingId,
  handleEdit,
  loadingEditMessage,
  loadingDeleteMessage,
  handleDelete,
  handleReaction,
  reactions,
  memberId,
  handleThread,
  hideToolBar,
}: DispayMessageProps) => {
  const { parentMessageId } = usePanel();
  if (isCompact)
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-muted/60 group relative",
          isEditing && "bg-primary/10 hover:!bg-primary/10",
          parentMessageId === id && "bg-muted/60"
        )}
      >
        {isEditing ? (
          <div className="w-full">
            <QuillEditor
              placeholder="Update message"
              defaultValue={JSON.parse(body)}
              disabled={false}
              variant="update"
              onSubmit={(value: any) => handleEdit({ ...value, messageId: id })}
              onCancel={() => setEditingId(null)}
              isLoading={loadingEditMessage}
            />
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            <div className="flex flex-col w-full">
              <Renderer body={body} />
              <Thumbnail url={image?.url} />
              <Reactions
                memberId={memberId}
                reactions={reactions}
                handleReaction={(data: any) =>
                  handleReaction({ value: data, messageId: id })
                }
              />
              {createdAt !== updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
          </div>
        )}
        {!isEditing && !hideToolBar && (
          <Toolbar
            handleEdit={() => setEditingId(id)}
            handleDelete={() => handleDelete(id)}
            loadingDeleteMessage={loadingDeleteMessage}
            handleReaction={(data: any) =>
              handleReaction({ value: data, messageId: id })
            }
            handleThread={handleThread}
            hideThreadButton={hideThreadButton}
            isCreator={isCreator}
          />
        )}
      </div>
    );

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:dark:bg-muted/50 hover:bg-muted/80 group relative",
        isEditing && "bg-primary/10 hover:!bg-primary/10",
        parentMessageId === id && "bg-muted/60"
      )}
    >
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="bg-primary rounded-md">
            <AvatarImage src={member?.user?.avatar?.url} alt="profile" />
            <AvatarFallback className="flex bg-primary items-center !text-white justify-center rounded-md w-full text-sm h-full text-card">
              {member?.user?.fullName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>

        {isEditing ? (
          <div className="w-full">
            <QuillEditor
              placeholder="Update message"
              defaultValue={JSON.parse(body)}
              disabled={false}
              variant="update"
              onSubmit={(value: any) => handleEdit({ ...value, messageId: id })}
              onCancel={() => setEditingId(null)}
              isLoading={loadingEditMessage}
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                onClick={() => {}}
                className="font-bold text-primary hover:underline"
              >
                {member.user.fullName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullTime(createdAt)}>
                <button className="text-xs text-muted-foreground hover:underline">
                  {format(new Date(createdAt), "hh:mm a")}
                </button>
              </Hint>
            </div>
            <Renderer body={body} />
            <Thumbnail url={image?.url} />
            <Reactions
              memberId={memberId}
              reactions={reactions}
              handleReaction={(data: any) =>
                handleReaction({ value: data, messageId: id })
              }
            />
            {createdAt !== updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        )}
      </div>
      {!isEditing && !hideToolBar && (
        <Toolbar
          handleEdit={() => setEditingId(id)}
          handleDelete={() => handleDelete(id)}
          loadingDeleteMessage={loadingDeleteMessage}
          handleReaction={(data: any) =>
            handleReaction({ value: data, messageId: id })
          }
          handleThread={handleThread}
          hideThreadButton={hideThreadButton}
          isCreator={isCreator}
        />
      )}
    </div>
  );
};

export default DisplayMessage;
