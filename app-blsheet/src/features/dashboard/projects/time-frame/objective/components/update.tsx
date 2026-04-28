import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, LoaderCircle } from "lucide-react";

import { Objective } from "@/types";
import { Button, DateRangePicker } from "@/components";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { objectiveSchema, ObjectiveValue } from "./schema";
import useUpdateObjective from "../hooks/use-update-objective";
import TeamAndOwner from "../../components/team-and-owner";

interface UpdateProps {
  refetch: () => void;
  objective: Objective;
}

const Update = ({ refetch, objective }: UpdateProps) => {
  const { projectId, timeFrameId } = useParams();

  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [teamDetails, setTeamDetails] = useState<{
    teamId: string;
    ownerId: string;
  }>({ teamId: objective.team._id, ownerId: objective.owner._id as string });

  const form = useForm<ObjectiveValue>({
    resolver: zodResolver(objectiveSchema),
    mode: "onChange",
    defaultValues: { ...objective },
  });

  useEffect(() => {
    setTeamDetails({
      teamId: objective.team._id,
      ownerId: objective.owner._id as string,
    });
    setDate({
      to: new Date(objective.startDate),
      from: new Date(objective.endDate),
    });
  }, [objective]);

  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, mutate } = useUpdateObjective({
    callAfterSuccess: () => {
      setOpen(false);
      refetch();
    },
  });

  const onSubmit = (data: ObjectiveValue) => {
    if (!date?.to || !date?.from) {
      toast.error("Plese select timeline");
      return;
    }
    if (!teamDetails?.teamId || !teamDetails?.ownerId) {
      toast.error("Plese select team details");
      return;
    }

    mutate({
      data: {
        ...data,
        projectId,
        timeFrameId,
        startDate: date.from,
        endDate: date.to,
        ...teamDetails,
        objectiveId: objective._id,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="text-green-500 hover:text-green-500/80"
        >
          <Edit size={15} />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">Update Objective</SheetTitle>
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
                      <Input
                        placeholder="Objective title"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Objective Description"
                        className="focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DateRangePicker
                date={date}
                setDate={setDate}
                placeholder="Timeline"
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
