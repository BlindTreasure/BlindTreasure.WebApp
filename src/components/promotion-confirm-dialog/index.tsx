import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Confirmation Dialog Types
export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'success' | 'warning';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

// Dialog State Interface for hook usage
export interface DialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'success' | 'warning';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onConfirm: () => void;
}

// Hook for managing confirmation dialog state
export const useConfirmationDialog = () => {
  const [dialogState, setDialogState] = React.useState<DialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showConfirmDialog = React.useCallback((config: Omit<DialogState, 'isOpen'>) => {
    setDialogState({
      ...config,
      isOpen: true
    });
  }, []);

  const closeDialog = React.useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    dialogState,
    showConfirmDialog,
    closeDialog
  };
};

// Predefined icon variants
const getVariantIcon = (variant: ConfirmationDialogProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return <AlertTriangle className="h-6 w-6 text-red-600" />;
    case 'success':
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    case 'warning':
      return <XCircle className="h-6 w-6 text-orange-600" />;
    default:
      return <Info className="h-6 w-6 text-blue-600" />;
  }
};

// Get button styling based on variant
const getButtonStyle = (variant: ConfirmationDialogProps['variant']) => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-600';
    case 'success':
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-600';
    case 'warning':
      return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-600';
    default:
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600';
  }
};

// Get dialog size class
const getSizeClass = (size: ConfirmationDialogProps['size']) => {
  switch (size) {
    case 'sm':
      return 'sm:max-w-[375px]';
    case 'lg':
      return 'sm:max-w-[600px]';
    default:
      return 'sm:max-w-[425px]';
  }
};

// Main Confirmation Dialog Component
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  icon,
  size = 'md'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Use provided icon or get default variant icon
  const displayIcon = icon || getVariantIcon(variant);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={getSizeClass(size)}>
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {displayIcon && (
              <div className="flex-shrink-0 mt-0.5">
                {displayIcon}
              </div>
            )}
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-left">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm text-gray-600 text-left">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="mt-0 sm:mt-0"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={getButtonStyle(variant)}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Predefined dialog configurations for common actions
export const DialogConfigs = {
  delete: (itemName: string, onConfirm: () => void): Omit<DialogState, 'isOpen'> => ({
    title: 'Xác nhận xóa',
    description: `Bạn có chắc chắn muốn xóa "${itemName}"? Hành động này không thể hoàn tác.`,
    confirmText: 'Xóa',
    variant: 'destructive' as const,
    onConfirm
  }),

  approve: (itemName: string, onConfirm: () => void): Omit<DialogState, 'isOpen'> => ({
    title: 'Xác nhận duyệt',
    description: `Bạn có chắc chắn muốn duyệt "${itemName}"?`,
    confirmText: 'Duyệt',
    variant: 'success' as const,
    onConfirm
  }),

  reject: (itemName: string, onConfirm: () => void): Omit<DialogState, 'isOpen'> => ({
    title: 'Xác nhận từ chối',
    description: `Bạn có chắc chắn muốn từ chối "${itemName}"?`,
    confirmText: 'Từ chối',
    variant: 'destructive' as const,
    onConfirm
  }),

  join: (itemName: string, onConfirm: () => void): Omit<DialogState, 'isOpen'> => ({
    title: 'Xác nhận tham gia',
    description: `Bạn có chắc chắn muốn tham gia "${itemName}"?`,
    confirmText: 'Tham gia',
    variant: 'success' as const,
    onConfirm
  }),

  withdraw: (itemName: string, onConfirm: () => void): Omit<DialogState, 'isOpen'> => ({
    title: 'Xác nhận rút khỏi',
    description: `Bạn có chắc chắn muốn rút khỏi "${itemName}"?`,
    confirmText: 'Rút khỏi',
    variant: 'warning' as const,
    onConfirm
  }),

  custom: (
    title: string, 
    description: string, 
    onConfirm: () => void, 
    options?: {
      confirmText?: string;
      cancelText?: string;
      variant?: 'destructive' | 'default' | 'success' | 'warning';
      icon?: React.ReactNode;
      size?: 'sm' | 'md' | 'lg';
    }
  ): Omit<DialogState, 'isOpen'> => ({
    title,
    description,
    confirmText: options?.confirmText || 'Xác nhận',
    cancelText: options?.cancelText || 'Hủy',
    variant: options?.variant || 'default',
    icon: options?.icon,
    size: options?.size || 'md',
    onConfirm
  })
};

export default ConfirmationDialog;