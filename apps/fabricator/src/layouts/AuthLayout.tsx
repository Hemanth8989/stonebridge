import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@sb/ui';
import { useAuthStore } from '../store/authStore';

export default function AuthLayout() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    setAuth(
      { 
        id: 'u1', 
        tenantId: 't1',
        email: 'fabricator@example.com', 
        fullName: 'Fabricator Admin', 
        role: 'admin', 
        authUid: 'clk1', 
        phone: null,
        avatarUrl: null,
        lastLogin: null,
        isActive: true,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      { 
        id: 't1', 
        name: 'Grand Countertops', 
        type: 'fabricator', 
        slug: 'grand-countertops',
        plan: 'pro',
        planStartedAt: new Date().toISOString(),
        planExpiresAt: null,
        stripeCid: null,
        billingEmail: 'billing@example.com',
        country: 'US',
        timezone: 'UTC',
        isActive: true,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      },
      'fake-jwt-token'
    );
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mb-4 shadow-lg">
          S
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">StoneBridge</h1>
        <p className="text-sm text-muted-foreground mt-1">Fabricator Portal</p>
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>Enter your email and password to access the portal</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="name@company.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full shadow-lg">Sign in</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} StoneBridge Platforms Inc. All rights reserved.
      </div>
    </div>
  );
}
