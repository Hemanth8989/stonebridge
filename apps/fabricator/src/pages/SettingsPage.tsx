import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  Bell, 
  CreditCard, 
  Shield, 
  Cloud,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Input,
  Label,
  Switch,
  SbAvatar,
  Separator,
  cn 
} from '@sb/ui';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const { user, tenant, logout } = useAuthStore();

  if (!user || !tenant) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">Portal Settings</h1>
          <p className="text-sm font-medium text-muted-foreground italic">Manage your account, organization, and notification preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <div className="flex overflow-x-auto pb-2 custom-scrollbar">
          <TabsList className="bg-muted/40 p-1.5 h-12 rounded-2xl border border-border/20 shadow-inner inline-flex w-auto">
            <TabsTrigger value="profile" className="rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
              <User className="mr-2 h-3.5 w-3.5" />
              My Profile
            </TabsTrigger>
            <TabsTrigger value="organization" className="rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
              <Building2 className="mr-2 h-3.5 w-3.5" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
              <Bell className="mr-2 h-3.5 w-3.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              Billing
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="flex items-center gap-6">
                <SbAvatar name={user.fullName} size="xl" className="shadow-xl ring-4 ring-muted ring-offset-2" />
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="h-9 px-4 font-black uppercase tracking-widest text-[10px]">Change Photo</Button>
                  <p className="text-[10px] text-muted-foreground font-medium">Recommended: Square image, at least 400x400px.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Full Name</Label>
                  <Input defaultValue={user.fullName} className="h-11 shadow-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email Address</Label>
                  <Input defaultValue={user.email} className="h-11 shadow-sm font-bold bg-muted/30" disabled />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Phone Number</Label>
                  <Input defaultValue={user.phone || ''} className="h-11 shadow-sm font-bold" placeholder="(555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Timezone</Label>
                  <Input defaultValue="America/New_York (EST)" className="h-11 shadow-sm font-bold" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg">Save Profile Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Organization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Company Name</Label>
                  <Input defaultValue={tenant.name} className="h-11 shadow-sm font-black" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Portal URL / Slug</Label>
                  <div className="flex items-center">
                    <span className="h-11 px-3 flex items-center bg-muted border border-r-0 border-border rounded-l-xl text-[10px] font-bold text-muted-foreground">app.stonebridge.com/</span>
                    <Input defaultValue={tenant.slug} className="h-11 shadow-sm font-bold rounded-l-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Business Address</Label>
                <Input defaultValue="123 Stone Way, Quarryville, PA 17566" className="h-11 shadow-sm font-bold" />
              </div>

              <Separator className="bg-border/40" />

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/10">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase tracking-tight">Auto-Sync Catalog</p>
                      <p className="text-[10px] font-medium text-muted-foreground italic">Keep your favorite suppliers' stock live.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/10">
                    <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase tracking-tight">PO Counter Review</p>
                      <p className="text-[10px] font-medium text-muted-foreground italic">Allow suppliers to make counter offers.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg">Update Organization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Alert Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-border/40">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">Purchase Order Updates</p>
                    <p className="text-xs font-medium text-muted-foreground italic">Notify me when a PO is acknowledged, shipped, or countered.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In-App</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border/40">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">Live Catalog Alerts</p>
                    <p className="text-xs font-medium text-muted-foreground italic">Notify me when new slabs are added by my favorite suppliers.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                      <Switch />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In-App</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-foreground">Price Drop Watch</p>
                    <p className="text-xs font-medium text-muted-foreground italic">Notify me when products in my cart drop in price.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">In-App</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Danger Zone */}
      <div className="flex justify-center pt-12">
        <Button variant="ghost" className="text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-xs h-11 px-8" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out of Portal
        </Button>
      </div>
    </div>
  );
}
