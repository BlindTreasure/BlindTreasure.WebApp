'use client'
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PromotionModal from '@/components/promotion-modal';
import PromotionTable from '@/components/promotion-table';
import { PaginationFooter } from '@/components/pagination-footer';
import { PromotionStatus, PromotionCreateByRole } from '@/const/promotion';
import useGetPromotion from '@/app/staff/promotion-management/hooks/useGetAllPromotion';
import useGetPromotionById from '@/app/staff/promotion-management/hooks/useGetPromotionById';
import { useServiceCreatePromotion } from '@/services/promotion/services';
import { useServiceUpdatePromotion } from '@/services/promotion/services';
import { useServiceReviewPromotion } from '@/services/promotion/services';
import { useServiceDeletePromotion } from '@/services/promotion/services';
import { useServiceParticipantPromotion } from '@/services/promotion/services';
import { useServiceWithdrawPromotion } from '@/services/promotion/services';
import { useAppSelector } from "@/stores/store";

const PromotionCrud: React.FC = () => {
  const [promotions, setPromotions] = useState<API.Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPromotion, setEditingPromotion] = useState<API.Promotion | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'review'>('create');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject', id: string } | null>(null);
  const [isLoadingPromotionDetail, setIsLoadingPromotionDetail] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const { isPending: isLoadingPromotions, getPromotionApi } = useGetPromotion();
  const { isPending: isLoadingPromotionById, getPromotionByIdApi } = useGetPromotionById();
  const { mutate: createPromotion, isPending: isCreatingPromotion } = useServiceCreatePromotion();
  const { mutate: updatePromotion, isPending: isUpdatingPromotion } = useServiceUpdatePromotion();
  const { mutate: reviewPromotion, isPending: isReviewingPromotion } = useServiceReviewPromotion();
  const { mutate: deletePromotion, isPending: isDeletingPromotion } = useServiceDeletePromotion();
  
  // Add hooks for participant and withdraw promotion
  const { mutate: participantPromotion, isPending: isParticipatingPromotion } = useServiceParticipantPromotion();
  const { mutate: withdrawPromotion, isPending: isWithdrawingPromotion } = useServiceWithdrawPromotion();
  
  const profile = useAppSelector((state) => state.userSlice.user);
  const currentUserRole = profile?.roleName as PromotionCreateByRole;
  
  const loadPromotions = async () => {
    try {
      setIsInitialLoading(true);
      const params: REQUEST.GetPromotion = {
        sellerId: profile?.sellerId,
        pageIndex: currentPage,
        pageSize: pageSize
      };
      console.log(profile);
      
      const response = await getPromotionApi(params);      
      
      if (response?.value?.data) {
        setPromotions(response.value.data.result || []);
        setTotalItems(response.value.data.count || 0);
        setTotalPages(response.value.data.totalPages || 0);
      } else {
        setPromotions([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      setPromotions([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, [currentPage, pageSize]);

  const refreshPromotions = async () => {
    try {
      const params: REQUEST.GetPromotion = {
        sellerId: profile?.sellerId,
        pageIndex: currentPage,
        pageSize: pageSize
      };
      const response = await getPromotionApi(params);
      
      if (response?.value?.data) {
        setPromotions(response.value.data.result || []);
        setTotalItems(response.value.data.count || 0);
        setTotalPages(response.value.data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error refreshing promotions:', error);
    }
  };

  const handleAdd = (): void => {
    setEditingPromotion(null);
    setModalMode('create');
    setPendingAction(null);
    setIsModalOpen(true);
  };

  // Kiểm tra quyền chỉnh sửa
  const canEditPromotion = (promotion: API.Promotion): boolean => {
    if (currentUserRole === PromotionCreateByRole.Staff && promotion.createdByRole === PromotionCreateByRole.Staff) return true;
    return false;
  };

  // Hàm load chi tiết promotion - dành cho tất cả mode trừ create
  const loadPromotionDetail = async (promotionId: string): Promise<API.Promotion | null> => {
    try {
      setIsLoadingPromotionDetail(true);
      const detailResponse = await getPromotionByIdApi(promotionId);
      
      if (detailResponse?.value?.data) {
        return detailResponse.value.data;
      }
      return null;
    } catch (error) {
      console.error('Error loading promotion details:', error);
      return null;
    } finally {
      setIsLoadingPromotionDetail(false);
    }
  };

  // Hàm xử lý mở modal với dữ liệu chi tiết
  const openModalWithPromotionDetail = async (
    promotion: API.Promotion,
    mode: 'edit' | 'view' | 'review',
    pendingActionData?: { type: 'approve' | 'reject', id: string }
  ): Promise<void> => {
    try {
      // Load chi tiết promotion
      const detailPromotion = await loadPromotionDetail(promotion.id);
      
      // Sử dụng dữ liệu chi tiết nếu có, không thì fallback về dữ liệu từ table
      const promotionData = detailPromotion || promotion;
      
      setEditingPromotion(promotionData);
      setModalMode(mode);
      setPendingAction(pendingActionData || null);
      setIsModalOpen(true);
    } catch (error) {
      console.error(`Error loading promotion details for ${mode}:`, error);
      // Fallback sử dụng dữ liệu từ table
      setEditingPromotion(promotion);
      setModalMode(mode);
      setPendingAction(pendingActionData || null);
      setIsModalOpen(true);
    }
  };

  const handleEdit = async (promotion: API.Promotion): Promise<void> => {
    const mode = canEditPromotion(promotion) ? 'edit' : 'view';
    await openModalWithPromotionDetail(promotion, mode);
  };

  const handleView = async (promotion: API.Promotion): Promise<void> => {
    await openModalWithPromotionDetail(promotion, 'view');
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Bạn có chắc chắn muốn xóa promotion này?')) {
      try {
        deletePromotion(
          { promotionId: id },
          {
            onSuccess: () => {
              // Refresh promotions after successful deletion
              refreshPromotions();
            },
            onError: (error) => {
              console.error('Error deleting promotion:', error);
              // Optionally refresh to ensure data consistency
              refreshPromotions();
            }
          }
        );
      } catch (error) {
        console.error('Error deleting promotion:', error);
        // Refresh promotions in case of error to ensure data consistency
        refreshPromotions();
      }
    }
  };

  // Xử lý duyệt promotion - mở modal trước
  const handleApprove = async (id: string): Promise<void> => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    await openModalWithPromotionDetail(
      promotion, 
      'review', 
      { type: 'approve', id }
    );
  };

  // Xử lý từ chối promotion - mở modal trước
  const handleReject = async (id: string): Promise<void> => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    await openModalWithPromotionDetail(
      promotion, 
      'review', 
      { type: 'reject', id }
    );
  };

  // Function to handle joining promotion
  const handleJoin = async (id: string): Promise<void> => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    const confirmMessage = `Bạn có chắc chắn muốn tham gia promotion "${promotion.code}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        participantPromotion(
          { promotionId: id },
          {
            onSuccess: () => {
              // Refresh promotions after successful participation
              refreshPromotions();
            },
            onError: (error) => {
              console.error('Error joining promotion:', error);
              // Optionally refresh to ensure data consistency
              refreshPromotions();
            }
          }
        );
      } catch (error) {
        console.error('Error joining promotion:', error);
        // Refresh promotions in case of error to ensure data consistency
        refreshPromotions();
      }
    }
  };

  // New function to handle withdrawing from promotion
  const handleWithdraw = async (id: string): Promise<void> => {
    const promotion = promotions.find(p => p.id === id);
    if (!promotion) return;

    const confirmMessage = `Bạn có chắc chắn muốn rút khỏi promotion "${promotion.code}"?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        withdrawPromotion(
          { promotionId: id, sellerId: profile?.sellerId },
          {
            onSuccess: () => {
              // Refresh promotions after successful withdrawal
              refreshPromotions();
            },
            onError: (error) => {
              console.error('Error withdrawing from promotion:', error);
              // Optionally refresh to ensure data consistency
              refreshPromotions();
            }
          }
        );
      } catch (error) {
        console.error('Error withdrawing from promotion:', error);
        // Refresh promotions in case of error to ensure data consistency
        refreshPromotions();
      }
    }
  };

  const handleReviewAction = async (action: boolean, rejectReason?: string): Promise<void> => {
    if (!pendingAction) return;

    const confirmMessage = action
      ? 'Bạn có chắc chắn muốn duyệt promotion này?' 
      : 'Bạn có chắc chắn muốn từ chối promotion này?';

    if (window.confirm(confirmMessage)) {
      try {
        const reviewData: REQUEST.ReviewPromotion = {
          promotionId: pendingAction.id,
          isApproved: action,
          rejectReason: !action ? (rejectReason || '') : ''
        };

        reviewPromotion(reviewData, {
          onSuccess: () => {
            // Đóng modal
            setIsModalOpen(false);
            setEditingPromotion(null);
            setPendingAction(null);
            setModalMode('create');
            
            // Refresh data
            refreshPromotions();
          },
          onError: (error) => {
            console.error(`Error ${action ? 'approving' : 'rejecting'} promotion:`, error);
          }
        });
      } catch (error) {
        console.error(`Error ${action ? 'approving' : 'rejecting'} promotion:`, error);
      }
    }
  };

  const handleModalSubmit = async (formData: REQUEST.PromotionForm): Promise<void> => {
    if (modalMode === 'edit' && editingPromotion) {
      return new Promise((resolve, reject) => {
        const updateData = {
          ...formData,
          promotionId: editingPromotion.id
        };

        updatePromotion(updateData, {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingPromotion(null);
            setPendingAction(null);
            setModalMode('create');
            refreshPromotions();
            resolve();
          },
          onError: (error) => {
            console.error('Failed to update promotion:', error);
            reject(error);
          }
        });
      });
    } else if (modalMode === 'create') {
      return new Promise((resolve, reject) => {
        createPromotion(formData, {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingPromotion(null);
            setPendingAction(null);
            setModalMode('create');
            refreshPromotions();
            resolve();
          },
          onError: (error) => {
            console.error('Failed to create promotion:', error);
            reject(error);
          }
        });
      });
    }
  };

  const handleModalClose = (): void => {
    setIsModalOpen(false);
    setEditingPromotion(null);
    setPendingAction(null);
    setModalMode('create');
  };

  // Pagination handlers
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize);
    setCurrentPage(1);
  };
  
  // Update loading state to include withdraw promotion
  const isTableLoading = isLoadingPromotions || isLoadingPromotionById || isReviewingPromotion || isLoadingPromotionDetail || isDeletingPromotion || isParticipatingPromotion || isWithdrawingPromotion;
  const isModalLoading = isCreatingPromotion || isUpdatingPromotion || isLoadingPromotionById || isReviewingPromotion || isLoadingPromotionDetail;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Quản lý mã khuyến mãi</h1>
            </div>
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-wrapper-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý mã khuyến mãi</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshPromotions}
                disabled={isLoadingPromotions}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
                type="button"
              >
                <svg className={`w-4 h-4 ${isLoadingPromotions ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoadingPromotions ? 'Đang tải...' : 'Làm mới'}
              </button>

              <button
                onClick={handleAdd}
                disabled={isCreatingPromotion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <Plus size={20} />
                {isCreatingPromotion 
                  ? 'Đang tạo...' 
                  : (currentUserRole === 'Staff' ? 'Tạo Promotion' : 'Thêm Promotion')
                }
              </button>
            </div>
          </div>

          <div className="relative">
            {isTableLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <PromotionTable
              promotions={promotions}
              userRole={currentUserRole}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
              onJoin={handleJoin}
              onWithdraw={handleWithdraw}
              isLoading={isTableLoading}
            />
          </div>

          {/* Pagination Footer */}
          <PaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <PromotionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        viewingPromotion={modalMode !== "create" ? editingPromotion : null}
        modalMode={modalMode}
        isLoading={isModalLoading}
        currentUserRole={currentUserRole}
        pendingAction={pendingAction}
        onReviewAction={handleReviewAction}
      />
    </div>
  );
};

export default PromotionCrud;