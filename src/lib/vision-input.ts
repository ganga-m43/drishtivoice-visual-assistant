import { z } from "zod";

export const imageQuestionSchema = z.object({
  image: z.string().max(8_000_000).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/, "Provide a JPEG, PNG, or WebP image."),
  question: z.string().trim().min(1).max(2000),
  language: z.enum(["en-IN", "hi-IN", "kn-IN", "ta-IN", "te-IN", "ml-IN", "mr-IN", "bn-IN"]),
});

export const answerLanguages = {
  "en-IN": "English (India)", "hi-IN": "Hindi", "kn-IN": "Kannada", "ta-IN": "Tamil",
  "te-IN": "Telugu", "ml-IN": "Malayalam", "mr-IN": "Marathi", "bn-IN": "Bengali",
};