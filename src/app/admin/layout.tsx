
'use client';
import { ReactNode } from "react";
import { AdminClientLayout } from "./admin-client-layout";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar, AdminSidebarFooter } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-background">
                <Sidebar>
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                           <AdminHeader />
                        </div>
                        <AdminSidebar />
                        <AdminSidebarFooter />
                    </div>
                </Sidebar>
                <AdminClientLayout>
                    {children}
                </AdminClientLayout>
            </div>
        </SidebarProvider>
    )
}
