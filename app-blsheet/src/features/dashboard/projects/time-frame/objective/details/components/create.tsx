import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { LoaderCircle, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import { keyResultSchema, KeyResultValue } from "./schema";
import useCreateKeyResult from "../hooks/use-create-key-result";
import TeamAndOwner from "../../../components/team-and-owner";

interface CreateProps {
  refetch: () => void;
}

const Create = ({ refetch }: CreateProps) => {
  const { projectId, timeFrameId, objectiveId } = useParams();

  const [teamDetails, setTeamDetails] = useState<{
    teamId: string;
    ownerId: string;
  }>({ teamId: "", ownerId: "" });

  const form = useForm<KeyResultValue>({
    resolver: zodResolver(keyResultSchema),
    mode: "onChange",
  });

  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, mutate } = useCreateKeyResult({
    callAfterSuccess: () => {
      setOpen(false);
      form.reset({});
      setTeamDetails({ teamId: "", ownerId: "" });
      refetch();
    },
  });

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
        ...data,
        ...teamDetails,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="w-full sm:w-fit"
        >
          <Plus />
          Key Result
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">Create New Key Result</SheetTitle>
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
                  Create
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Create;
