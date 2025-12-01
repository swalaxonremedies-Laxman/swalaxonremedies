
'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import Image from "next/image";

interface AdminSettings {
    brandName?: string;
    logoUrl?: string;
}

function LoggedInHeader() {
    const firestore = useFirestore();
    const adminSettingsRef = useMemoFirebase(
        () => (firestore ? doc(firestore, "/settings/admin") : null),
        [firestore]
    );
    const { data: adminSettings, isLoading } = useDoc<AdminSettings>(adminSettingsRef);

    const brandName = isLoading ? "Loading..." : adminSettings?.brandName || "Swalaxon Admin";
    const logoUrl = adminSettings?.logoUrl || "/uploads/default-logo.svg";

    return (
        <div className="flex items-center gap-2">
            {isLoading ? (
                 <div className="h-8 w-8 bg-muted rounded-md animate-pulse"></div>
            ) : (
                <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded-md" />
            )}
            <h2 className="text-lg font-semibold font-headline">{brandName}</h2>
        </div>
    )
}

function LoggedOutHeader() {
    return (
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-muted rounded-md"></div>
           <h2 className="text-lg font-semibold font-headline">Swalaxon Admin</h2>
       </div>
   )
}


export function AdminHeader() {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
        return (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-md"></div>
                <div className="h-5 w-32 bg-muted rounded-md"></div>
            </div>
        )
    }

    if (!user) {
        return <LoggedOutHeader />;
    }

    return <LoggedInHeader />;
}
