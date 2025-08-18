import React from 'react';
import { Edit, Trash2, Plus, UserCheck, UserPlus, UserMinus, Users } from 'lucide-react';
import { PromotionType, PromotionStatus, PromotionCreateByRole } from '@/const/promotion';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatDiscountValue = (value: number, type: PromotionType): string => {
  return type === PromotionType.Percentage ? `${value}%` : `${value.toLocaleString('vi-VN')}₫`;
};

const getDiscountTypeBadge = (type: PromotionType): string => {
  return type === PromotionType.Percentage 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-green-100 text-green-800';
};

const getDiscountTypeLabel = (type: PromotionType): string => {
  return type === PromotionType.Percentage ? 'Phần trăm' : 'Cố định';
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

const getCreatedByRoleLabel = (role: PromotionCreateByRole): string => {
  switch (role) {
    case PromotionCreateByRole.Staff:
      return 'Staff';
    case PromotionCreateByRole.Seller:
      return 'Seller';
    default:
      return 'N/A';
  }
};

const getCreatedByRoleBadge = (role: PromotionCreateByRole): string => {
  switch (role) {
    case PromotionCreateByRole.Staff:
      return 'bg-purple-100 text-purple-800';
    case PromotionCreateByRole.Seller:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const hasParticipated = (isParticipant: boolean | null | undefined): boolean => {
  return isParticipant === true;
};

interface PromotionTableProps {
  promotions: API.Promotion[];
  userRole: PromotionCreateByRole;
  onEdit: (promotion: API.Promotion) => void;
  onDelete: (id: string) => void;
  onView?: (promotion: API.Promotion) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onJoin?: (id: string) => void;
  onWithdraw?: (id: string) => void;
  onViewParticipants?: (promotion: API.Promotion) => void;
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
  onJoin,
  onWithdraw,
  onViewParticipants,
  isLoading = false
}) => {
  const isStaff = userRole === PromotionCreateByRole.Staff;
  const isSeller = userRole === PromotionCreateByRole.Seller;
  
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Code
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Mô tả
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[90px]">
                  Loại
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Giá trị
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Bắt đầu
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Kết thúc
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                  Giới hạn
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Giới hạn/User
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Trạng thái
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Tạo bởi
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
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
                  const isApproved = promotion.status === PromotionStatus.Approved;
                  const isSellerPromotion = promotion.createdByRole === PromotionCreateByRole.Seller;
                  const isStaffPromotion = promotion.createdByRole === PromotionCreateByRole.Staff;
                  const userHasParticipated = hasParticipated(promotion.isParticipant);
                  
                  return (
                    <tr 
                      key={promotion.id} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        isStaff && isSellerPromotion && isPending ? 'bg-yellow-25 border-l-4 border-l-yellow-400' : ''
                      }`}
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[90px]" title={promotion.code}>
                          {promotion.code}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-[140px]" title={promotion.description}>
                          {promotion.description}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDiscountTypeBadge(promotion.discountType)}`}>
                          {getDiscountTypeLabel(promotion.discountType)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDiscountValue(promotion.discountValue, promotion.discountType)}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(promotion.startDate)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(promotion.endDate)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {promotion.usageLimit?.toString() || '∞'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {promotion.maxUsagePerUser?.toString() || '1'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(promotion.status)}`}>
                            {getStatusLabel(promotion.status)}
                          </span>
                          
                          {isSeller && isStaffPromotion && (
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              userHasParticipated
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {userHasParticipated ? 'Đã tham gia' : 'Chưa tham gia'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCreatedByRoleBadge(promotion.createdByRole)}`}>
                          {getCreatedByRoleLabel(promotion.createdByRole)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {isSeller ? (
                            <>
                              {isSellerPromotion && onView && (
                                <button
                                  onClick={() => onView(promotion)}
                                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1 rounded transition-colors duration-150"
                                  title="Xem chi tiết"
                                  type="button"
                                >
                                  <Edit size={14} />
                                </button>
                              )}
                              
                              {isStaffPromotion && isApproved && (
                                <>
                                  {!userHasParticipated && onJoin && (
                                    <button
                                      onClick={() => onJoin(promotion.id)}
                                      className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded transition-colors duration-150"
                                      title="Tham gia"
                                      type="button"
                                    >
                                      <UserPlus size={14} />
                                    </button>
                                  )}
                                  
                                  {userHasParticipated && onWithdraw && (
                                    <button
                                      onClick={() => onWithdraw(promotion.id)}
                                      className="text-orange-600 hover:text-orange-900 hover:bg-orange-50 p-1 rounded transition-colors duration-150"
                                      title="Rút khỏi"
                                      type="button"
                                    >
                                      <UserMinus size={14} />
                                    </button>
                                  )}
                                  
                                  {onView && (
                                    <button
                                      onClick={() => onView(promotion)}
                                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors duration-150"
                                      title="Xem chi tiết"
                                      type="button"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {isStaffPromotion && (
                                <>
                                  <button
                                    onClick={() => onEdit(promotion)}
                                    className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded transition-colors duration-150"
                                    title="Sửa"
                                    type="button"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => onDelete(promotion.id)}
                                    className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-150"
                                    title="Xóa"
                                    type="button"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                              
                              {isSellerPromotion && (
                                <>
                                  {isPending ? (
                                    <>
                                      {onApprove && (
                                        <button
                                          onClick={() => onApprove(promotion.id)}
                                          className="text-green-600 hover:text-green-900 hover:bg-green-50 p-1 rounded transition-colors duration-150"
                                          title="Duyệt"
                                          type="button"
                                        >
                                          <UserCheck size={14} />
                                        </button>
                                      )}
                                      {onReject && (
                                        <button
                                          onClick={() => onReject(promotion.id)}
                                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors duration-150"
                                          title="Từ chối"
                                          type="button"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    onView && (
                                      <button
                                        onClick={() => onView(promotion)}
                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1 rounded transition-colors duration-150"
                                        title="Xem chi tiết"
                                        type="button"
                                      >
                                        <Edit size={14} />
                                      </button>
                                    )
                                  )}
                                </>
                              )}
                              
                              {/* View Participants button for approved promotions */}
                              {isApproved && onViewParticipants && (
                                <button
                                  onClick={() => onViewParticipants(promotion)}
                                  className="text-purple-600 hover:text-purple-900 hover:bg-purple-50 p-1 rounded transition-colors duration-150"
                                  title="Xem người tham gia"
                                  type="button"
                                >
                                  <Users size={14} />
                                </button>
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
      </div>
    </div>
  );
};

export default PromotionTable;