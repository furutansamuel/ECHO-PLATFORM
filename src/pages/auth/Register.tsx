import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the Privacy Policy and Terms of Service to continue');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        if (data.session) {
          toast.success('Account created and logged in!');
          navigate('/dashboard');
        } else {
          toast.success('Account created! Please check your email for verification.');
          navigate('/login');
        }
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
          <CardTitle className="text-2xl font-bold text-center text-primary">Create Account</CardTitle>
          <CardDescription className="text-center">Join the ECHO community today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Musa" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="johnmusa@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                minLength={6}
              />
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ECHO collects your <span className="font-medium text-foreground">location</span> and any{' '}
                <span className="font-medium text-foreground">photos</span> you submit with hazard reports to
                verify and map environmental issues in your community.
              </p>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-xs font-normal leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-primary underline underline-offset-2">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/terms-of-service" target="_blank" className="text-primary underline underline-offset-2">
                    Terms of Service
                  </Link>
                </Label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Already have an account? <Button variant="link" className="px-0" onClick={() => navigate('/auth/login')}>Login</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
