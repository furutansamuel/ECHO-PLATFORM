import { memo } from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountInformationProps {
  memberSince: string | null | undefined;
  region: string | null | undefined;
  organization: string | null | undefined;
}

function AccountInformationBase({ memberSince, region, organization }: AccountInformationProps) {
  const rows = [
    {
      key: 'memberSince',
      label: 'Member Since',
      value: memberSince ? new Date(memberSince).toLocaleDateString() : 'Not available',
    },
    { key: 'lastActivity', label: 'Last Activity', value: 'No activity yet' },
    { key: 'region', label: 'Preferred Region', value: region || 'Not set' },
    { key: 'organization', label: 'Organization', value: organization || 'Not set' },
  ];

  return (
    <Card className="border-muted/20 [contain:content]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {rows.map((row) => (
            <div key={row.key} className="flex justify-between items-center py-2 border-b border-muted">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-bold italic">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const AccountInformation = memo(AccountInformationBase);

