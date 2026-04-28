import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, LoaderCircle } from "lucide-react";
import ReactQuill from "react-quill";

import useCreateIssue from "../hooks/use-create-issue";
import { issueShema, IssueValues } from "./issue-schema";

import { Issue } from "@/types";
import { Button, SelectField } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { PRIORITY_OPTIONS, TASK_TYPE_OPTIONS } from "@/constants";
import useUpdateIssue from "../hooks/user-update-issue";

interface CreateOrUpdateIssueProps {
  refetchIssues: () => void;
  issueId?: string;
  issue?: Issue;
  forUpdate?: boolean;
  projectId: string;
}

const CreateOrUpdateIssue = ({
  refetchIssues,
  issue,
  forUpdate,
  projectId,
  issueId,
}: CreateOrUpdateIssueProps) => {
  const form = useForm<IssueValues>({
    resolver: zodResolver(issueShema),
    mode: "onChange",
    defaultValues: forUpdate
      ? { ...issue, labels: issue?.labels[0] }
      : { priority: "Low" },
  });

  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, mutate: createIssue } = useCreateIssue({
    refetchIssues,
    form,
    onClose: () => setOpen(false),
  });
  const { isLoading: loading, mutate: updateIssue } = useUpdateIssue({
    refetchIssues,
    form,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (issue) {
      form.reset(forUpdate ? { ...issue, labels: issue.labels[0] } : {});
    }
  }, [issue]);

  const onSubmit = (data: IssueValues) => {
    if (forUpdate)
      updateIssue({
        data: { ...data, projectId, issueId, labels: [data.labels] },
      });
    else createIssue({ data: { ...data, projectId, labels: [data.labels] } });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {forUpdate ? (
          <button className="text-green-500 hover:text-green-500/80 transition-all">
            <Edit size={15} />
          </button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            New issue
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">
            {forUpdate ? "Update Task" : "Create New Task"}
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-3" />
        <div className="sm:bg-active/5 sm:border sm:border-active/10 sm:p-6 sm:rounded-lg">
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
                        placeholder="Task title"
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
                      <ReactQuill theme="snow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <SelectField field={field} options={PRIORITY_OPTIONS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lables</FormLabel>
                    <FormControl>
                      <SelectField field={field} options={TASK_TYPE_OPTIONS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button
                  variant="primary"
                  size="sm"
                  className="px-6 rounded-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {(isLoading || loading) && (
                    <LoaderCircle className="mr-1 size-4 animate-spin" />
                  )}
                  {forUpdate ? "Update" : "Create"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateOrUpdateIssue;
