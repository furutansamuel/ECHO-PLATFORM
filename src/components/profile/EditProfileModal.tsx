import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({
  open,
  onOpenChange,
}: Props) {
  const {
    user,
    profile,
    refreshProfile,
  } = useAuth();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name || "");
    setAvatarUrl(profile.avatar_url || "");

    // phone may not exist
    setPhone((profile as any).phone || "");
  }, [profile]);
