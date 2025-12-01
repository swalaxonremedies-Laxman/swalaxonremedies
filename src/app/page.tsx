
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FlaskConical,
  Gem,
  Pill,
  Droplets,
  CheckCircle,
  ShieldCheck,
  Globe,
  Truck,
  Building,
  Package,
  LucideIcon,
  HelpCircle,
  BookCopy,
  Recycle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const iconMap: { [key: string]: LucideIcon } = {
  FlaskConical,
  Gem,
  Pill,
  Droplets,
  CheckCircle,
  ShieldCheck,
  Globe,
  Truck,
  Building,
  Package,
  BookCopy,
  Recycle,
  Default: HelpCircle,
};

const defaultContent = {
  hero: {
    titleLine1: 'Trusted API & Excipients Sourcing',
    titleLine2: 'Worldwide — Fast, Compliant, Reliable',
    subtitle: 'Swalaxon Remedies sources high-quality APIs and excipients from verified manufacturers, with batch documentation and on-time delivery.',
    cta1: 'Get Quote',
    cta2: 'Download Brochure',
    headerImageUrl: 'https://storage.googleapis.com/gweb-aip-dev.appspot.com/workplace-assets/v1/projects/studio-app-user-project/files/hero-product.webp'
  },
  portfolio: {
    title: 'Our Product Portfolio',
    subtitle: 'Source Development | Export | Pharma Raw Materials | Packaging & Machinery',
    cards: [
       {
          icon: "Pill",
          category: "APIs (Active Pharmaceutical Ingredients)",
          items: ["Aceclofenac (Na/K)", "Albendazole", "Amlodipine Besylate"]
      },
      {
          icon: "FlaskConical",
          category: "Excipients & Polymers",
          items: ["Microcrystalline Cellulose", "HPMC", "Cross-Carmellose Sodium"]
      },
       {
          icon: "Gem",
          category: "Minerals & Salts",
          items: ["Ferric Carboxymaltose", "Iron Polymaltose", "Ferrous Ascorbate"]
      },
       {
          icon: "ShieldCheck",
          category: "Antacids & GI Ingredients",
          items: ["Simethicone", "Magnesium Hydroxide", "Aluminium Hydroxide"]
      },
       {
          icon: "Droplets",
          category: "Coatings, Stearates & Citrates",
          items: ["Magnesium Stearate", "Stearic Acid", "Sodium Citrate"]
      },
      {
          icon: "Building",
          category: "Pharma Packaging & Machinery",
          items: ["Pharma process equipment", "Filling & blister packing units", "HDPE / PET bottles"]
      }
    ]
  },
  whyChooseUs: {
    title: 'Why Choose Swalaxon?',
    subtitle: 'We are committed to excellence, reliability, and customer satisfaction.',
    features: [
      {
        icon: "ShieldCheck",
        title: "WHO-GMP Compliant Sourcing",
        description: "Adherence to the highest industry standards for product purity and safety."
      },
      {
        icon: "Recycle",
        title: "Transparent & Ethical Supply Chain",
        description: "A robust network of suppliers to ensure a consistent and reliable supply chain."
      },
      {
        icon: "Truck",
        title: "PAN-India Delivery + Export Support",
        description: "Efficient logistics to get you the materials you need, when you need them."
      },
      {
        icon: "BookCopy",
        title: "Strong Technical & Documentation Support",
        description: "Dedicated support to help you find the perfect solutions for your needs."
      }
    ]
  }
};


export default function Home() {
  const firestore = useFirestore();
  const homeContentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/pages/home") : null),
    [firestore]
  );
  const { data: homePageContent, isLoading } = useDoc<typeof defaultContent>(homeContentRef);

  const content = (homePageContent && homePageContent.hero) ? homePageContent : defaultContent;

  if (isLoading) {
    return (
        <div className="flex flex-col animate-pulse">
            <section className="min-h-[70vh] flex items-center bg-background text-foreground">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="h-12 bg-muted rounded w-3/4"></div>
                             <div className="h-12 bg-muted rounded w-full"></div>
                            <div className="h-6 bg-muted rounded w-5/6"></div>
                            <div className="h-6 bg-muted rounded w-4/6"></div>
                            <div className="flex gap-3 mt-6">
                                <div className="h-12 w-32 bg-muted rounded"></div>
                                <div className="h-12 w-32 bg-muted rounded"></div>
                            </div>
                        </div>
                         <div className="order-first lg:order-last">
                             <div className="w-full aspect-[4/3] rounded-2xl bg-muted"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
  }

  return (
    <div className="flex flex-col">
       <section className="min-h-[70vh] flex items-center bg-background text-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                {content.hero.titleLine1}
                <br />
                <span className="text-primary">
                  {content.hero.titleLine2}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {content.hero.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                 <Button asChild size="lg">
                  <Link href="/contact">{content.hero.cta1}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                   <Link href="/brochure.pdf">{content.hero.cta2}</Link>
                </Button>
              </div>
            </div>
            <div className="order-first lg:order-last">
              {content.hero.headerImageUrl && (
                <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center">
                   <Image
                    alt={'Header image'}
                    src={content.hero.headerImageUrl}
                    width={500}
                    height={375}
                    className="object-contain max-h-80"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{content.portfolio.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.portfolio.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {content.portfolio.cards.map((group) => {
                const Icon = iconMap[group.icon] || iconMap.Default;
                return (
                    <Card key={group.category} className={cn("flex flex-col h-full bg-background/80 backdrop-blur-sm border-border/50 shadow-lg", 
                        "hover:border-accent hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 ease-in-out")}>
                        <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-primary">
                            <Icon className="h-6 w-6 text-primary" />
                            <span className="text-xl font-semibold font-headline">{group.category}</span>
                        </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <ul className="space-y-2 text-muted-foreground">
                            {group.items.map(item => (
                            <li key={item} className="flex items-start text-sm">
                                <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0"></span>
                                {item}
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">{content.whyChooseUs.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.whyChooseUs.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {content.whyChooseUs.features.map((feature) => {
                const Icon = iconMap[feature.icon] || iconMap.Default;
                return (
                    <div key={feature.title} className="flex flex-col items-center space-y-3">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                        <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold text-primary">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

    