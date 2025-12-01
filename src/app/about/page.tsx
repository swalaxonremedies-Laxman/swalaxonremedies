
'use client';
import Image from "next/image";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface AboutPageContent {
  title: string;
  subtitle: string;
  lead: string;
  mission: string;
  vision: string;
  closing: string;
  values: { title: string; description: string }[];
  imageUrl?: string;
}

export default function AboutPage() {
    const firestore = useFirestore();
    const aboutContentRef = useMemoFirebase(
        () => (firestore ? doc(firestore, "/pages/about") : null),
        [firestore]
    );
    const { data: aboutPageContent, isLoading } = useDoc<AboutPageContent>(aboutContentRef);

    if (isLoading) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Loading content...</div>;
    }
    
    if (!aboutPageContent) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Content not found. Please edit the page to add content.</div>;
    }


    return (
        <>
            <section className="relative w-full h-64 bg-background">
                 {aboutPageContent.imageUrl && (
                    <Image
                        src={aboutPageContent.imageUrl}
                        alt={aboutPageContent.title}
                        fill
                        className="object-cover opacity-40"
                    />
                )}
                <div className="container mx-auto flex flex-col items-center justify-center h-full text-center text-foreground relative">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{aboutPageContent.title}</h1>
                    <p className="text-lg md:text-xl mt-2">{aboutPageContent.subtitle}</p>
                </div>
            </section>
            <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto">
                    <div className="prose lg:prose-lg max-w-4xl mx-auto">
                        <p className="lead">
                            {aboutPageContent.lead}
                        </p>
                        
                        <h2 className="font-headline">Our Mission</h2>
                        <p>
                           {aboutPageContent.mission}
                        </p>

                        <h2 className="font-headline">Our Vision</h2>
                        <p>
                           {aboutPageContent.vision}
                        </p>

                        <h2 className="font-headline">Our Values</h2>
                        <ul>
                            {aboutPageContent.values?.map(value => (
                                <li key={value.title}><strong>{value.title}:</strong> {value.description}</li>
                            ))}
                        </ul>
                         <p>
                           {aboutPageContent.closing}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
