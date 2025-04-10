
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [condoHash, setCondoHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  
  const { login, loginWithCondoHash } = useAuth();
  const navigate = useNavigate();
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCondoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condoHash) return;
    
    setIsLoading(true);
    try {
      const user = await loginWithCondoHash(condoHash);
      if (user) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            to access your condo management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="condo">Condo Hash</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="condo">
              <form onSubmit={handleCondoLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="condoHash">Condo Hash</Label>
                  <Input
                    id="condoHash"
                    placeholder="Enter your condo access code"
                    value={condoHash}
                    onChange={(e) => setCondoHash(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Accessing..." : "Access Condo"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
