import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, SbAvatar, Badge, Button } from '@sb/ui';
import { formatDate } from '@sb/utils';
import type { Connection } from '@sb/types';

interface ConnectionCardProps {
  connection: Connection & { fabricatorName: string; fabricatorCity?: string; fabricatorState?: string; fabricatorLogoUrl?: string };
}

export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const navigate = useNavigate();

  const renderTierBadge = () => {
    switch (connection.pricingTier) {
      case 'vip':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">VIP</Badge>;
      case 'preferred':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">Preferred</Badge>;
      default:
        return <Badge variant="secondary">Standard</Badge>;
    }
  };

  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow h-full">
      <div className="p-4 flex items-start space-x-3 border-b border-border">
        <SbAvatar name={connection.fabricatorName || 'F'} src={connection.fabricatorLogoUrl} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate" title={connection.fabricatorName}>
            {connection.fabricatorName}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {connection.fabricatorCity || 'City'}, {connection.fabricatorState || 'ST'}
          </p>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Tier</span>
          {renderTierBadge()}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Connected</span>
          <span className="font-medium">{formatDate(connection.connectedAt || '')}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Status</span>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Active</Badge>
        </div>
      </div>

      <div className="p-4 bg-muted/20 border-t border-border mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/orders?fabricatorId=${connection.fabricatorId}`)}
        >
          View their POs
        </Button>
      </div>
    </Card>
  );
}
