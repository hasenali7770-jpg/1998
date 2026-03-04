import { z } from "zod";

export const CreateOrderSchema = z.object({
  courseId: z.string().uuid(),
  provider: z.enum(["zaincash", "qicard", "stripe"]),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
