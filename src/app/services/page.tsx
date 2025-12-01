
'use client';
import Image from "next/image";
import { Globe, Truck, Users, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface ServicesPageContent {
  title: string;
  subtitle: string;
  lead: string;
  services: { title: string; description: string }[];
  imageUrl?: string;
}

const icons: { [key: string]: JSX.Element } = {
    "Global Sourcing": <Globe className="h-8 w-8 text-primary" />,
    "Logistics and Supply Chain Management": <Truck className="h-8 w-8 text-primary" />,
    "Technical Support": <Users className="h-8 w-8 text-primary" />,
    "Customized Solutions": <FlaskConical className="h-8 w-8 text-primary" />,
};

export default function ServicesPage() {
    const firestore = useFirestore();
    const servicesContentRef = useMemoFirebase(
        () => (firestore ? doc(firestore, "/pages/services") : null),
        [firestore]
    );
    const { data: servicesPageContent, isLoading } = useDoc<ServicesPageContent>(servicesContentRef);

    if (isLoading) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Loading content...</div>;
    }
    
    if (!servicesPageContent) {
        return <div className="container mx-auto py-16 lg:py-24 text-center">Content not found. Please edit the page to add content.</div>;
    }

    return (
        <>
            <section className="relative w-full h-64 bg-background">
                {servicesPageContent.imageUrl && (
                    <Image
                        src={servicesPageContent.imageUrl}
                        alt={servicesPageContent.title}
                        fill
                        className="object-cover opacity-40"
                    />
                )}
                <div className="container mx-auto flex flex-col items-center justify-center h-full text-center text-foreground relative">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">{servicesPageContent.title}</h1>
                    <p className="text-lg md:text-xl mt-2">{servicesPageContent.subtitle}</p>
                </div>
            </section>
            <section className="py-16 lg:py-24 bg-background">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                         <p className="text-lg text-muted-foreground">
                           {servicesPageContent.lead}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {servicesPageContent.services?.map(service => (
                            <Card key={service.title} className={cn("bg-background/80 backdrop-blur-sm border-border/50")}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    {icons[service.title] || <FlaskConical className="h-8 w-8 text-primary" />}
                                    <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{service.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
