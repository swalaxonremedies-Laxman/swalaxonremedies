import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOMEPAGE_CONTENT } from "@/lib/constants";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex flex-col">
      <section className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 flex h-full max-w-7xl flex-col items-center justify-center text-center text-white px-4">
          <h1 className="max-w-3xl font-headline text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {HOMEPAGE_CONTENT.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-200">
            {HOMEPAGE_CONTENT.hero.subtitle}
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href={HOMEPAGE_CONTENT.hero.cta.primary.href}>
                {HOMEPAGE_CONTENT.hero.cta.primary.name}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={HOMEPAGE_CONTENT.hero.cta.secondary.href}>
                {HOMEPAGE_CONTENT.hero.cta.secondary.name}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="mx-auto">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {HOMEPAGE_CONTENT.whyChooseUs.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We are committed to excellence in every aspect of our business, from manufacturing to customer service.
              </p>
              <ul className="mt-8 space-y-4">
                {HOMEPAGE_CONTENT.whyChooseUs.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                    <span className="text-lg text-muted-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Image src="https://picsum.photos/seed/201/400/600" alt="Lab" width={400} height={600} className="rounded-lg object-cover shadow-lg" data-ai-hint="researcher smiling"/>
                <Image src="https://picsum.photos/seed/202/400/600" alt="Doctor" width={400} height={600} className="rounded-lg object-cover mt-8 shadow-lg" data-ai-hint="doctor professional"/>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {HOMEPAGE_CONTENT.productSegments.title}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We offer a wide range of products across various therapeutic categories to meet the diverse needs of patients.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {HOMEPAGE_CONTENT.productSegments.segments.map((segment, index) => (
              <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-primary">{segment}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">High-quality solutions for various therapeutic areas.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
