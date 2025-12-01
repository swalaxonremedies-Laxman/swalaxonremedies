
'use client';
import { useUser } from "@/firebase";
import { redirect, usePathname } from "next/navigation";
import { ReactNode } from "react";

export function AdminClientLayout({ children }: { children: ReactNode }) {
    const { user, isUserLoading } = useUser();
    const pathname = usePathname();

    if (isUserLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
    
    if (!user) {
      const redirectUrl = pathname ? `/admin/login?redirect_uri=${encodeURIComponent(pathname)}` : '/admin/login';
      redirect(redirectUrl);
    }

    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
        </div>
    )
}
