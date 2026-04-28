import { z } from "zod";

export const issueShema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  description: z.string(),
  labels: z.string({ message: "Label is required" }),
  priority: z.enum(["Low", "Medium", "High"], {
    message: "Priority is invalid",
  }),
});

export type IssueValues = z.infer<typeof issueShema>;
