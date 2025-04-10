
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InviteUserDialogProps {
  condoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ condoId, open, onOpenChange }: InviteUserDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [isLoading, setIsLoading] = useState(false);
  
  const { inviteUserToCondo } = useAuth();
  
  const handleInvite = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const success = await inviteUserToCondo(email, condoId, role);
      
      if (success) {
        toast.success(`Invitation sent to ${email}`);
        setEmail("");
        onOpenChange(false);
      } else {
        toast.error("Failed to send invitation");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Invite a user to join your condo as a member or admin.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as "member" | "admin")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Member</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
