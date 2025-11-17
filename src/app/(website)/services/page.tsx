import { Handshake, Factory, FlaskConical, Truck } from "lucide-react";
import { SERVICES_PAGE_CONTENT } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const iconMap = {
  "Ethical Marketing": <Handshake className="h-10 w-10 text-primary" />,
  "Third-Party Manufacturing Support": <Factory className="h-10 w-10 text-primary" />,
  "Product Development": <FlaskConical className="h-10 w-10 text-primary" />,
  "Distribution & Supply Chain": <Truck className="h-10 w-10 text-primary" />,
};

export default function ServicesPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {SERVICES_PAGE_CONTENT.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            End-to-end pharmaceutical services to support your business goals.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {SERVICES_PAGE_CONTENT.services.map((service) => (
            <Card key={service.name} className="p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {iconMap[service.name as keyof typeof iconMap]}
                </div>
                <div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                  </CardHeader>
                  <CardDescription className="mt-2 text-base">
                    {service.description}
                  </CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
