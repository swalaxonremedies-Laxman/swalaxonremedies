
'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSettings {
  brandName: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  quickLinksTitle: string;
  quickLinks: FooterLink[];
  contactInfoTitle: string;
  address: string;
  email: string;
  phone: string;
  copyright: string;
}

const defaultSettings: FooterSettings = {
    brandName: "Swalaxon Remedies",
    description: "Your trusted global partner for high-quality pharmaceutical and chemical raw materials, ensuring quality, compliance, and reliability.",
    ctaLabel: "Request a Quote",
    ctaHref: "/contact",
    quickLinksTitle: "Quick Links",
    quickLinks: [
      { href: "/products", label: "Products" },
      { href: "/about", label: "About Us" },
      { href: "/quality", label: "Quality" },
      { href: "/contact", label: "Contact" },
    ],
    contactInfoTitle: "Contact Info",
    address: "Nagpur, Maharashtra, India",
    email: "info.swalaxonremedies@gmail.com",
    phone: "+91-9766208402",
    copyright: `© ${new Date().getFullYear()} Swalaxon Remedies Pvt Ltd. All rights reserved.`,
};

export function SiteFooter() {
  const firestore = useFirestore();
  const footerSettingsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, "/settings/footer") : null),
    [firestore]
  );
  const { data: footerSettings, isLoading } = useDoc<FooterSettings>(footerSettingsRef);

  const content = isLoading ? defaultSettings : (footerSettings || defaultSettings);

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold font-headline text-primary">{content.brandName}</h2>
            <p className="mt-2 text-muted-foreground max-w-sm">
              {content.description}
            </p>
            <div className="mt-6">
                <Button asChild>
                    <Link href={content.ctaHref}>{content.ctaLabel}</Link>
                </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground">{content.quickLinksTitle}</h3>
            <ul className="mt-4 space-y-2">
              {content.quickLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="text-muted-foreground hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground">{content.contactInfoTitle}</h3>
            <address className="mt-4 space-y-2 not-italic text-muted-foreground">
              <p>{content.address}</p>
              <p><a href={`mailto:${content.email}`} className="hover:text-primary">{content.email}</a></p>
              <p><a href={`tel:${content.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary">{content.phone}</a></p>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground text-sm">
          <p>{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
