import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Supabase (detectSessionInUrl: true) parses the recovery token from the
  // email link into a real session automatically, but that happens
  // asynchronously — the PASSWORD_RECOVERY event confirms it's ready
  // before we let the user try to submit a new password.
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    // If the recovery session was already established before this
    // listener attached, PASSWORD_RECOVERY won't fire again — fall back
    // to checking for an active session after a short delay.
    const fallback = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
    }, 1500);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please fill in both fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password updated — please log in with your new password.');
        await supabase.auth.signOut();
        navigate('/auth/login');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <img src="/echo-wordmark.svg" alt="ECHO" className="h-10 w-auto mx-auto mb-3" />
          <CardTitle className="text-2xl font-bold text-center text-primary">Set a New Password</CardTitle>
          <CardDescription className="text-center">
            {ready
              ? 'Choose a new password for your account'
              : 'Verifying your reset link...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ready ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              This link may be invalid or expired. If verification doesn't complete in a
              few seconds,{' '}
              <button
                type="button"
                className="text-primary underline underline-offset-2"
                onClick={() => navigate('/auth/forgot-password')}
              >
                request a new reset link
              </button>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

