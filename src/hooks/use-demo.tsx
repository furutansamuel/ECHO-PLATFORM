import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Sonner from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface DemoHint {
  id: string;
  title: string;
  message: string;
  target?: string;
  action?: string;
  route?: string;
}

interface DemoContextType {
  isDemoMode: boolean;
  isPresentationMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  setPresentationMode: (enabled: boolean) => void;
  resetDemo: () => void;
  dismissedHints: string[];
  dismissHint: (hintId: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return sessionStorage.getItem('echo_demo_mode') === 'true';
  });

  const [isPresentationMode, setIsPresentationMode] = useState(() => {
    return sessionStorage.getItem('echo_presentation_mode') === 'true';
  });

  const [dismissedHints, setDismissedHints] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('echo_dismissed_hints');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('echo_demo_mode', String(isDemoMode));
    if (!isDemoMode) {
      setIsPresentationMode(false);
      sessionStorage.setItem('echo_presentation_mode', 'false');
    }
  }, [isDemoMode]);

  useEffect(() => {
    sessionStorage.setItem('echo_presentation_mode', String(isPresentationMode));
    if (isPresentationMode) {
      document.body.classList.add('presentation-mode');
    } else {
      document.body.classList.remove('presentation-mode');
    }
  }, [isPresentationMode]);

  useEffect(() => {
    sessionStorage.setItem('echo_dismissed_hints', JSON.stringify(dismissedHints));
  }, [dismissedHints]);
  useEffect(() => {
  const { data: authListener } =
    supabase.auth.onAuthStateChange((_event, session) => {
      const realUserAuthenticated = !!session?.user;

      if (realUserAuthenticated && isDemoMode) {
        sessionStorage.removeItem('echo_demo_mode');
        sessionStorage.removeItem('echo_presentation_mode');
        sessionStorage.removeItem('echo_dismissed_hints');
        sessionStorage.removeItem('echo_reports');
        sessionStorage.removeItem('echo_drafts');
        sessionStorage.removeItem('echo_stats');
        sessionStorage.removeItem('echo_notifications');

        setIsDemoMode(false);
        setIsPresentationMode(false);
        setDismissedHints([]);
      }
    });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, [isDemoMode]);

  const resetDemo = () => {
    sessionStorage.removeItem('echo_reports');
    sessionStorage.removeItem('echo_drafts');
    sessionStorage.removeItem('echo_stats');
    sessionStorage.removeItem('echo_notifications');
    sessionStorage.removeItem('echo_dismissed_hints');
    setDismissedHints([]);
    Sonner.toast.success('Demo data reset to default states');
    // Reload to apply changes if needed
    window.location.reload();
  };

  const dismissHint = (hintId: string) => {
    setDismissedHints(prev => [...prev, hintId]);
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      isPresentationMode,
      setDemoMode: setIsDemoMode,
      setPresentationMode: setIsPresentationMode,
      resetDemo,
      dismissedHints,
      dismissHint
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
