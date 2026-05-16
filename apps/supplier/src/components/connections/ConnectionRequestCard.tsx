import React from 'react';
import { Card, SbAvatar, Button, SbSpinner } from '@sb/ui';
import { formatRelativeTime } from '@sb/utils';
import type { Connection } from '@sb/types';

interface ConnectionRequestCardProps {
  connection: Connection & { fabricatorName: string; fabricatorCity?: string; requestMessage?: string };
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  isPending: boolean;
}

export default function ConnectionRequestCard({ connection, onApprove, onDecline, isPending }: ConnectionRequestCardProps) {
  return (
    <Card className="border-l-4 border-l-amber-400 dark:border-l-amber-600 overflow-hidden">
      <div className="p-4 sm:flex sm:items-start sm:justify-between">
        <div className="flex items-start space-x-3">
          <SbAvatar name={connection.fabricatorName || 'F'} />
          <div>
            <div className="font-medium text-foreground">{connection.fabricatorName}</div>
            <div className="text-xs text-muted-foreground">
              Requested {formatRelativeTime(connection.requestedAt || '')}
            </div>
            {connection.requestMessage && (
              <div className="mt-2 text-sm italic text-muted-foreground border-l-2 border-border pl-2">
                "{connection.requestMessage}"
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDecline(connection.id)}
            disabled={isPending}
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={() => onApprove(connection.id)}
            disabled={isPending}
          >
            {isPending && <SbSpinner className="mr-2" size="sm" />}
            Approve
          </Button>
        </div>
      </div>
    </Card>
  );
}
