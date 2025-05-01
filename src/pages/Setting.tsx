import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 border-sidebar-border bg-purple-50  text-sidebar-accent-foreground">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input className="border border-sidebar-border" id="firstName" placeholder="John" defaultValue="Admin" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input className="border border-sidebar-border" id="lastName" placeholder="Doe" defaultValue="User" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input className="border border-sidebar-border" id="email" type="email" placeholder="john.doe@example.com" defaultValue="admin@deckflow.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input className="border border-sidebar-border" id="jobTitle" placeholder="Product Manager" defaultValue="Administrator" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="management">
                    <SelectTrigger className="bg-purple-50 border border-sidebar-border" id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-50 border border-sidebar-border focus:ring-1 focus:ring-sidebar-border">
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="border-t border-sidebar-border px-6 py-4">
                <Button className="bg-dashboard-purple hover:bg-dashboard-purple/90">Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account, password and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input className="border border-sidebar-border" id="currentPassword" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input className="border border-sidebar-border" id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input className="border border-sidebar-border" id="confirmPassword" type="password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twoFactor">Two-factor authentication</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="twoFactor" />
                    <Label htmlFor="twoFactor">Enable two-factor authentication</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-sidebar-border px-6 py-4">
                <Button className="bg-dashboard-purple hover:bg-dashboard-purple/90">Update password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Account Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications when new accounts are created</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Revenue Updates</p>
                      <p className="text-sm text-muted-foreground">Receive weekly revenue summary reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Deck Approval Requests</p>
                      <p className="text-sm text-muted-foreground">Notifications for new deck approval requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Updates</p>
                      <p className="text-sm text-muted-foreground">Notifications about system changes and updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-muted-foreground">Receive marketing emails and product updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 border-sidebar-border">
                <Button className="bg-dashboard-purple hover:bg-dashboard-purple/90">Save preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
