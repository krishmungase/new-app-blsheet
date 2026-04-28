import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ConversationForm from "./conversation-form";

interface CreateConversationProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: () => void;
}

const CreateConversation = ({
  open,
  setOpen,
  refetch,
}: CreateConversationProps) => {
  const { projectId } = useParams();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-active mb-2">
            Create new Conversation
          </DialogTitle>
          <DialogDescription>
            Enter the email address of the member.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center w-full">
          <ConversationForm
            onClose={() => setOpen(false)}
            projectId={projectId as string}
            refetch={refetch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConversation;
