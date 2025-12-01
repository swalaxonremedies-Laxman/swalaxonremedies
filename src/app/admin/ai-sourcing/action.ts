"use server";

import { suggestNewSources } from "@/ai/flows/ai-suggest-new-sources";
import { z } from "zod";

const formSchema = z.object({
  currentProductRange: z.string().min(10, "Current product range is too short."),
  marketTrends: z.string().min(10, "Market trends description is too short."),
});

type FormState = {
  suggestions: string | null;
  error: string | null;
};

export async function suggestNewSourcesAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    currentProductRange: formData.get("currentProductRange"),
    marketTrends: formData.get("marketTrends"),
  });

  if (!validatedFields.success) {
    return {
      suggestions: null,
      error: validatedFields.error.flatten().fieldErrors.currentProductRange?.[0] || validatedFields.error.flatten().fieldErrors.marketTrends?.[0] || "Invalid input."
    };
  }

  try {
    const result = await suggestNewSources(validatedFields.data);
    return {
      suggestions: result.suggestedSources,
      error: null,
    };
  } catch (error) {
    console.error("AI Sourcing Error:", error);
    return {
      suggestions: null,
      error: "Failed to get suggestions from the AI. Please try again later.",
    };
  }
}
