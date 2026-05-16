// @sb/ui — StoneBridge avatar built on shadcn Avatar

'use client';

import { initials as initialsFromName } from '@sb/utils';
import { useCallback, useState } from 'react';

import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface SbAvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showRing?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<SbAvatarProps['size']>, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-14 w-14 text-lg',
};

const paletteClasses = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
] as const;

export function SbAvatar({ name, src, size = 'md', showRing, className }: SbAvatarProps) {
  const [failed, setFailed] = useState(false);
  const paletteIndex =
    name.length > 0 ? Math.abs(name.charCodeAt(0)) % paletteClasses.length : 0;
  const palette = paletteClasses[paletteIndex] ?? paletteClasses[0];
  const handleError = useCallback(() => setFailed(true), []);
  const label = initialsFromName(name, 2);
  const showImg = Boolean(src) && !failed;

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        showRing ? 'ring-2 ring-white dark:ring-gray-900' : '',
        className,
      )}
    >
      {showImg ? <AvatarImage src={src} alt="" onError={handleError} /> : null}
      <AvatarFallback className={cn('font-medium', showImg ? '' : palette)}>
        {label || '?'}
      </AvatarFallback>
    </Avatar>
  );
}
