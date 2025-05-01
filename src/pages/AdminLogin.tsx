import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LockKeyhole, User, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/hooks/auth';


export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast("✅ Welcome back, admin!");
      navigate('/');
    } catch (err: any) {
      toast(`❌ ${err.message || err}`);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 animate-fade-in">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      <Card className="w-full max-w-md relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <CardHeader className="space-y-1 text-center relative">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Email" className="text-gray-700">Email</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 transition-shadow focus:border-blue-500 hover:border-gray-400"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative group">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-shadow focus:border-blue-500 hover:border-gray-400"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}