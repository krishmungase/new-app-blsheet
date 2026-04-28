import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { ChromePicker } from "react-color";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

import useCreateLabel from "../hooks/use-create-label";
import { labelSchema, LabelValues } from "./label-schema";
import useUpdateLabel from "../hooks/use-update-label";
import { Label } from "@/types";

const CreateLabelForm = ({
  refetch,
  closeCreateLabelForm,
  forUpdate = false,
  label,
  setUpdatedLabel,
}: {
  refetch: () => void;
  closeCreateLabelForm: () => void;
  forUpdate?: boolean;
  label?: Label;
  setUpdatedLabel?: any;
}) => {
  const { mutate, isLoading } = useCreateLabel({
    callAfterSuccess: () => {
      closeCreateLabelForm();
      refetch();
    },
  });
  const { mutate: updateLabel, isLoading: loadingUpdateLabel } = useUpdateLabel(
    {
      callAfterSuccess: () => {
        setUpdatedLabel(null);
        closeCreateLabelForm();
        refetch();
      },
    }
  );

  const { projectId } = useParams();

  const form = useForm<LabelValues>({
    resolver: zodResolver(labelSchema),
    mode: "onChange",
    defaultValues: { ...label },
  });

  const onSubmit = (values: LabelValues) => {
    const data = {
      ...values,
      ...(forUpdate && { lableId: label?._id }),
      projectId,
    };
    if (forUpdate) updateLabel({ data });
    else mutate({ data });
  };

  return (
    <div className="border rounded-lg p-3 bg-muted shadow-sm">
      <Badge
        className="bg-indigo-200 rounded-full px-4 py-0.5 text-xs"
        style={{
          color: form.getValues("color"),
          background: `${form.getValues("color")}40`,
          border: form.getValues("color"),
        }}
      >
        Label preview
      </Badge>

      <Form {...form}>
        <form
          className={cn(
            "flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 justify-between md:px-0 mt-5",
            forUpdate && "md:flex"
          )}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Label name"
                    className="focus-visible:ring-1 w-full"
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
                  <Input
                    placeholder="Description (optional)"
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
            name="color"
            render={({ field }) => {
              const [open, setOpen] = useState(false);
              return (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start")}
                            style={{
                              color: field.value,
                              background: `${field.value}40`,
                            }}
                          >
                            {field.value || "Pick color"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <ChromePicker
                            color={field.value ? field.value : label?.color}
                            onChange={(color) => field.onChange(color.hex)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="mt-4 md:mt-0 flex items-end gap-2 justify-end">
            <Button size="sm" className="px-6" type="submit" disabled={false}>
              {(isLoading || loadingUpdateLabel) && (
                <LoaderCircle className="mr-1 size-4 animate-spin" />
              )}
              {forUpdate ? "Update" : "Create"} label
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={closeCreateLabelForm}
              size="sm"
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateLabelForm;
