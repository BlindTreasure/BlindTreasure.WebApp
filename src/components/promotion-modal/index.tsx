'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { promotionSchema, PromotionFormData, defaultValues } from '@/utils/schema-validations/promotion.schema';
import { PromotionType, PromotionStatus, PromotionCreateByRole } from '@/const/promotion';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: REQUEST.PromotionForm) => Promise<void>;
  viewingPromotion?: API.Promotion | null;
  modalMode?: 'create' | 'edit' | 'view' | 'review';
  isLoading?: boolean;
  currentUserRole?: PromotionCreateByRole;
  pendingAction?: { type: 'approve' | 'reject', id: string } | null;
  onReviewAction?: ( isApproved: boolean, rejectReason?: string ) => Promise<void>;
}

const formatDateTimeLocal = (date: string | Date): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatToISOWithTimezone = (dateTimeLocal: string): string => {
  if (!dateTimeLocal) return '';
  const dateObj = new Date(dateTimeLocal);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().replace('.000Z', '+00:00');
};

const getStatusConfig = (status: PromotionStatus) => {
  const configs = {
    [PromotionStatus.Approved]: {
      color: 'bg-green-100 text-green-800',
      text: 'Đã duyệt'
    },
    [PromotionStatus.Rejected]: {
      color: 'bg-red-100 text-red-800',
      text: 'Từ chối'
    },
    [PromotionStatus.Pending]: {
      color: 'bg-yellow-100 text-yellow-800',
      text: 'Chờ duyệt'
    }
  };
  return configs[status] || { color: 'bg-gray-100 text-gray-800', text: 'Không xác định' };
};

