import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { SbAvatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@sb/ui';
import { useAuthStore } from '../../store/authStore';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 w-full hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors text-left outline-none">
        <SbAvatar name={user.fullName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{user.fullName}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate('/settings?tab=profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
