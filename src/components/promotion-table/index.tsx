import React from 'react';
import { Edit, Trash2, Plus, UserCheck } from 'lucide-react';
import { PromotionType, PromotionStatus, PromotionCreateByRole } from '@/const/promotion';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDiscountValue = (value: number, type: PromotionType): string => {
  return type === PromotionType.Percentage ? `${value}%` : `$${value.toFixed(2)}`;
};

const getDiscountTypeBadge = (type: PromotionType): string => {
  return type === PromotionType.Percentage 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-green-100 text-green-800';
};

const getDiscountTypeLabel = (type: PromotionType): string => {
  return type === PromotionType.Percentage ? 'Percentage' : 'Fixed Amount';
};

const getStatusBadge = (status: PromotionStatus): string => {
  switch (status.toString()) {
    case PromotionStatus.Approved.toString():
      return 'bg-green-100 text-green-800';
    case PromotionStatus.Pending.toString():
      return 'bg-yellow-100 text-yellow-800';
    case PromotionStatus.Rejected.toString():
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: PromotionStatus): string => {
  switch (status.toString()) {
    case PromotionStatus.Approved.toString():
      return 'Đã duyệt';
    case PromotionStatus.Pending.toString():
      return 'Chờ duyệt';
    case PromotionStatus.Rejected.toString():
      return 'Từ chối';
    default:
      return 'Không xác định';
  }
};

// Simplified permission functions
const canEditPromotion = (promotion: API.Promotion, userRole: PromotionCreateByRole): boolean => {
  if (userRole === PromotionCreateByRole.Seller) return false; // Seller không thể edit
  if (userRole === PromotionCreateByRole.Staff && promotion.createdByRole === PromotionCreateByRole.Staff) return true;
  return false;
};

const canDeletePromotion = (promotion: API.Promotion, userRole: PromotionCreateByRole): boolean => {
  if (userRole === PromotionCreateByRole.Seller) return false; // Seller không thể delete
  if (userRole === PromotionCreateByRole.Staff && promotion.createdByRole === PromotionCreateByRole.Staff) {
    return true;
  }
  return false;
};

interface PromotionTableProps {
  promotions: API.Promotion[];
  userRole: PromotionCreateByRole;
  onEdit: (promotion: API.Promotion) => void;
  onDelete: (id: string) => void;
  onView?: (promotion: API.Promotion) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isLoading?: boolean;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotions,
  userRole,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onReject,
  isLoading = false
}) => {
  const isStaff = userRole === PromotionCreateByRole.Staff;
  const isSeller = userRole === PromotionCreateByRole.Seller;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-28" />
          <col className="w-40" />
          <col className="w-28" />
          <col className="w-24" />
          <col className="w-36" />
          <col className="w-36" />
          <col className="w-20" />
          <col className="w-24" />
          <col className={isStaff ? "w-32" : "w-20"} />
        </colgroup>
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Limit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg font-medium">Đang tải dữ liệu...</p>
                </div>
              </td>
            </tr>
          ) : promotions.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">Chưa có promotion nào</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isStaff ? 'Nhấn "Tạo Promotion" hoặc chờ Seller tạo để duyệt' : 'Nhấn "Thêm Promotion" để bắt đầu'}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            promotions.map((promotion) => {
              const isPending = promotion.status === PromotionStatus.Pending;
              const isSellerPromotion = promotion.createdByRole === PromotionCreateByRole.Seller;
              const isStaffPromotion = promotion.createdByRole === PromotionCreateByRole.Staff;

              return (
                <tr 
                  key={promotion.id} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    isStaff && isSellerPromotion && isPending ? 'bg-yellow-25 border-l-4 border-l-yellow-400' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate" title={promotion.code}>
                      {promotion.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-40 truncate" title={promotion.description}>
                      {promotion.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDiscountTypeBadge(promotion.discountType)}`}>
                      {getDiscountTypeLabel(promotion.discountType)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDiscountValue(promotion.discountValue, promotion.discountType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="truncate">
                      {formatDate(promotion.startDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="truncate">
                      {formatDate(promotion.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {promotion.usageLimit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(promotion.status)}`}>
                      {getStatusLabel(promotion.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      {/* Logic for Seller role - chỉ có thể view */}
                      {isSeller ? (
                        onView && (
                          <button
                            onClick={() => onView(promotion)}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1 rounded transition-colors duration-150"
                            title="Xem chi tiết"
                            type="button"
                          >
                            <Edit size={16} />
                          </button>
                        )
                      ) : (
                        /* Logic for Staff role - giữ nguyên */
                        <>
                          {/* Staff's own promotions - can edit and delete */}
                          {isStaffPromotion && (
                            <>
                              <button
                                onClick={() => onEdit(promotion)}
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors duration-150"
                                title="Xem/Sửa promotion"
                                type="button"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => onDelete(promotion.id)}
                                className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-150"
                                title="Xóa promotion"
                                type="button"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          
                          {/* Seller's promotions */}
                          {isSellerPromotion && (
                            <>
                              {/* Pending promotions - approve/reject */}
                              {isPending ? (
                                <>
                                  {onApprove && (
                                    <button
                                      onClick={() => onApprove(promotion.id)}
                                      className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded transition-colors duration-150"
                                      title="Duyệt promotion"
                                      type="button"
                                    >
                                      <UserCheck size={16} />
                                    </button>
                                  )}
                                  {onReject && (
                                    <button
                                      onClick={() => onReject(promotion.id)}
                                      className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-150"
                                      title="Từ chối promotion"
                                      type="button"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </>
                              ) : (
                                /* Non-pending promotions - view only */
                                onView && (
                                  <button
                                    onClick={() => onView(promotion)}
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1 rounded transition-colors duration-150"
                                    title="Xem chi tiết"
                                    type="button"
                                  >
                                    <Edit size={16} />
                                  </button>
                                )
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;