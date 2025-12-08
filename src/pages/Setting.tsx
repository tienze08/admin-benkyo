import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChangePassword } from "@/hooks/use-change-password";
import { toast } from "sonner";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useChangePassword();

  const validateFields = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return false;
    }

    if (newPassword === currentPassword) {
      toast.error("New password cannot be the same as the old password!");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return false;
    }

    return true;
  };

  const handleChangePassword = () => {
    if (!validateFields()) return;

    changePasswordMutation.mutate(
  { 
    oldPassword: currentPassword, 
    newPassword,
    confirmPassword 
  },
      {
        onSuccess: () => {
          toast.success("Your password has been changed successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Could not update password."
          );
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 border-sidebar-border bg-purple-50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* ACCOUNT SETTINGS */}
          <TabsContent value="account" className="mt-4">
            <Card className="border-sidebar-border">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account, password and security settings.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* CURRENT PASSWORD */}
                <div className="space-y-2">
                  <Label>Current password</Label>
                  <Input
                    type="password"
                    className="border border-sidebar-border"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                {/* NEW + CONFIRM PASSWORD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New password</Label>
                    <Input
                      type="password"
                      className="border border-sidebar-border"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirm password</Label>
                    <Input
                      type="password"
                      className="border border-sidebar-border"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-sidebar-border px-6 py-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="bg-dashboard-purple hover:bg-dashboard-purple/90"
                >
                  {changePasswordMutation.isPending
                    ? "Updating..."
                    : "Update password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* PROFILE TAB (future content) */}
          <TabsContent value="profile" className="mt-4" />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
