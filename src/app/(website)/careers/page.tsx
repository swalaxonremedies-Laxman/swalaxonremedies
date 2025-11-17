import Link from "next/link";
import Image from "next/image";
import { Briefcase, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CAREERS_PAGE_CONTENT, CONTACT_DETAILS } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function CareersPage() {
    const careerImage = PlaceHolderImages.find(p => p.id === 'career-team');

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {CAREERS_PAGE_CONTENT.title}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {CAREERS_PAGE_CONTENT.description}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {CAREERS_PAGE_CONTENT.roles.map((role) => (
                <div key={role} className="flex items-center gap-3 rounded-md bg-secondary p-3">
                  <Briefcase className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="font-medium">{role}</span>
                </div>
              ))}
            </div>
            <Card className="mt-12 bg-background">
              <CardContent className="p-6">
                <p className="font-semibold text-foreground">{CAREERS_PAGE_CONTENT.cta}</p>
                <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-primary">
                        <Mail className="h-5 w-5" />
                        <span>{CONTACT_DETAILS.careersEmail}</span>
                    </p>
                    <Button asChild>
                        <Link href={`mailto:${CONTACT_DETAILS.careersEmail}?subject=Career Application`}>
                            Apply Now
                        </Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          {careerImage && (
             <div className="relative h-96 w-full lg:h-full">
                <Image
                    src={careerImage.imageUrl}
                    alt={careerImage.description}
                    width={800}
                    height={600}
                    className="rounded-lg object-cover shadow-xl"
                    data-ai-hint={careerImage.imageHint}
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
