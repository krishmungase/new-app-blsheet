import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Edit, LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { KeyResult } from "@/types";
import { Button } from "@/components";
import Hint from "@/components/ui/hint";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { keyResultSchema, KeyResultValue } from "./schema";
import useUpdateKeyResult from "../hooks/use-update-key-result";
import TeamAndOwner from "../../../components/team-and-owner";

interface UpdateProps {
  refetch: () => void;
  keyResult: KeyResult;
}

const Update = ({ refetch, keyResult }: UpdateProps) => {
  const { projectId, timeFrameId, objectiveId } = useParams();

  const [teamDetails, setTeamDetails] = useState<{
    teamId: string;
    ownerId: string;
  }>({ teamId: "", ownerId: "" });

  const form = useForm<KeyResultValue>({
    resolver: zodResolver(keyResultSchema),
    mode: "onChange",
    defaultValues: { ...keyResult },
  });

  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, mutate } = useUpdateKeyResult({
    callAfterSuccess: () => {
      setOpen(false);
      refetch();
    },
  });

  useEffect(() => {
    setTeamDetails({
      teamId: keyResult.team._id,
      ownerId: keyResult.owner?._id as string,
    });
  }, [keyResult]);

  const onSubmit = (data: KeyResultValue) => {
    if (!teamDetails?.teamId || !teamDetails?.ownerId) {
      toast.error("Plese select team details");
      return;
    }

    mutate({
      data: {
        projectId,
        timeFrameId,
        objectiveId,
        keyResultId: keyResult._id,
        ...data,
        ...teamDetails,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Hint label="Update KR">
          <button
            onClick={() => setOpen(true)}
            className="text-green-500 hover:text-green-500/80"
          >
            <Edit size={15} />
          </button>
        </Hint>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">Update Key Result</SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <div className="bg-active/5 border border-active/10 p-6 rounded-lg">
          <Form {...form}>
            <form
              className="flex flex-col space-y-6 md:px-0"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Title"
                        className="focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Target Value"
                        className="focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Unit"
                        className="focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <TeamAndOwner
                teamDetails={teamDetails}
                setTeamDetails={setTeamDetails}
              />

              <SheetFooter>
                <Button
                  variant="primary"
                  size="sm"
                  className="px-6 rounded-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <LoaderCircle className="mr-1 size-4 animate-spin" />
                  )}
                  Update
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Update;
