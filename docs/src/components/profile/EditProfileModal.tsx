import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { uploadImage } from "@/lib/storage-upload";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

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
import { Textarea } from "@/components/ui/textarea";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [region, setRegion] = useState("");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name || "");
    setAvatarUrl(profile.avatar_url || "");
    setPhone(profile.phone || "");
    setRegion(profile.region || "");
    setOrganization(profile.organization || "");
    setBio(profile.bio || "");
  }, [profile]);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const { url, error } = await uploadImage('profile-images', file, user.id);
    setUploadingAvatar(false);
    e.target.value = '';
    if (error) {
      toast.error(error);
      return;
    }
    if (url) setAvatarUrl(url);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone,
          avatar_url: avatarUrl,
          region,
          organization,
          bio,
          role: profile?.role || "citizen",
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await refreshProfile();

      toast.success("Profile updated successfully");

      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {fullName
                  ? fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "U"}
              </AvatarFallback>
            </Avatar>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold"
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingAvatar ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploadingAvatar ? "Uploading..." : "Change Photo"}
            </Button>
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="region">Community / Ward</Label>
            <Input
              id="region"
              placeholder="e.g. Lafia, Nasarawa State"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              placeholder="Optional"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="A short line about you and why you report environmental issues"
              value={bio}
              maxLength={160}
              onChange={(e) => setBio(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{bio.length}/160</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
