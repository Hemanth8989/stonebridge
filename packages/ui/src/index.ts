// @sb/ui — StoneBridge UI package
// shadcn/ui components + StoneBridge custom components

// ── Utility ──────────────────────────────────────────────────
export { cn } from './lib/utils';

// ── shadcn/ui base components ─────────────────────────────────
export { Button, buttonVariants, type ButtonProps } from './components/ui/button';
export { Badge, badgeVariants } from './components/ui/badge';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';
export { Input } from './components/ui/input';
export { Textarea } from './components/ui/textarea';
export { Label } from './components/ui/label';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/ui/select';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog';
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/ui/alert-dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/ui/dropdown-menu';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './components/ui/tooltip';
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover';
export { Separator } from './components/ui/separator';
export { Switch } from './components/ui/switch';
export { Checkbox } from './components/ui/checkbox';
export {
  Avatar as RadixAvatar,
  AvatarImage,
  AvatarFallback,
} from './components/ui/avatar';
export { Progress } from './components/ui/progress';
export { ScrollArea, ScrollBar } from './components/ui/scroll-area';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/ui/table';
export { Skeleton } from './components/ui/skeleton';
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './components/ui/collapsible';
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
  type FormProviderProps,
} from './components/ui/form';

// ── StoneBridge custom components ─────────────────────────────
export { SbAvatar } from './components/stonebridge/sb-avatar';
export {
  POStatusBadge,
  SlabStatusBadge,
  VariantStatusBadge,
} from './components/stonebridge/sb-status-badge';
export { SbVerifiedBadge } from './components/stonebridge/sb-verified-badge';
export { SbPriceDisplay } from './components/stonebridge/sb-price-display';
export { SbEmptyState } from './components/stonebridge/sb-empty-state';
export { SbDataTable, type Column } from './components/stonebridge/sb-data-table';
export { SbStatCard } from './components/stonebridge/sb-stat-card';
export { SbPageHeader } from './components/stonebridge/sb-page-header';
export { SbSearchInput } from './components/stonebridge/sb-search-input';
export { SbFilterBadge } from './components/stonebridge/sb-filter-badge';
export { SbConfirmationDialog } from './components/stonebridge/sb-confirmation-dialog';
export { SbSpinner } from './components/stonebridge/sb-spinner';
