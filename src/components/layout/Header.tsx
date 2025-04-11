
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app";
import { Building, Menu, Plus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteUserDialog } from "@/components/condo/InviteUserDialog";

export function Header() {
  const { user, userCondos, activeCondoId, setActiveCondoId } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  
  const activeCondo = userCondos.find(condo => condo.id === activeCondoId);
  
  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
          
          <a className="flex items-center gap-2 font-semibold" href="/">
            <Building className="h-5 w-5 text-primary" />
            <span className="hidden md:inline-block">RegistraCondo</span>
          </a>
        </div>
        
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-16 left-0 right-0 flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-0 bg-background md:bg-transparent border-b md:border-0`}>
          {activeCondo && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{activeCondo.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userCondos.map((condo) => (
                  <DropdownMenuItem
                    key={condo.id}
                    onClick={() => setActiveCondoId(condo.id)}
                  >
                    {condo.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {activeCondoId && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setInviteDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite User</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <img
              src={user?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
              alt={user?.name || "User"}
              className="aspect-square h-full w-full"
            />
          </div>
        </div>
      </div>
      
      <InviteUserDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
        condoId={activeCondoId || ""} 
      />
    </header>
  );
}
