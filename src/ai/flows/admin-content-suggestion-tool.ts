'use server';

/**
 * @fileOverview An AI-powered content suggestion tool for admins to improve website content and SEO optimization.
 *
 * - generateContentSuggestions - A function that generates content suggestions based on the provided input.
 * - ContentSuggestionInput - The input type for the generateContentSuggestions function.
 * - ContentSuggestionOutput - The return type for the generateContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentSuggestionInputSchema = z.object({
  brandKeywords: z.string().describe('Keywords related to the Swalaxon brand.'),
  productDescription: z.string().describe('Description of the product.'),
  missionStatement: z.string().describe('The mission statement of the company.'),
  visionStatement: z.string().describe('The vision statement of the company.'),
  companyValues: z.string().describe('The core values of the company.'),
  currentContent: z.string().optional().describe('The current content to be improved (optional).'),
});
export type ContentSuggestionInput = z.infer<typeof ContentSuggestionInputSchema>;

const ContentSuggestionOutputSchema = z.object({
  suggestedKeywords: z.string().describe('Suggested keywords for SEO optimization.'),
  rewrittenSentences: z.string().describe('Rewritten sentences for improved clarity and engagement.'),
  rephrasedParagraphs: z.string().describe('Rephrased paragraphs for better readability and impact.'),
});
export type ContentSuggestionOutput = z.infer<typeof ContentSuggestionOutputSchema>;

export async function generateContentSuggestions(input: ContentSuggestionInput): Promise<ContentSuggestionOutput> {
  return contentSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentSuggestionPrompt',
  input: {schema: ContentSuggestionInputSchema},
  output: {schema: ContentSuggestionOutputSchema},
  prompt: `You are an AI-powered content suggestion tool for Swalaxon Remedies Pvt. Ltd., a pharmaceutical company. Your goal is to provide suggestions to improve website content and SEO optimization.

Consider the following information about the company and the content to be improved:

Brand Keywords: {{{brandKeywords}}}
Product Description: {{{productDescription}}}
Mission Statement: {{{missionStatement}}}
Vision Statement: {{{visionStatement}}}
Company Values: {{{companyValues}}}
Current Content: {{{currentContent}}}

Based on this information, please provide the following suggestions:

*   Suggested Keywords: Keywords that can be used for SEO optimization.
*   Rewritten Sentences: Rewritten sentences for improved clarity and engagement.
*   Rephrased Paragraphs: Rephrased paragraphs for better readability and impact.

Format the output as a JSON object with the fields "suggestedKeywords", "rewrittenSentences", and "rephrasedParagraphs". Each field should contain a string with the corresponding suggestions.
`,
});

const contentSuggestionFlow = ai.defineFlow(
  {
    name: 'contentSuggestionFlow',
    inputSchema: ContentSuggestionInputSchema,
    outputSchema: ContentSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
