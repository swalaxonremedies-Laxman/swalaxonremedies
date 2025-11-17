"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Wand2, Loader2, Lightbulb, RefreshCw, Clipboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateContentSuggestions, ContentSuggestionOutput } from "@/ai/flows/admin-content-suggestion-tool";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandKeywords: z.string().min(5, "Please enter some brand keywords."),
  productDescription: z.string().min(10, "Please describe the product."),
  missionStatement: z.string().min(10, "Please provide the mission statement."),
  visionStatement: z.string().min(10, "Please provide the vision statement."),
  companyValues: z.string().min(10, "Please list company values."),
  currentContent: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AiContentToolClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestionOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandKeywords: "pharmaceutical, healthcare, quality, affordable, trust",
      productDescription: "",
      missionStatement: "To transform healthcare through safe, effective, and affordable pharmaceutical products that improve the quality of life.",
      visionStatement: "To become a globally recognized pharmaceutical company known for trust, innovation, and excellence in healthcare.",
      companyValues: "Integrity, Quality, Innovation, Commitment, Excellence",
      currentContent: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await generateContentSuggestions(values);
      setSuggestions(result);
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      let description = "There was an error generating content suggestions. Please try again.";
      if (error.message.includes('API key not valid')) {
        description = "The Gemini API key is not valid. Please check your .env file."
      }
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Suggestion Tool</CardTitle>
          <CardDescription>
            Provide details about your content to get AI-powered suggestions for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Content (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your existing content here to get improvements..." {...field} className="min-h-24"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paracetamol 650 mg for pain relief" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="pharma, quality, affordable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Suggestions
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
          <CardDescription>
            Here are the AI-generated suggestions to enhance your content.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Generating ideas...</p>
              </div>
            </div>
          )}
          {!isLoading && !suggestions && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <Lightbulb className="h-8 w-8" />
                <p>Your content suggestions will appear here.</p>
              </div>
            </div>
          )}
          {suggestions && (
            <div className="space-y-6">
              <SuggestionCard title="Suggested Keywords" content={suggestions.suggestedKeywords} onCopy={copyToClipboard} />
              <SuggestionCard title="Rewritten Sentences" content={suggestions.rewrittenSentences} onCopy={copyToClipboard} />
              <SuggestionCard title="Rephrased Paragraphs" content={suggestions.rephrasedParagraphs} onCopy={copyToClipboard} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SuggestionCard({ title, content, onCopy }: { title: string, content: string, onCopy: (text: string) => void }) {
  return (
    <div>
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={() => onCopy(content)}>
                <Clipboard className="h-4 w-4" />
            </Button>
        </div>
        <div className="prose prose-sm max-w-none rounded-md border bg-secondary/50 p-4 text-sm text-foreground">
          {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </div>
    </div>
  )
}
