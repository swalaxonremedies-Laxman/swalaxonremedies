
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

interface NavLink {
    href: string;
    label: string;
}

interface WebsiteSettings {
    brandName?: string;
    logoType?: 'svg' | 'url';
    logoSvg?: string;
    logoUrl?: string;
    navLinks?: NavLink[];
}

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/quality", label: "Quality" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(pathname);
  const [ariaAttributes, setAriaAttributes] = useState<{
    'aria-label'?: string;
    'aria-current'?: 'page' | undefined;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
  }>({});

  const firestore = useFirestore();
  const websiteSettingsRef = useMemoFirebase(
      () => (firestore ? doc(firestore, "/settings/website") : null),
      [firestore]
  );
  const { data: websiteSettings, isLoading } = useDoc<WebsiteSettings>(websiteSettingsRef);

  const brandName = isLoading ? "Loading..." : websiteSettings?.brandName || "Swalaxon Remedies";
  const navLinks = isLoading ? defaultNavLinks : (websiteSettings?.navLinks && websiteSettings.navLinks.length > 0 ? websiteSettings.navLinks : defaultNavLinks);
  const logoType = websiteSettings?.logoType;
  const logoSvg = websiteSettings?.logoSvg;
  const logoUrl = websiteSettings?.logoUrl;

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
      setAriaAttributes({
          'aria-label': isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu',
          'aria-expanded': isMobileMenuOpen,
          'aria-controls': 'mobile-menu'
      });
  }, [isMobileMenuOpen]);


  const NavItems = () =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          activeLink.startsWith(link.href) && link.href !== "/" || activeLink === link.href
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-current={activeLink.startsWith(link.href) && link.href !== "/" || activeLink === link.href ? 'page' : undefined}
      >
        {link.label}
      </Link>
    ));
    
  const Logo = () => {
    if (logoType === 'svg' && logoSvg) {
        return <div className="h-auto max-h-20 w-auto" dangerouslySetInnerHTML={{ __html: logoSvg }} />;
    }
    if (logoType === 'url' && logoUrl) {
        return <Image src={logoUrl} alt={brandName} width={250} height={80} className="h-auto max-h-20 w-auto object-contain" />;
    }
    return <span className="font-bold text-lg text-primary">{brandName}</span>;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-20 items-center">
        <div className="flex-grow">
          <Link href="/" className="flex items-center space-x-2" aria-label="Swalaxon Remedies Home">
             <Logo />
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main navigation">
            <NavItems />
            <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Admin</Link>
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              {...ariaAttributes}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="container pb-4">
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              <NavItems />
               <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
