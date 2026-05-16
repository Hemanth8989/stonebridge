import React from 'react';
import { Link2 } from 'lucide-react';
import { SbPageHeader, SbEmptyState, SbSpinner } from '@sb/ui';
import { useConnections, useConnectionRequests, useApproveConnection, useDeclineConnection } from '../hooks/useConnections';
import ConnectionCard from '../components/connections/ConnectionCard';
import ConnectionRequestCard from '../components/connections/ConnectionRequestCard';

export default function ConnectionsPage() {
  const { data: connectionsData, isLoading: loadingConn } = useConnections();
  const { data: requestsData, isLoading: loadingReq } = useConnectionRequests();
  const connections = connectionsData?.data || [];
  const requests = requestsData?.data || [];
  const approveConn = useApproveConnection();
  const declineConn = useDeclineConnection();

  const isLoading = loadingConn || loadingReq;

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><SbSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <SbPageHeader title="Connections" description="Fabricators connected to your catalog" />

      {requests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Connection requests</h3>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">
              {requests.length} pending
            </span>
          </div>
          <div className="space-y-3 max-w-3xl">
            {requests.map((req) => (
              <ConnectionRequestCard
                key={req.id}
                connection={req as any}
                onApprove={(id) => approveConn.mutate(id)}
                onDecline={(id) => declineConn.mutate(id)}
                isPending={approveConn.isPending || declineConn.isPending}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active connections</h3>
        {connections.length === 0 ? (
          <SbEmptyState
            icon={<Link2 className="w-8 h-8" />}
            title="No connections yet"
            description="When fabricators request access to your catalog, they will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {connections.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
