'use server';

/**
 * @fileOverview An AI-powered tool that analyzes the current product range and market trends to suggest potential new raw material sources.
 *
 * - suggestNewRawMaterials - A function that handles the suggestion of new raw material sources.
 * - SuggestNewRawMaterialsInput - The input type for the suggestNewRawMaterials function.
 * - SuggestNewRawMaterialsOutput - The return type for the suggestNewRawMaterials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNewRawMaterialsInputSchema = z.object({
  currentProductRange: z
    .string()
    .describe('The current range of products offered by the company.'),
  marketTrends: z.string().describe('The latest market trends in the industry.'),
});
export type SuggestNewRawMaterialsInput = z.infer<typeof SuggestNewRawMaterialsInputSchema>;

const SuggestNewRawMaterialsOutputSchema = z.object({
  suggestedSources: z
    .string()
    .describe('A list of potential new raw material sources, with justification.'),
});
export type SuggestNewRawMaterialsOutput = z.infer<typeof SuggestNewRawMaterialsOutputSchema>;

export async function suggestNewRawMaterials(input: SuggestNewRawMaterialsInput): Promise<SuggestNewRawMaterialsOutput> {
  return suggestNewRawMaterialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNewRawMaterialsPrompt',
  input: {schema: SuggestNewRawMaterialsInputSchema},
  output: {schema: SuggestNewRawMaterialsOutputSchema},
  prompt: `You are an expert in raw materials sourcing for the pharmaceutical and chemical industries.\n\n  Based on the current product range and market trends, suggest potential new raw material sources.\n  Provide a justification for each suggested source.\n\nCurrent Product Range: {{{currentProductRange}}}\nMarket Trends: {{{marketTrends}}}\n\nSuggestions:`,
});

const suggestNewRawMaterialsFlow = ai.defineFlow(
  {
    name: 'suggestNewRawMaterialsFlow',
    inputSchema: SuggestNewRawMaterialsInputSchema,
    outputSchema: SuggestNewRawMaterialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
