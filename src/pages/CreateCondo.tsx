
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateCondo() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { createCondo, user } = useAuth();
  const navigate = useNavigate();
  
  const handleCreateCondo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a condo");
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      const newCondo = await createCondo({
        name,
        address,
        city,
        state,
        zipCode
      });
      
      if (newCondo) {
        toast.success("Condo created successfully!");
        navigate("/");
      } else {
        toast.error("Failed to create condo. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create a Condo</CardTitle>
          <CardDescription className="text-center">
            Enter your condo details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCondo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Condo Name</Label>
              <Input
                id="name"
                placeholder="Ocean View Condos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="94105"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating condo..." : "Create Condo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
