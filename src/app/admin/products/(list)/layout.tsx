
'use client';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = "/admin/products";

  const navLinks = [
    { href: base, label: "All Products" },
    { href: `${base}/categories`, label: "Categories" },
  ];

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and categories.</p>
        </div>
      </div>
      <nav className="flex items-center space-x-4 border-b">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "pb-3 px-1 border-b-2 font-medium text-sm",
              pathname === link.href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
