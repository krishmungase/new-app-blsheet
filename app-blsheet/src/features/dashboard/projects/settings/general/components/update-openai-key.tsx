import { z } from "zod";
import { Edit, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Button } from "@/components";
import { Separator } from "@/components/ui/separator";
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
import { Project } from "@/types";

import useUpdateOpenAIKey from "../hooks/user-update-openai-key";
import { Textarea } from "@/components/ui/textarea";

export const openAiKeySchema = z.object({
  openAiKey: z.string().min(20, {
    message: "OpenAI key must be at least 20 characters.",
  }),
});
export type OpenAiKeyValues = z.infer<typeof openAiKeySchema>;

interface UpdateOpenAIKeyProps {
  refetchProject: () => void;
  project: Project;
}

const UpdateOpenAIKey = ({ refetchProject, project }: UpdateOpenAIKeyProps) => {
  const form = useForm<OpenAiKeyValues>({
    resolver: zodResolver(openAiKeySchema),
    mode: "onChange",
  });
  const [open, setOpen] = useState<boolean>(false);
  const { isLoading, mutate } = useUpdateOpenAIKey({
    refetchProject,
    setOpen,
  });

  const onSubmit = (data: OpenAiKeyValues) => {
    mutate({ data: { ...data, projectId: project?.projectId } });
  };

  useEffect(() => {
    form.reset({ ...project });
  }, [project]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {project.openAiKey ? (
          <button
            onClick={() => setOpen(true)}
            className="text-green-500 hover:text-green-500/80"
          >
            <Edit size={15} />
          </button>
        ) : (
          <Button size="sm" variant="primary">
            Add OpenAI Key
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-active">
            {project?.openAiKey ? "Update" : "Add"} OpenAI Key
          </SheetTitle>
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
                name="openAiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="sk-proj..."
                        className="focus-visible:ring-1"
                        {...field}
                      />
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
                  {isLoading && (
                    <LoaderCircle className="mr-1 size-4 animate-spin" />
                  )}
                  {project.openAiKey ? "Update" : "Add"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateOpenAIKey;
