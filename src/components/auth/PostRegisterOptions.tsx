
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

export function PostRegisterOptions() {
  const [condoHash, setCondoHash] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { loginWithCondoHash } = useAuth();
  const navigate = useNavigate();
  
  const handleJoinCondo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condoHash) {
      toast.error("Please enter a condo access code");
      return;
    }
    
    try {
      const user = await loginWithCondoHash(condoHash);
      if (user) {
        navigate("/");
        toast.success("Successfully joined the condo!");
      }
    } catch (error) {
      toast.error("Invalid condo access code. Please try again.");
    }
  };

  const handleCreateCondo = () => {
    navigate("/create-condo");
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">
            Choose an option to get started with your condo management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isJoining ? (
            <form onSubmit={handleJoinCondo} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter condo access code"
                  value={condoHash}
                  onChange={(e) => setCondoHash(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsJoining(false)}>
                  Back
                </Button>
                <Button type="submit" className="w-1/2">
                  Join Condo
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Button onClick={() => setIsJoining(true)} className="w-full">
                Join a Condo
              </Button>
              <Button onClick={handleCreateCondo} variant="outline" className="w-full">
                Create a Condo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
