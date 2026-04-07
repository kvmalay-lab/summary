'use server';
/**
 * @fileOverview A Genkit flow for refining previously generated content based on user instructions.
 *
 * - refineGeneratedContent - A function that refines content using AI.
 * - RefineGeneratedContentInput - The input type for the refineGeneratedContent function.
 * - RefineGeneratedContentOutput - The return type for the refineGeneratedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineGeneratedContentInputSchema = z.object({
  instructions: z.string().describe('Natural language instructions for refining the content (e.g., "make it shorter", "change the tone to be more formal").'),
  contentToRefine: z.string().describe('The existing content that needs to be refined.'),
});
export type RefineGeneratedContentInput = z.infer<typeof RefineGeneratedContentInputSchema>;

const RefineGeneratedContentOutputSchema = z.object({
  refinedContent: z.string().describe('The content after being refined according to the instructions.'),
});
export type RefineGeneratedContentOutput = z.infer<typeof RefineGeneratedContentOutputSchema>;

export async function refineGeneratedContent(input: RefineGeneratedContentInput): Promise<RefineGeneratedContentOutput> {
  return refineGeneratedContentFlow(input);
}

const refineGeneratedContentPrompt = ai.definePrompt({
  name: 'refineGeneratedContentPrompt',
  input: {schema: RefineGeneratedContentInputSchema},
  output: {schema: RefineGeneratedContentOutputSchema},
  prompt: `You are an expert content editor. Your task is to refine the provided content based on the user's specific instructions.
Ensure that the refined content strictly adheres to the instructions while maintaining coherence, clarity, and the original intent as much as possible.

Instructions for refinement:
{{{instructions}}}

Content to refine:
\`\`\`
{{{contentToRefine}}}
\`\`\`

Based on the instructions, provide the refined content. Output only the refined content in the 'refinedContent' field.`,
});

const refineGeneratedContentFlow = ai.defineFlow(
  {
    name: 'refineGeneratedContentFlow',
    inputSchema: RefineGeneratedContentInputSchema,
    outputSchema: RefineGeneratedContentOutputSchema,
  },
  async input => {
    const {output} = await refineGeneratedContentPrompt(input);
    if (!output) {
      throw new Error('Failed to refine content: No output from prompt.');
    }
    return output;
  }
);
