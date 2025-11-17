import Image from "next/image";
import { Target, Eye, Gem } from "lucide-react";

import { ABOUT_PAGE_CONTENT } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {ABOUT_PAGE_CONTENT.title}
          </h1>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="prose prose-lg max-w-none text-muted-foreground dark:prose-invert">
            {ABOUT_PAGE_CONTENT.description.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {aboutImage && (
            <div className="relative h-96 w-full lg:h-full">
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                width={800}
                height={600}
                className="rounded-lg object-cover shadow-xl"
                data-ai-hint={aboutImage.imageHint}
              />
            </div>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="flex flex-col items-center p-8 text-center">
            <Target className="h-12 w-12 text-primary" />
            <CardHeader>
              <CardTitle className="text-2xl">{ABOUT_PAGE_CONTENT.mission.title}</CardTitle>
            </CardHeader>
            <CardDescription className="text-base">
              {ABOUT_PAGE_CONTENT.mission.text}
            </CardDescription>
          </Card>
          <Card className="flex flex-col items-center p-8 text-center">
            <Eye className="h-12 w-12 text-primary" />
            <CardHeader>
              <CardTitle className="text-2xl">{ABOUT_PAGE_CONTENT.vision.title}</CardTitle>
            </CardHeader>
            <CardDescription className="text-base">
              {ABOUT_PAGE_CONTENT.vision.text}
            </CardDescription>
          </Card>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {ABOUT_PAGE_CONTENT.values.title}
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ABOUT_PAGE_CONTENT.values.list.map((value) => (
              <Card key={value.name} className="p-6 text-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                <div className="flex justify-center">
                    <Gem className="h-8 w-8 text-accent" />
                </div>
                <CardHeader className="p-2">
                  <CardTitle className="text-lg">{value.name}</CardTitle>
                </CardHeader>
                <CardDescription className="text-sm">{value.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
