'use server';

/**
 * @fileOverview An AI-powered tool that analyzes the current product range and market trends to suggest potential new raw material sources.
 *
 * - suggestNewSources - A function that handles the suggestion of new raw material sources.
 * - SuggestNewSourcesInput - The input type for the suggestNewSources function.
 * - SuggestNewSourcesOutput - The return type for the suggestNewSources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNewSourcesInputSchema = z.object({
  currentProductRange: z
    .string()
    .describe('The current range of products offered by the company.'),
  marketTrends: z.string().describe('The latest market trends in the industry.'),
});
export type SuggestNewSourcesInput = z.infer<typeof SuggestNewSourcesInputSchema>;

const SuggestNewSourcesOutputSchema = z.object({
  suggestedSources: z
    .string()
    .describe('A list of potential new raw material sources, with justification.'),
});
export type SuggestNewSourcesOutput = z.infer<typeof SuggestNewSourcesOutputSchema>;

export async function suggestNewSources(input: SuggestNewSourcesInput): Promise<SuggestNewSourcesOutput> {
  return suggestNewSourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNewSourcesPrompt',
  input: {schema: SuggestNewSourcesInputSchema},
  output: {schema: SuggestNewSourcesOutputSchema},
  prompt: `You are an expert in raw materials sourcing for the pharmaceutical and chemical industries.

  Based on the current product range and market trends, suggest potential new raw material sources.
  Provide a justification for each suggested source.

Current Product Range: {{{currentProductRange}}}
Market Trends: {{{marketTrends}}}

Suggestions:`,
});

const suggestNewSourcesFlow = ai.defineFlow(
  {
    name: 'suggestNewSourcesFlow',
    inputSchema: SuggestNewSourcesInputSchema,
    outputSchema: SuggestNewSourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
