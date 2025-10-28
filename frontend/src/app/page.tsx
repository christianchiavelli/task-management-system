"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        redirect("/dashboard");
      } else {
        redirect("/login");
      }
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
