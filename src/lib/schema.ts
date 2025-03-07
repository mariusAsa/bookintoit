import { z } from "zod";

export const IMAGE_SCHEMA = z.object({
	image: z
		.instanceof(File, { message: "Please upload an image." })
		.refine((f) => f.size < 10_000_000, "Max 10 mB upload size."),
});
