import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Battery, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await login(formData.email, formData.password);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const demoCredentials = [
    { email: 'admin@bms.com', password: 'admin123', role: 'Admin' },
    { email: 'user@bms.com', password: 'user123', role: 'User' },
    { email: 'demo@bms.com', password: 'demo123', role: 'Demo User' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <Helmet>
        <title>Login - Battery Management System</title>
        <meta name="description" content="Login to your Battery Management System account to monitor and manage your batteries in real-time." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex items-center space-x-2"> {/* Added Link to Home */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <Battery className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="text-blue-200 mt-2">Sign in to your BMS account</p>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-blue-200">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-sm">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setFormData({ email: cred.email, password: cred.password })}
              >
                <div>
                  <p className="text-white text-sm font-medium">{cred.role}</p>
                  <p className="text-blue-200 text-xs">{cred.email}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                  Use
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}