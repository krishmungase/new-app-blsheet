import { useState } from "react";
import { useParams } from "react-router-dom";
import { HashIcon } from "lucide-react";

import useProject from "@/hooks/use-project";

import SidebarItem from "./sidebar-item";
import ChatSection from "./chat-section";
import MemberItem from "./member-item";

import CreateChannel from "./create-channel";
import CreateConversation from "./create-conversation";
import useGetChannels from "../channel/hooks/use-get-channels";
import useGetConversations from "../conversation/hooks/use-get-conversations";

const Sidebar = () => {
  const { project } = useProject();
  const { channelId, conversationId } = useParams();

  const { loadingChannels, channels, refetchChannels } = useGetChannels();
  const { loadingConversations, conversations, refetchConversations } =
    useGetConversations();

  const [openCreateChannelDialog, setOpenCreateChannelDialog] = useState(false);
  const [openCreateConversationDialog, setOpenCreateConversationDialog] =
    useState(false);

  return (
    <>
      <CreateChannel
        open={openCreateChannelDialog}
        setOpen={setOpenCreateChannelDialog}
        refetch={refetchChannels}
      />
      <CreateConversation
        open={openCreateConversationDialog}
        setOpen={setOpenCreateConversationDialog}
        refetch={refetchConversations}
      />
      <ChatSection
        label="Channels"
        hint="New channel"
        onNew={() => setOpenCreateChannelDialog(true)}
        isLoading={loadingChannels}
        isDM={false}
      >
        {channels.map((c) => (
          <SidebarItem
            icon={HashIcon}
            label={c.name}
            id={c._id}
            key={c._id}
            variant={channelId === c._id ? "active" : "default"}
          />
        ))}
      </ChatSection>

      <ChatSection
        label="Direct Messages"
        hint="New Conversation"
        onNew={() => setOpenCreateConversationDialog(true)}
        isLoading={loadingConversations}
        isDM={true}
      >
        {conversations.map((c) => (
          <MemberItem
            key={c._id}
            id={c._id}
            member={
              c.memberOne?._id === project?.memberId ? c.memberTwo : c.memberOne
            }
            variant={conversationId === c._id ? "active" : "default"}
          />
        ))}
      </ChatSection>
    </>
  );
};

export default Sidebar;
