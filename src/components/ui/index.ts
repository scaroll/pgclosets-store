/**
 * UI Component Library - Barrel Export
 *
 * Import components from this file for better tree-shaking and cleaner imports
 *
 * @example
 * import { Badge, Modal, Dropdown } from '@/components/ui';
 */

// Badge Component
export {
  Badge,
  badgeVariants,
  type BadgeProps,
} from './badge';

// Modal/Dialog Component
export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from './modal';

// Dropdown Component
export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownRadioGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownSubTriggerItem,
} from './dropdown';

// Tabs Component
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LineTabs,
  PillsTabs,
  EnclosedTabs,
} from './tabs';

// Tooltip Component
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  KeyboardTooltip,
  RichTooltip,
} from './tooltip';
