
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully');

        // The AuthProvider's profile fetch runs asynchronously off the
        // auth-state-change event, so its 'profile.role' isn't
        // guaranteed to be populated yet at this exact moment — this
        // was why login always fell through to '/dashboard' even for
        // administrator accounts. Query the role directly here instead
        // of relying on that context state.
        let destination = '/dashboard';
        if (data.user) {
          const { data: profileRow } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profileRow?.role === 'administrator') {
            destination = '/admin';
          }
        }

        navigate(destination);
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
          <CardTitle className="text-2xl font-bold text-center text-primary">Login to ECHO</CardTitle>
          <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button type="button" variant="link" className="px-0 h-auto text-xs" onClick={() => navigate('/auth/forgot-password')}>Forgot password?</Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <div className="text-center text-sm text-muted-foreground w-full">
            Don't have an account? <Button variant="link" className="px-0" onClick={() => navigate('/auth/register')}>Register</Button>
          </div>
                  </CardFooter>
      </Card>
    </div>
  );
}

