
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPanelSettings } from '@/components/admin/settings/admin-panel-settings';
import { WebsiteHeaderSettings } from '@/components/admin/settings/website-header-settings';
import { FooterSettings } from '@/components/admin/settings/footer-settings';

export default function AdminSettingsPage() {

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
          <h1 className="text-3xl font-bold font-headline">Site Settings</h1>
          <p className="text-muted-foreground">Customize the look and feel of your website and admin panel.</p>
      </div>

      <Tabs defaultValue="admin-panel" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admin-panel">Admin Panel</TabsTrigger>
          <TabsTrigger value="website-header">Website Header</TabsTrigger>
          <TabsTrigger value="website-footer">Footer</TabsTrigger>
        </TabsList>
        <TabsContent value="admin-panel">
          <AdminPanelSettings />
        </TabsContent>
        <TabsContent value="website-header">
          <WebsiteHeaderSettings />
        </TabsContent>
        <TabsContent value="website-footer">
          <FooterSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
