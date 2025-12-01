
'use client';
import Image from "next/image";
import { CheckCircle, FileText, Microscope } from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface QualityPageContent {
  title: string;
  subtitle: string;
  lead: string;
  frameworkTitle: string;
  frameworkDescription: string;
  closing: string;
  points: { title: string; description: string }[];
  imageUrl?: string;
}

const icons: { [key: string]: JSX.Element } = {
    "Supplier Vetting": <CheckCircle className="h-6 w-6 text-accent" />,
    "Rigorous Testing": <Microscope className="h-6 w-6 text-accent" />,
    "Regulatory Compliance": <FileText className="h-6 w-6 text-accent" />,
};

export default function QualityPage() {
    const firestore = useFirestore();
    const qualityContentRef = useMemoFirebase(
        () => (firestore ? doc(firestore, "/pages/quality") : null),
        [firestore]
    );
    const { data: qualityPageContent, isLoading } = useDoc<QualityPageContent>(qualityContentRef);

    if (isLoading) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Loading content...</div>;
    }
    
    if (!qualityPageContent) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Content not found. Please edit the page to add content.</div>;
    }

    return (
        <>
            <section className="relative w-full h-64 bg-background">
                {qualityPageContent.imageUrl && (
                    <Image
                        src={qualityPageContent.imageUrl}
                        alt={qualityPageContent.title}
                        fill
                        className="object-cover opacity-40"
                    />
                )}
                <div className="container mx-auto flex flex-col items-center justify-center h-full text-center text-foreground relative">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{qualityPageContent.title}</h1>
                    <p className="text-lg md:text-xl mt-2">{qualityPageContent.subtitle}</p>
                </div>
            </section>
            <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto">
                    <div className="prose lg:prose-lg max-w-4xl mx-auto">
                        <p className="lead">
                            {qualityPageContent.lead}
                        </p>

                        <h2 className="font-headline">{qualityPageContent.frameworkTitle}</h2>
                        <p>
                            {qualityPageContent.frameworkDescription}
                        </p>

                        <div className="space-y-6 my-8">
                            {qualityPageContent.points?.map(point => (
                                <div className="flex gap-4 items-start" key={point.title}>
                                    <div className="flex-shrink-0 mt-1">
                                        {icons[point.title] || <CheckCircle className="h-6 w-6 text-accent" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{point.title}</h3>
                                        <p className="text-muted-foreground">{point.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                         <p>
                            {qualityPageContent.closing}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
