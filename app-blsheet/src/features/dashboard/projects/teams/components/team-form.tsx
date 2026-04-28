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
import useCreateTeam from "../hooks/use-create-team";

export const teamSchema = z.object({
  name: z
    .string({
      required_error: "Please enter team name.",
    })
    .min(4, "Team name should be at least 4 characters")
    .max(35, "Team name should be at most 35 characters"),
});
export type TeamValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  refetch: () => void;
  projectId: string;
  onClose: () => void;
}

const TeamForm = ({ refetch, onClose, projectId }: TeamFormProps) => {
  const form = useForm<TeamValues>({
    resolver: zodResolver(teamSchema),
    mode: "onChange",
  });
  const { mutate, isLoading } = useCreateTeam({ refetch, onClose });

  const onSubmit = (data: TeamValues) => {
    mutate({ data: { ...data, projectId } });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6 md:px-0 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter team name"
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
            Create Team
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;
