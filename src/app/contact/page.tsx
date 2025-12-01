"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendMessageAction } from "./action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

const initialState = {
  message: null,
  error: null,
};

export default function ContactPage() {
  const [state, formAction] = useActionState(sendMessageAction, initialState);

  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 lg:py-24">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Contact Us</h1>
            <p className="text-lg md:text-xl mt-2 text-muted-foreground max-w-2xl mx-auto">We're here to help. Reach out to us with any questions or inquiries.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Card className={cn("bg-background/80 backdrop-blur-sm border-border/50")}>
            <CardHeader>
              <CardTitle className="text-3xl font-headline">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="Inquiry about products" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell us how we can help..." rows={5} required />
                </div>
                <div>
                  <SubmitButton />
                </div>
                {state.error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}
                {state.message && (
                  <Alert>
                     <Send className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className={cn("bg-background/80 backdrop-blur-sm border-border/50")}>
              <CardHeader>
                <CardTitle className="text-3xl font-headline">Our Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>Swalaxon Remedies Pvt. Ltd.<br />(Nagpur, Maharashtra)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>+91-9766208402</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>info.swalaxonremedies@gmail.com</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <div className="aspect-video">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238132.59317586818!2d78.9324050993359!3d21.16110996833628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31add13%3A0x19210fe6453f6843!2sNagpur%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1685309930559!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps location of Nagpur, India"
                    ></iframe>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