const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  viewingPromotion,
  modalMode = 'create',
  isLoading = false,
  currentUserRole,
  pendingAction,
  onReviewAction
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectReasonRequired, setIsRejectReasonRequired] = useState(false);
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues
  });

  const discountType = watch('discountType');
  
  // Memoized mode checks
  const modeFlags = useMemo(() => ({
    isViewMode: modalMode === 'view',
    isReviewMode: modalMode === 'review',
    isEditMode: modalMode === 'edit',
    isCreateMode: modalMode === 'create'
  }), [modalMode]);

  // Memoized permissions
  const permissions = useMemo(() => {
    const hasEditPermission = () => {
      if (modeFlags.isCreateMode) return true;
      if (!viewingPromotion || !currentUserRole) return false;
      
      // Same role can edit their own promotions
      return viewingPromotion.createdByRole === currentUserRole;
    };

    const shouldDisableEdit = () => {
      if (modeFlags.isViewMode || modeFlags.isReviewMode) return true;
      if (!viewingPromotion) return false;
      
      // No edit permission
      if (!hasEditPermission()) return true;
      
      // Cannot edit pending promotions
      return viewingPromotion.status === PromotionStatus.Pending;
    };

    const shouldShowActionButtons = () => {
      // Always show for create mode
      if (modeFlags.isCreateMode) return true;
      
      // Edit mode requires edit permission
      if (modeFlags.isEditMode && !hasEditPermission()) return false;
      
      // Check role-based permissions
      if (viewingPromotion && currentUserRole) {
        return viewingPromotion.createdByRole === currentUserRole;
      }
      
      return false;
    };

    return {
      hasEditPermission: hasEditPermission(),
      shouldDisableEdit: shouldDisableEdit(),
      shouldShowActionButtons: shouldShowActionButtons()
    };
  }, [modeFlags, viewingPromotion, currentUserRole]);

  const isFieldDisabled = permissions.shouldDisableEdit || isLoading || isSubmitting;
  const isProcessing = isSubmitting || isLoading;

  // Memoized status config
  const statusConfig = useMemo(() => {
    return viewingPromotion ? getStatusConfig(viewingPromotion.status) : null;
  }, [viewingPromotion]);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (modalMode !== 'create' && viewingPromotion) {
        reset({
          code: viewingPromotion.code,
          description: viewingPromotion.description,
          discountType: viewingPromotion.discountType,
          discountValue: viewingPromotion.discountValue,
          startDate: formatDateTimeLocal(viewingPromotion.startDate),
          endDate: formatDateTimeLocal(viewingPromotion.endDate),
          usageLimit: viewingPromotion.usageLimit
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [viewingPromotion, isOpen, reset, modalMode]);

  // Form submission
  const onSubmitForm = async (data: PromotionFormData) => {
    if (modeFlags.isViewMode || modeFlags.isReviewMode) return;
    
    try {
      const formattedData = {
        ...data,
        startDate: formatToISOWithTimezone(data.startDate),
        endDate: formatToISOWithTimezone(data.endDate)
      };
      
      await onSubmit(formattedData as REQUEST.PromotionForm);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Close modal handler
  const handleClose = () => {
    if (!isProcessing) {
      reset(defaultValues);
      setShowRejectModal(false);
      setRejectReason('');
      setIsRejectReasonRequired(false);
      onClose();
    }
  };

  // Review action handlers
  const handleReviewActionClick = (action: boolean) => {
    if (!action) {
      setShowRejectModal(true);
    } else if (onReviewAction) {
      onReviewAction(true);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      setIsRejectReasonRequired(true);
      return;
    }

    if (onReviewAction) {
      try {
        await onReviewAction(false, rejectReason.trim());
        setShowRejectModal(false);
        setRejectReason('');
        setIsRejectReasonRequired(false);
      } catch (error) {
        console.error('Error rejecting promotion:', error);
      }
    }
  };

  // UI helper functions
  const getModalTitle = () => {
    const titles = {
      create: 'Thêm Promotion mới',
      edit: 'Chỉnh sửa Promotion',
      view: 'Chi tiết Promotion',
      review: 'Duyệt Promotion'
    };
    return titles[modalMode] || 'Promotion';
  };

  const getDisabledReason = () => {
    if (!viewingPromotion) return '';
    
    if (viewingPromotion.status === PromotionStatus.Pending) {
      return 'Promotion đang chờ duyệt, không thể chỉnh sửa';
    }
    
    if (!permissions.hasEditPermission) {
      const roleMessages = {
        [PromotionCreateByRole.Staff]: 'Promotion được tạo bởi Seller, Staff không thể chỉnh sửa',
        [PromotionCreateByRole.Seller]: 'Promotion được tạo bởi Staff, Seller không thể chỉnh sửa'
      };
      
      if (currentUserRole && viewingPromotion.createdByRole !== currentUserRole) {
        return roleMessages[currentUserRole] || 'Bạn không có quyền chỉnh sửa promotion này';
      }
    }
    
    return '';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {modeFlags.isViewMode && <Eye size={20} className="text-blue-600" />}
                {modeFlags.isReviewMode && <CheckCircle size={20} className="text-green-600" />}
                <h2 className="text-xl font-semibold text-gray-800">
                  {getModalTitle()}
                </h2>
              </div>
              {(modeFlags.isViewMode || modeFlags.isReviewMode) && statusConfig && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              type="button"
            >
              <X size={24} />
            </button>
          </div>

          {/* Warning Message */}
          {modeFlags.isEditMode && permissions.shouldDisableEdit && (
            <div className="px-6 py-3 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3" />
                <p className="text-sm text-yellow-700">{getDisabledReason()}</p>
              </div>
            </div>
          )}

          {/* Reject Reason Display */}
          {viewingPromotion?.status === PromotionStatus.Rejected && viewingPromotion.rejectReason && (
            <div className="px-6 py-3 bg-red-50 border-l-4 border-red-400">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Lý do từ chối:</p>
                  <p className="text-sm text-red-700">{viewingPromotion.rejectReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">
                  {modeFlags.isViewMode ? 'Đang tải...' : 
                   modeFlags.isEditMode ? 'Đang cập nhật...' : 
                   modeFlags.isReviewMode ? 'Đang xử lý...' : 'Đang tạo promotion...'}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Code Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isFieldDisabled}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.code ? 'border-red-500' : 'border-gray-300'
                        } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Nhập mã promotion (VD: SUMMER2025)"
                      />
                    )}
                  />
                  {errors.code && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isFieldDisabled}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Nhập mô tả promotion"
                      />
                    )}
                  />
                  {errors.description && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Discount Type Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="discountType"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          if (!isFieldDisabled) {
                            const value = e.target.value as PromotionType;
                            field.onChange(value);
                            setValue('discountValue', 0);
                          }
                        }}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <option value={PromotionType.Percentage}>Percentage (%)</option>
                        <option value={PromotionType.Fixed}>Fixed Amount ($)</option>
                      </select>
                    )}
                  />
                </div>

                {/* Discount Value Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Controller
                      name="discountValue"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          disabled={isFieldDisabled}
                          min="0"
                          max={discountType === PromotionType.Percentage ? 100 : undefined}
                          step={discountType === PromotionType.Percentage ? 1 : 0.01}
                          onChange={(e) => {
                            if (isFieldDisabled) return;
                            const value = parseFloat(e.target.value) || 0;
                            const processedValue = discountType === PromotionType.Percentage 
                              ? Math.min(Math.max(value, 0), 100)
                              : Math.max(value, 0);
                            field.onChange(processedValue);
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.discountValue ? 'border-red-500' : 'border-gray-300'
                          } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                          placeholder={discountType === PromotionType.Fixed ? '0.00' : '0-100'}
                        />
                      )}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">
                        {discountType === PromotionType.Percentage ? '%' : '$'}
                      </span>
                    </div>
                  </div>
                  {errors.discountValue && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.discountValue.message}</p>
                  )}
                </div>

                {/* Start Date Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        disabled={isFieldDisabled}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    )}
                  />
                  {errors.startDate && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                {/* End Date Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="datetime-local"
                        disabled={isFieldDisabled}
                        min={!isFieldDisabled ? watch('startDate') : undefined}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      />
                    )}
                  />
                  {errors.endDate && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>

                {/* Usage Limit Field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Usage Limit <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="usageLimit"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        disabled={isFieldDisabled}
                        min="0"
                        onChange={(e) => {
                          if (isFieldDisabled) return;
                          const value = parseInt(e.target.value) || 0;
                          field.onChange(Math.max(value, 0));
                        }}
                        className={`w-full md:w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.usageLimit ? 'border-red-500' : 'border-gray-300'
                        } ${isFieldDisabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder="Nhập số lần sử dụng tối đa"
                      />
                    )}
                  />
                  {errors.usageLimit && !isFieldDisabled && (
                    <p className="text-sm text-red-600">{errors.usageLimit.message}</p>
                  )}
                  {!isFieldDisabled && (
                    <p className="text-xs text-gray-500">
                      Số lần tối đa promotion có thể được sử dụng (0 = không giới hạn)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {modeFlags.isViewMode || modeFlags.isReviewMode ? 'Đóng' : 'Hủy'}
              </button>
              
              {modeFlags.isReviewMode && pendingAction && (
                <>
                  <button
                    type="button"
                    onClick={() => handleReviewActionClick(false)}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReviewActionClick(true)}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    Duyệt
                  </button>
                </>
              )}
              
              {!modeFlags.isViewMode && !modeFlags.isReviewMode && permissions.shouldShowActionButtons && (
                <button
                  type="submit"
                  disabled={isProcessing || permissions.shouldDisableEdit}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isProcessing && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <Save size={16} />
                  {isProcessing 
                    ? (modeFlags.isEditMode ? 'Đang cập nhật...' : 'Đang tạo...') 
                    : (modeFlags.isEditMode ? 'Cập nhật' : 'Thêm mới')
                  }
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <XCircle size={20} className="text-red-600" />
                Từ chối Promotion
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Vui lòng nhập lý do từ chối promotion này:
                </p>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lý do từ chối <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      if (isRejectReasonRequired && e.target.value.trim()) {
                        setIsRejectReasonRequired(false);
                      }
                    }}
                    placeholder="Nhập lý do từ chối..."
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      isRejectReasonRequired ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {isRejectReasonRequired && (
                    <p className="text-sm text-red-600">Vui lòng nhập lý do từ chối</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setIsRejectReasonRequired(false);
                }}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <XCircle size={16} />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionModal;