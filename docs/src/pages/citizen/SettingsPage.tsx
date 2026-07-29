import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Bell, Moon, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  const toggleDark = (value: boolean) => {
    setDarkMode(value);
    document.documentElement.classList.toggle("dark", value);
    toast.success(value ? "Dark mode enabled" : "Light mode enabled");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your ECHO preferences and account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Control how ECHO reaches you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push">In-app notifications</Label>
            <Switch id="push" checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="email">Email alerts</Label>
            <Switch id="email" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Moon className="h-5 w-5 text-primary" /> Appearance
          </CardTitle>
          <CardDescription>Choose how ECHO looks on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark">Dark mode</Label>
            <Switch id="dark" checked={darkMode} onCheckedChange={toggleDark} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" /> Region
          </CardTitle>
          <CardDescription>Nigeria — more locales coming soon.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <Shield className="h-5 w-5" /> Account
          </CardTitle>
          <CardDescription>Sign out of your ECHO session on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => logout()}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
