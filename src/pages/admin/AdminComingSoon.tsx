import React from 'react';
import { Construction } from 'lucide-react';

interface AdminComingSoonProps {
  title: string;
}

export default function AdminComingSoon({ title }: AdminComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Construction className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-display font-bold text-primary">{title}</h1>
      <p className="text-muted-foreground text-sm mt-2 max-w-sm">
        This section is planned for a later phase and isn't built yet — you're
        seeing this instead of a broken link.
      </p>
    </div>
  );
}
