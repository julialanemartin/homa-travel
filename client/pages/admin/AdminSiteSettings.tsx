import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Home, Save, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRequest } from '@/lib/adminApi';

interface SiteSettingsFormProps {
  settingKey: string;
  title: string;
  description: string;
  type: 'text' | 'textarea' | 'url';
}

export default function AdminSiteSettings() {
  const { user, token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Define the settings we want to manage
  const settingsConfig: SiteSettingsFormProps[] = [
    {
      settingKey: 'site_name',
      title: 'Site Name',
      description: 'The name of the website displayed in the header and title',
      type: 'text'
    },
    {
      settingKey: 'site_logo_url',
      title: 'Site Logo URL',
      description: 'URL for the site logo displayed in the header',
      type: 'url'
    },
    {
      settingKey: 'site_tagline',
      title: 'Site Tagline',
      description: 'Short tagline shown on the homepage',
      type: 'text'
    },
    {
      settingKey: 'contact_email',
      title: 'Contact Email',
      description: 'Email address for site inquiries',
      type: 'text'
    },
    {
      settingKey: 'about_page_content',
      title: 'About Page Content',
      description: 'Main content for the about page',
      type: 'textarea'
    },
    {
      settingKey: 'footer_text',
      title: 'Footer Text',
      description: 'Text displayed in the website footer',
      type: 'text'
    }
  ];

  // Fetch site settings
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['/api/site-settings'],
    queryFn: async () => {
      const response = await fetch('/api/site-settings');
      if (!response.ok) throw new Error('Failed to fetch site settings');
      return response.json();
    }
  });

  // Define the mutation for updating settings
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!token) throw new Error('Not authenticated');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`/api/site-settings/${key}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ value })
      });
      if (!response.ok) throw new Error('Failed to update setting');
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
      toast({
        title: 'Setting Updated',
        description: 'The site setting has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // A component for each setting form
  const SettingForm = ({ settingKey, title, description, type }: SiteSettingsFormProps) => {
    // Find the current setting value or use empty string if not found
    const currentSetting = siteSettings?.find((s: any) => s.key === settingKey);
    const [value, setValue] = useState<string>(currentSetting?.value || '');

    // Update the state when settings are loaded
    React.useEffect(() => {
      if (currentSetting?.value) {
        setValue(currentSetting.value);
      }
    }, [currentSetting]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateSettingMutation.mutate({ key: settingKey, value });
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {type === 'textarea' ? (
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={6}
                className="w-full"
              />
            ) : (
              <Input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
            )}
            <Button 
              type="submit" 
              className="self-start"
              disabled={updateSettingMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Site Settings | Homa Travel Co. Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Admin Header */}
        <header className="bg-primary text-white py-4 px-6 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-2">
            <Link href="/admin">
              <a className="text-xl font-bold hover:underline">Homa Travel Co. Admin</a>
            </Link>
            <span className="mx-2">›</span>
            <h1 className="text-xl">Site Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.username}</span>
          </div>
        </header>

        <div className="flex flex-grow">
          {/* Admin Sidebar */}
          <aside className="w-64 bg-neutral-50 border-r shadow-sm">
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/admin">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Home className="h-5 w-5" />
                      <span className="ml-3">Dashboard</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/site-settings">
                    <a className="flex items-center p-3 rounded-md bg-neutral-200 text-primary">
                      <Settings className="h-5 w-5" />
                      <span className="ml-3">Site Settings</span>
                    </a>
                  </Link>
                </li>
                <li className="pt-4 mt-4 border-t">
                  <Link href="/">
                    <a className="flex items-center p-3 rounded-md hover:bg-neutral-100 transition-colors text-neutral-700 hover:text-primary">
                      <Home className="h-5 w-5" />
                      <span className="ml-3">View Website</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Admin Content */}
          <main className="flex-grow p-6 bg-neutral-100">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Site Settings</h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {settingsConfig.map((setting) => (
                  <SettingForm 
                    key={setting.settingKey}
                    settingKey={setting.settingKey}
                    title={setting.title}
                    description={setting.description}
                    type={setting.type}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}