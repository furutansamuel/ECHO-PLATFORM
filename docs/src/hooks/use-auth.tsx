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
  created_at?: string;
  region?: string;
  organization?: string;
  phone?: string;
  bio?: string;
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
      if (lastFetchedProfileFor.current === userId) {
  return;
      }

lastFetchedProfileFor.current = userId;
      try {
  const [profileResult, statsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(),

    supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const { data, error } = profileResult;

  const {
    data: stats,
    error: statsError,
  } = statsResult;

  // rest of code...

if (!alive) return;

if (statsError) {
  console.error("[ECHO] stats fetch error", statsError);
}

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

setUserStats(stats ?? null);

if (alive) {
  setLoading(false);
}
        
      } catch (err) {
  if (!alive) return;

  console.error("[ECHO] profile fetch failed", err);

  setProfile({
    id: userId,
    role: "citizen",
  });

  setLoading(false);
      }
    };

    // Single subscription. Supabase emits INITIAL_SESSION on mount, so we don't
    // need a separate getSession() call.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      const nextUser = session?.user ?? null;
      
     if (nextUser) {
       setUser(nextUser);
  sessionStorage.removeItem("echo_presentation_mode");

  void fetchProfile(nextUser.id);
       
} else {
  lastFetchedProfileFor.current = null;

  setUser(null);
  setProfile(null);
  setUserStats(null);
  setLoading(false);
     }
    });

    // Safety net: even if onAuthStateChange never fires, don't gate forever.
   const failSafe = setTimeout(() => {
  if (alive) {
    setLoading(false);
  }
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
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const { data: statsData } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData as UserProfile);
    }

    setUserStats(statsData ?? null);

  } catch (err) {
    console.error("[ECHO] refresh profile failed", err);
  }
};
  
  const logout = async () => {
  

  // Clear demo data
  sessionStorage.removeItem("echo_demo_mode");
sessionStorage.removeItem("echo_presentation_mode");
sessionStorage.removeItem("echo_reports");
sessionStorage.removeItem("echo_drafts");
sessionStorage.removeItem("echo_stats");
sessionStorage.removeItem("echo_notifications");
sessionStorage.removeItem("echo_dismissed_hints");

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
