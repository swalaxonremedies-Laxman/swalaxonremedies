"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const callbackUrl = searchParams.get('redirect_uri');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const effectivePassword = password || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, email, effectivePassword);
      router.push(callbackUrl || "/admin/dashboard");
    } catch (err: any) {
      // If user not found, create the account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, effectivePassword);
          // The onAuthStateChanged listener will handle the user object update
          // We can now try to sign in again or just redirect
           await signInWithEmailAndPassword(auth, email, effectivePassword);
           router.push(callbackUrl || "/admin/dashboard");
        } catch (createErr: any) {
           setError("Could not create admin account. Please try again.");
           setIsLoading(false);
        }
      } else if (err.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold font-headline mt-2">Admin Panel</h1>
      </div>
      <Card>
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
