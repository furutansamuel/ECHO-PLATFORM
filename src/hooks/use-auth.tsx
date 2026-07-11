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
  const demoMode =
    sessionStorage.getItem("echo_demo_mode") === "true";

  if (demoMode) {
  setUser(DEMO_USER);
  setProfile(DEMO_PROFILE);
  setUserStats(null);
}

  setLoading(false);

  return () => {
    alive = false;
  };
}

    const fetchProfile = async (userId: string) => {
      if (loading && lastFetchedProfileFor.current === userId) {
  return;
}

lastFetchedProfileFor.current = userId;
      try {
        const [
  profileResult,
  statsResult,
] = await Promise.all([
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

const {
  data,
  error,
} = profileResult;

const {
  data: stats,
  error: statsError,
} = statsResult;

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
const { data: stats, error: statsError } = statsResult;

if (!alive) return;

setProfile(
  data
    ? (data as UserProfile)
    : { id: userId, role: "citizen" }
);

setUserStats(stats ?? null);
setLoading(false);
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
  sessionStorage.removeItem("echo_demo_mode");
  sessionStorage.removeItem("echo_presentation_mode");
  sessionStorage.removeItem("echo_reports");
  sessionStorage.removeItem("echo_drafts");
  sessionStorage.removeItem("echo_stats");
  sessionStorage.removeItem("echo_notifications");
  sessionStorage.removeItem("echo_dismissed_hints");

  setLoading(true);
  
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
  if (
    alive &&
    !profile &&
    !user
  ) {
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
  const isDemo =
    import.meta.env.DEV &&
    sessionStorage.getItem("echo_demo_mode") === "true";

  // Clear demo data
  sessionStorage.removeItem("echo_demo_mode");
  sessionStorage.removeItem("echo_presentation_mode");
  sessionStorage.removeItem("echo_reports");
  sessionStorage.removeItem("echo_drafts");
  sessionStorage.removeItem("echo_stats");
  sessionStorage.removeItem("echo_notifications");
  sessionStorage.removeItem("echo_dismissed_hints");

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
