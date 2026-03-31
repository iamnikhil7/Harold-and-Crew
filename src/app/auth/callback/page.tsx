"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ensure user record exists
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          account_linked: true,
          onboarding_completed: false,
        });

        // Check if onboarding is complete
        const { data } = await supabase
          .from("users")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        if (data?.onboarding_completed) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } else {
        router.push("/auth");
      }
    }
    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
      <p className="text-muted">Signing you in...</p>
    </div>
  );
}
