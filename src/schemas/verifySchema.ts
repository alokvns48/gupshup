import { z } from "zod";

export const verifySchema = z.object({
  verifyCode: z.string().length(6, "Verify Code must be 6 digit"),
});
