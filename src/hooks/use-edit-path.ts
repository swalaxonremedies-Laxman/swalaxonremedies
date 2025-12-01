
"use client";

import { usePathname } from "next/navigation";

const pathMap: Record<string, string> = {
    "/": "/admin/home",
    "/about": "/admin/about-content", 
    "/products": "/admin/products-content",
    "/services": "/admin/services-content", 
    "/quality": "/admin/quality-content", 
    "/blog": "/admin/blog",
    "/contact": "/admin/settings"
};

const getEditPathForProduct = (slug: string) => `/admin/products/edit/${slug}`;
const getEditPathForBlog = (slug: string) => {
    // This part is tricky as slug needs to be mapped to ID.
    // For now, we will redirect to the main blog admin page.
    // A more robust solution would involve a lookup.
    return `/admin/blog`;
};

export const useEditPath = () => {
    const pathname = usePathname();

    if (pathname.startsWith('/products/')) {
        const slug = pathname.split('/')[2];
        return getEditPathForProduct(slug);
    }
    
    if (pathname.startsWith('/blog/')) {
        // Since we can't easily get the doc ID from the slug on the client,
        // we'll redirect to the list view. An edit button on the page itself would be better.
        return `/admin/blog`; 
    }

    return pathMap[pathname] || "/admin/dashboard";
};
