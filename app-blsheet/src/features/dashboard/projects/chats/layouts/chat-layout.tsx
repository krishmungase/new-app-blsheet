import { Outlet } from "react-router-dom";

import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";

import Sidebar from "../components/sidebar";
import Thread from "../channel/components/thread";
import useGetMessagesFilter from "../channel/hooks/use-get-messages-filter";

const ChatLayout = () => {
  const { parentMessageId } = useGetMessagesFilter();
  const showPanel = !!parentMessageId;

  return (
    <div>
      <div className="flex h-[calc(100vh_-100px)] border">
        <ResizablePanelGroup direction="horizontal" autoSaveId="blsheet-id">
          <ResizablePanel defaultSize={20} minSize={11} className="bg-muted/50">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>
            <Outlet />
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                <Thread />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChatLayout;
