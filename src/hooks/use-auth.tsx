import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export type UserRole = "citizen" | "volunteer" | "administrator";

interface UserProfile {
  id: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userStats: any;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "demo-user-id",
  email: "demo@echo.eco",
  user_metadata: { full_name: "Demo Showcase User" },
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  created_at: new Date().toISOString(),
} as User;

const DEMO_PROFILE: UserProfile = {
  id: "demo-user-id",
  role: "citizen",
  full_name: "Demo Showcase User",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchedProfileFor = useRef<string | null>(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    let alive = true;

    // If Supabase isn't configured, resolve immediately so the UI still renders.
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    const fetchProfile = async (userId: string) => {
      if (lastFetchedProfileFor.current === userId) return;
      lastFetchedProfileFor.current = userId;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        const { data: stats } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

setUserStats(stats);

if (!alive) return;

if (error && (error as { code?: string }).code !== "PGRST116") {
  console.error("[ECHO] profile fetch error", error);
}

if (data) {
  setProfile(data as UserProfile);
} else {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name:
        authUser?.user_metadata?.full_name ||
        authUser?.user_metadata?.display_name ||
        authUser?.email ||
        "Citizen",
      role: "citizen",
    })
    .select()
    .single();

  if (insertError) {
    console.error("[ECHO] profile creation error", insertError);
    setProfile({ id: userId, role: "citizen" });
  } else {
    setProfile(newProfile as UserProfile);
  }
}
      } catch (err) {
        if (!alive) return;
        console.error("[ECHO] profile fetch failed", err);
        setProfile({ id: userId, role: "citizen" });
      }
    };

    // Single subscription. Supabase emits INITIAL_SESSION on mount, so we don't
    // need a separate getSession() call.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      
      if (nextUser) {
  localStorage.removeItem("echo_demo_mode");
  localStorage.removeItem("echo_presentation_mode");
  localStorage.removeItem("echo_reports");
  localStorage.removeItem("echo_drafts");
  localStorage.removeItem("echo_stats");
  localStorage.removeItem("echo_notifications");
  localStorage.removeItem("echo_dismissed_hints");

  setUser(nextUser);

  void fetchProfile(nextUser.id).finally(() => {
    if (alive) setLoading(false);
  });
} else {
  lastFetchedProfileFor.current = null;
  setUser(null);
  setProfile(null);
  setLoading(false);
}
    });

    // Safety net: even if onAuthStateChange never fires, don't gate forever.
    const failSafe = setTimeout(() => {
      if (alive) setLoading(false);
    }, 4000);

    return () => {
      alive = false;
      clearTimeout(failSafe);
      sub.subscription.unsubscribe();
    };
  }, []);


  const refreshProfile = async () => {
  if (!user) return;

  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as UserProfile);
    }
  } catch (err) {
    console.error("[ECHO] refresh profile failed", err);
  }
};
  
  const logout = async () => {
    const isDemo =
      import.meta.env.DEV &&
      localStorage.getItem("echo_demo_mode") === "true";
    // Clear demo data
    localStorage.removeItem("echo_demo_mode");
    localStorage.removeItem("echo_presentation_mode");
    localStorage.removeItem("echo_reports");
    localStorage.removeItem("echo_drafts");
    localStorage.removeItem("echo_stats");
    localStorage.removeItem("echo_notifications");
    localStorage.removeItem("echo_dismissed_hints");
    
    if (isDemo) {
      window.location.href = "/";
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged out successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not sign out");
    }
  };

  return (
  <AuthContext.Provider
    value={{
      user,
      profile,
      userStats,
      loading,
      logout,
      refreshProfile,
      isAuthenticated: !!user,
    }}
  >
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
