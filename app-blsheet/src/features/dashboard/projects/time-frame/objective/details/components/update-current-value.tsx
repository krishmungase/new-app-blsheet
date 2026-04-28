import { useEffect, useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";

import { KeyResult } from "@/types";
import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUpdateCurrentValue from "../hooks/use-update-current-value";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import Hint from "@/components/ui/hint";

interface UpdateCurrentValueProps {
  keyResult: KeyResult;
  refetch: () => void;
}

const UpdateCurrentValue = ({
  keyResult,
  refetch,
}: UpdateCurrentValueProps) => {
  const { projectId } = useParams();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [comment, setComment] = useState("");

  const { isLoading, mutate } = useUpdateCurrentValue({
    callAfterSuccess: () => {
      setOpen(false);
      refetch();
    },
  });

  useEffect(() => {
    setValue(keyResult.currentValue);
  }, [keyResult]);

  const handleonSubmit = () => {
    if (!value) {
      toast.error("Please enter current value");
      return;
    }
    const data = {
      keyResultId: keyResult._id,
      projectId,
      currentValue: value,
      comment,
    };

    mutate({ data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Hint label="Update KR Current Value">
          <button onClick={() => setOpen(true)}>
            <SlidersHorizontal
              size={15}
              className="text-blue-600 cursor-pointer"
            />
          </button>
        </Hint>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base">Update Current Value</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleonSubmit();
          }}
        >
          <div className="flex flex-col items-start gap-4 mb-3">
            <Input
              type="text"
              placeholder="Add comment"
              value={comment}
              className="col-span-3 hidden"
              onChange={(e) => setComment(e.target.value)}
            />
            <Input
              type="number"
              value={value}
              placeholder="Enter current value"
              className="col-span-3"
              onChange={(e) => setValue(e.target.value as unknown as number)}
            />
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCurrentValue;
