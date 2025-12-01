"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { suggestNewSourcesAction } from "./action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Bot } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Bot className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        "Get Suggestions"
      )}
    </Button>
  );
}

const initialState = {
  suggestions: null,
  error: null,
};

export default function AiSourcingPage() {
  const [state, formAction] = useActionState(suggestNewSourcesAction, initialState);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline">AI Product Sourcing</h1>
        <p className="text-muted-foreground">
          Discover new raw material opportunities based on market intelligence.
        </p>
      </div>

      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Sourcing Analysis</CardTitle>
            <CardDescription>
              Provide details about your current product line and observed market
              trends to get AI-powered sourcing suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentProductRange">Current Product Range</Label>
              <Textarea
                id="currentProductRange"
                name="currentProductRange"
                placeholder="e.g., Paracetamol, Ibuprofen, Microcrystalline Cellulose..."
                rows={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketTrends">Market Trends</Label>
              <Textarea
                id="marketTrends"
                name="marketTrends"
                placeholder="e.g., Growing demand for plant-based excipients, focus on sustainable sourcing, new regulations for API purity..."
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {state?.error && (
        <Alert variant="destructive">
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.suggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Sourcing Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {state.suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
