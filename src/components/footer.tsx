import Link from "next/link";
import { APP_NAME, FOOTER_LINKS, NAV_LINKS, CONTACT_DETAILS } from "@/lib/constants";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Innovating Healthcare. Delivering Trust.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{CONTACT_DETAILS.address.replace('\n', ', ')}</p>
            <p className="mt-2 text-sm text-muted-foreground">Email: {CONTACT_DETAILS.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">Phone: {CONTACT_DETAILS.phone}</p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h3 className="font-semibold tracking-wider text-foreground">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                {NAV_LINKS.slice(0,5).map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
                <h3 className="font-semibold tracking-wider text-foreground">&nbsp;</h3>
                <ul className="mt-4 space-y-2">
                {NAV_LINKS.slice(5).map((link) => (
                    <li key={link.name}>
                    <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                        {link.name}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>
            <div>
              <h3 className="font-semibold tracking-wider text-foreground">Legal</h3>
              <ul className="mt-4 space-y-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold tracking-wider text-foreground">Newsletter</h3>
              <p className="mt-4 text-sm text-muted-foreground">Stay up to date with our latest news.</p>
              <form className="mt-4 flex flex-col items-start gap-2 sm:flex-row">
                <Input type="email" placeholder="Enter your email" className="w-full sm:flex-1 bg-background" />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} Pvt. Ltd. | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
