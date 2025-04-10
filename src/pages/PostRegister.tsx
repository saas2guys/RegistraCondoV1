
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { PostRegisterOptions } from "@/components/auth/PostRegisterOptions";

export default function PostRegister() {
  const { user, userCondos, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      // If user is not authenticated, redirect to login
      if (!user) {
        navigate("/login");
        return;
      }
      
      // If user already has condos, redirect to dashboard
      if (userCondos.length > 0) {
        navigate("/");
        return;
      }
    }
  }, [user, userCondos, loading, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <PostRegisterOptions />;
}
