import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardContent, Input, Label, Textarea, Button, Switch, Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@sb/ui';

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  logoUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().max(2000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  establishedYear: z.coerce.number().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "Acme Stones",
      establishedYear: 2005,
      description: "Premium stone supplier in the midwest.",
      website: "https://acmestones.example.com",
      phone: "(555) 123-4567"
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your company profile and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="displayName" render={({ field }) => (
                      <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="establishedYear" render={({ field }) => (
                      <FormItem><FormLabel>Established Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="website" render={({ field }) => (
                      <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="submit">Save profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">Main Hub <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Primary</span></div>
                  <div className="text-sm text-muted-foreground">123 Stone Ave, Chicago, IL 60601</div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button variant="outline">Add warehouse</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Moraware</CardTitle>
                <Switch />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Sync inventory and orders with Moraware Systemize.</p>
                <Button variant="outline" size="sm">Configure</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">ActionFlow</CardTitle>
                <Switch />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Connect your ActionFlow account for smooth data flow.</p>
                <Button variant="outline" size="sm">Configure</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">No webhooks configured.</p>
              <Button variant="outline">Add endpoint</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <div className="font-medium text-sm">New Purchase Orders</div>
                  <div className="text-xs text-muted-foreground">When a fabricator sends a new PO</div>
                </div>
                <div className="flex space-x-6">
                  <div className="flex flex-col items-center"><Label className="mb-2 text-xs">Email</Label><Switch defaultChecked /></div>
                  <div className="flex flex-col items-center"><Label className="mb-2 text-xs">In-app</Label><Switch defaultChecked /></div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium text-sm">Connection Requests</div>
                  <div className="text-xs text-muted-foreground">When a fabricator wants to connect</div>
                </div>
                <div className="flex space-x-6">
                  <div className="flex flex-col items-center"><Label className="mb-2 text-xs">Email</Label><Switch defaultChecked /></div>
                  <div className="flex flex-col items-center"><Label className="mb-2 text-xs">In-app</Label><Switch defaultChecked /></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
