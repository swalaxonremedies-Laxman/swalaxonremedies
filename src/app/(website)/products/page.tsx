import Image from "next/image";
import { PRODUCTS_PAGE_CONTENT } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function ProductsPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {PRODUCTS_PAGE_CONTENT.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our diverse range of high-quality pharmaceutical formulations.
          </p>
        </div>

        <Tabs defaultValue={PRODUCTS_PAGE_CONTENT.categories[0].name} className="mt-16">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {PRODUCTS_PAGE_CONTENT.categories.map((category) => (
              <TabsTrigger key={category.name} value={category.name}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {PRODUCTS_PAGE_CONTENT.categories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.products.length > 0 ? (
                  category.products.map((product) => (
                    <Card key={product.name} className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                      {category.image && (
                         <div className="relative h-48 w-full">
                            <Image
                                src={category.image.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                data-ai-hint={category.image.imageHint}
                            />
                         </div>
                      )}
                      <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription>{product.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-muted-foreground">Products in this category will be listed soon.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
