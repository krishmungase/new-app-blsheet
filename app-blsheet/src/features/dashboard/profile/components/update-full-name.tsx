import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

import { useAuth } from "@/hooks";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import useUpdateName from "../hooks/use-update-name";

const UpdateFullName = () => {
  const { user } = useAuth();
  const { isLoading, mutate } = useUpdateName({
    onClose: () => setOpen(false),
  });
  const [fullName, setFullName] = useState<string | undefined>(user?.fullName);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFullName(e.target.value);
  const handleonSubmit = () => mutate({ data: { fullName } });

  return (
    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
      <h1 className="text-primary font-medium text-base sm:text-xl lg:text-3xl">
        {user?.fullName}
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <FaRegEdit className="text-green-600 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base">Update Full Name</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-start gap-4">
            <Input
              id="fullName"
              value={fullName}
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="button" onClick={handleonSubmit}>
              {isLoading && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateFullName;
