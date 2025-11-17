import Image from "next/image";
import { CheckCircle } from "lucide-react";

import { QUALITY_PAGE_CONTENT } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function QualityPage() {
  const qualityImage = PlaceHolderImages.find(p => p.id === 'quality-control');

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {QUALITY_PAGE_CONTENT.title}
          </h1>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
            <p>{QUALITY_PAGE_CONTENT.description}</p>
            <h3 className="text-foreground">Our quality checks include:</h3>
            <ul className="mt-6 space-y-4">
              {QUALITY_PAGE_CONTENT.checks.map((check, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-semibold text-foreground">{QUALITY_PAGE_CONTENT.focus}</p>
          </div>
          {qualityImage && (
            <div className="relative h-96 w-full lg:h-full">
              <Image
                src={qualityImage.imageUrl}
                alt={qualityImage.description}
                width={800}
                height={600}
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint={qualityImage.imageHint}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
