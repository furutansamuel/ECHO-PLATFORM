import React from 'react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Share2, Link2, Mail } from 'lucide-react';
import { ShareData, shareToWhatsApp, shareToFacebook, shareToX, shareByEmail, copyShareLink } from '@/lib/share-utils';

interface ShareMenuProps {
  data: ShareData;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShareMenu({ data, label = 'Share', variant = 'secondary', size = 'sm', className }: ShareMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4 mr-2" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => shareToWhatsApp(data)}>WhatsApp</DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToFacebook(data)}>Facebook</DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToX(data)}>X (Twitter)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareByEmail(data)}>
          <Mail className="w-3.5 h-3.5 mr-2" /> Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyShareLink(data)}>
          <Link2 className="w-3.5 h-3.5 mr-2" /> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
