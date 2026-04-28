import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useUpdateDoc from "../hooks/use-update-doc";
import { useDocContext } from "../details/providers/doc-provider";
import { useEffect } from "react";

export const docSchema = z.object({
  title: z
    .string({
      required_error: "Please enter document title.",
    })
    .min(4, "Document title should be at least 4 characters")
    .max(200, "Document title should be at most 200 characters"),
});
export type DocValues = z.infer<typeof docSchema>;

interface CreateDocFormProps {
  projectId: string;
  docId: string;
  title: string;
  onClose: () => void;
}

const RenameTitleForm = ({
  projectId,
  docId,
  title,
  onClose,
}: CreateDocFormProps) => {
  const form = useForm<DocValues>({
    resolver: zodResolver(docSchema),
    mode: "onChange",
  });
  const { refetchDoc } = useDocContext();
  const { mutate, isLoading } = useUpdateDoc({ refetchDoc, onClose });

  const onSubmit = (data: DocValues) => {
    mutate({ data: { ...data, projectId, docId } });
  };

  useEffect(() => {
    if (title) form.reset({ title });
  }, [title]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6 md:px-0 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter document title"
                  className="focus-visible:ring-1 w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary">
            {isLoading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            Rename Title
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RenameTitleForm;
