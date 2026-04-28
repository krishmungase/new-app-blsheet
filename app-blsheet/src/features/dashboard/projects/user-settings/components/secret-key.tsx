import { Copy, Loader2 } from "lucide-react";

import { toast } from "@/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components";
import { SecretKey as SecretKeyType } from "@/types";
import useCreateSecretKey from "../hooks/use-create-secret-key";
import useUpdateSecretKey from "../hooks/use-update-secret-key";
import useDeleteSecretKey from "../hooks/use-delete-secret-key";
import ConfirmationButton from "@/components/shared/confirmation-button";

interface UpdateOpenAIKeyProps {
  secretKey: SecretKeyType;
  refetch: () => void;
}

const SecretKey = ({ secretKey, refetch }: UpdateOpenAIKeyProps) => {
  const fn = () => refetch();
  const { createSecretKey, isCreatingSecretKey } = useCreateSecretKey({ fn });
  const { updateSecretKey, isUpdatingSecretKey } = useUpdateSecretKey({ fn });
  const { deleteSecretKey, isDeletingSecretKey } = useDeleteSecretKey({ fn });

  const handleGenerateSecretKey = () => {
    if (secretKey?.secretKey) updateSecretKey();
    else createSecretKey();
  };

  return (
    <div className="relative space-y-1 bg-muted rounded-lg border">
      <div className="flex items-center justify-between space-x-2 border-b border-muted-foreground/40 p-3 ">
        <h1 className="text-[15px] font-medium text-foreground">Secret Key</h1>
        <div className="flex items-center justify-center gap-3">
          {secretKey?.secretKey && (
            <ConfirmationButton
              onDelete={() => deleteSecretKey()}
              isLoading={isDeletingSecretKey}
              itemName="Secret Key"
              text="Delete"
            />
          )}
          {!secretKey?.secretKey && (
            <Button
              onClick={handleGenerateSecretKey}
              disabled={isCreatingSecretKey || isUpdatingSecretKey}
            >
              {isCreatingSecretKey ||
                (isUpdatingSecretKey && <Loader2 className="animate-spin" />)}
              {secretKey?.secretKey
                ? "Regenerate Secret Key"
                : "Generate Secret Key"}
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between space-x-3 p-3 ">
        {secretKey?.secretKey ? (
          <>
            <Input
              value={
                secretKey?.secretKey.slice(0, 20) +
                "*".repeat(secretKey?.secretKey.slice(20).length)
              }
              disabled
            />
            <button
              className="bg-muted-foreground/20 rounded-md border p-2 hover:bg-muted-foreground/30 transition-all"
              onClick={() => {
                navigator.clipboard.writeText(secretKey?.secretKey as string);
                toast({
                  title: "Secret Key",
                  description: "Secret key copied successfully",
                  variant: "default",
                });
              }}
            >
              <Copy size={15} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center">
            Create secret key
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretKey;
