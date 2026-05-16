import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem, 
  SbAvatar,
  Button
} from '@sb/ui';
import { useAuthStore } from '../../store/authStore';

interface UserMenuProps {
  hideName?: boolean;
}

export default function UserMenu({ hideName }: UserMenuProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {hideName ? (
          <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
            <SbAvatar name={user.fullName} size="sm" />
          </Button>
        ) : (
          <div className="flex w-full cursor-pointer items-center space-x-3 rounded-lg border border-border/50 bg-accent/30 p-2 transition-all hover:bg-accent/60">
            <SbAvatar name={user.fullName} size="sm" className="shadow-sm" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold text-foreground">{user.fullName}</p>
              <p className="truncate text-[10px] text-muted-foreground">Fabricator Admin</p>
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side={hideName ? 'bottom' : 'top'}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings?tab=profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
