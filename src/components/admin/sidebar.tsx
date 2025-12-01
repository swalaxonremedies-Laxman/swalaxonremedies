
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ArrowLeftSquare,
  LucideIcon
} from "lucide-react";
import { useDoc, useFirestore, useMemoFirebase, useAuth } from "@/firebase";
import { doc } from "firebase/firestore";
import { iconMap } from "./icon-map";
import { Skeleton } from "../ui/skeleton";
import { signOut } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NavLink {
    href: string;
    label: string;
    icon: string;
    visible: boolean;
}

interface AdminSettings {
    navLinks?: NavLink[];
}

const defaultNavLinks: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard", visible: true },
  { href: "/admin/products", label: "Products", icon: "Package", visible: true },
  { href: "/admin/blog", label: "Blog", icon: "Newspaper", visible: true },
  { href: "/admin/ai-sourcing", label: "AI Sourcing", icon: "Bot", visible: true },
  { href: "/admin/settings", label: "Site Settings", icon: "Settings", visible: true },
];

function SidebarNavLinks() {
    const pathname = usePathname();
    const firestore = useFirestore();

    const adminSettingsRef = useMemoFirebase(
        () => (firestore ? doc(firestore, "/settings/admin") : null),
        [firestore]
    );
    const { data: adminSettings, isLoading } = useDoc<AdminSettings>(adminSettingsRef);
    
    const navLinks = !isLoading && adminSettings?.navLinks ? adminSettings.navLinks : defaultNavLinks;

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div>
        )
    }

    return (
        <>
            {navLinks.filter(link => link.visible).map((link) => {
                const Icon = iconMap[link.icon] || iconMap.Link;
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                        isActive && "bg-muted text-primary font-semibold"
                    )}
                    >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    </Link>
                );
            })}
        </>
    )
}

export function AdminSidebar() {
  return (
      <nav className="flex-1 px-4 py-4 space-y-2">
        <SidebarNavLinks />
      </nav>
  );
}

export function AdminSidebarFooter() {
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Force a hard redirect to the homepage to clear all state.
            window.location.href = '/';
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
                <ArrowLeftSquare className="mr-2 h-4 w-4" />
                View Site
            </Link>
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start mt-2">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be returned to the homepage.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                        Logout
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
      </div>
    )
}
