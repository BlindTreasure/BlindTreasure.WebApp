'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, Sparkles, Check, X, Eye, Filter } from 'lucide-react';
import useGetAllBlindBoxes from '@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes';
import useReviewBlindbox from '../hooks/useReviewBlindbox'; // Import hook review
import { GetBlindBoxes, BlindBox, BlindBoxListResponse } from '@/services/blindboxes/typings';

interface BlindBoxApprovalData {
  all: BlindBox[];
  PendingApproval: BlindBox[];
  Approved: BlindBox[];
  Rejected: BlindBox[];
}

// Reject Modal Component
interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  boxName: string;
  isPending: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onConfirm, boxName, isPending }) => {
  const [rejectReason, setRejectReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectReason.trim()) {
      onConfirm(rejectReason.trim());
      setRejectReason('');
    }
  };

  const handleClose = () => {
    setRejectReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Từ chối Blind Box</h3>
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn từ chối blind box <strong>"{boxName}"</strong>?
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={3}
                required
                disabled={isPending}
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Từ chối
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const BlindBoxApprovalDashboard: React.FC = () => {
  const router = useRouter();
  const { getAllBlindBoxesApi, isPending } = useGetAllBlindBoxes();
  const { onReview, isPending: isReviewPending } = useReviewBlindbox();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'PendingApproval' | 'Approved' | 'Rejected'>('PendingApproval');
  const [blindBoxData, setBlindBoxData] = useState<BlindBoxApprovalData>({
    all: [],
    PendingApproval: [],
    Approved: [],
    Rejected: []
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    all: false,
    PendingApproval: false,
    Approved: false,
    Rejected: false
  });
  const [error, setError] = useState<string | null>(null);
  
  // Reject Modal state
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    boxId: string;
    boxName: string;
  }>({
    isOpen: false,
    boxId: '',
    boxName: ''
  });

  // Base params cho API
  const baseParams: GetBlindBoxes = {
    search: "",
    SellerId: "",
    categoryId: "",
    status: "",
    minPrice: undefined,
    maxPrice: undefined,
    ReleaseDateFrom: "",
    ReleaseDateTo: "",
    pageIndex: 1,
    pageSize: 100, // Lấy nhiều để hiển thị đầy đủ
  };

  // Fetch data cho một status cụ thể
  const fetchDataByStatus = async (status: string) => {
    if (loading[status]) return;

    setLoading(prev => ({ ...prev, [status]: true }));
    setError(null);

    try {
      const params = { ...baseParams, status };
      const response = await getAllBlindBoxesApi(params);
      
      if (response?.value?.data) {
        const data = response.value.data.result || [];
        setBlindBoxData(prev => ({
          ...prev,
          [status]: data
        }));
      }
    } catch (err) {
      console.error(`Error fetching ${status}:`, err);
      setError(`Không thể tải dữ liệu ${status}`);
    } finally {
      setLoading(prev => ({ ...prev, [status]: false }));
    }
  };

  // Fetch tất cả data
  const fetchAllData = async () => {
    if (loading.all) return;

    setLoading(prev => ({ ...prev, all: true }));
    setError(null);

    try {
      // Gọi song song 3 API
      const [pendingPromise, approvedPromise, rejectedPromise] = [
        getAllBlindBoxesApi({ ...baseParams, status: 'PendingApproval' }),
        getAllBlindBoxesApi({ ...baseParams, status: 'Approved' }),
        getAllBlindBoxesApi({ ...baseParams, status: 'Rejected' })
      ];

      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        pendingPromise,
        approvedPromise, 
        rejectedPromise
      ]);

      const pendingData = pendingRes?.value?.data?.result || [];
      const approvedData = approvedRes?.value?.data?.result || [];
      const rejectedData = rejectedRes?.value?.data?.result || [];

      setBlindBoxData({
        all: [...pendingData, ...approvedData, ...rejectedData],
        PendingApproval: pendingData,
        Approved: approvedData,
        Rejected: rejectedData
      });

    } catch (err) {
      console.error('Error fetching all data:', err);
      setError('Không thể tải dữ liệu');
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  // Hàm refresh toàn bộ dữ liệu sau khi approve/reject
  const refreshAllData = async () => {
    setError(null);
    
    try {
      // Gọi song song 3 API để lấy data mới nhất
      const [pendingPromise, approvedPromise, rejectedPromise] = [
        getAllBlindBoxesApi({ ...baseParams, status: 'PendingApproval' }),
        getAllBlindBoxesApi({ ...baseParams, status: 'Approved' }),
        getAllBlindBoxesApi({ ...baseParams, status: 'Rejected' })
      ];

      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        pendingPromise,
        approvedPromise, 
        rejectedPromise
      ]);

      const pendingData = pendingRes?.value?.data?.result || [];
      const approvedData = approvedRes?.value?.data?.result || [];
      const rejectedData = rejectedRes?.value?.data?.result || [];

      // Cập nhật toàn bộ dữ liệu
      setBlindBoxData({
        all: [...pendingData, ...approvedData, ...rejectedData],
        PendingApproval: pendingData,
        Approved: approvedData,
        Rejected: rejectedData
      });

    } catch (err) {
      console.error('Error refreshing all data:', err);
      setError('Không thể tải lại dữ liệu');
    }
  };

  // Effect để fetch data khi filter thay đổi
  useEffect(() => {
    if (statusFilter === 'all') {
      fetchAllData();
    } else {
      fetchDataByStatus(statusFilter);
    }
  }, [statusFilter]);

  // Initial load - mặc định load PendingApproval
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtered data dựa trên filter hiện tại
  const filteredBoxes = useMemo(() => {
    return blindBoxData[statusFilter] || [];
  }, [blindBoxData, statusFilter]);

  // Stats cho filter buttons
  const stats = useMemo(() => ({
    all: blindBoxData.all.length,
    PendingApproval: blindBoxData.PendingApproval.length,
    Approved: blindBoxData.Approved.length,
    Rejected: blindBoxData.Rejected.length
  }), [blindBoxData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PendingApproval':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Chờ duyệt</span>;
      case 'Approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Đã duyệt</span>;
      case 'Rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Từ chối</span>;
      case 'Draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Nháp</span>;
      default:
        return null;
    }
  };

  // Approve blindbox
  const handleApprove = async (box: BlindBox, e: React.MouseEvent) => {
    e.stopPropagation();
    
    onReview(
      {
        blindboxesId: box.id,
        reviewData: { approve: true }
      },
      () => {
        // Refresh toàn bộ data sau khi approve thành công
        refreshAllData();
      }
    );
  };

  // Show reject modal
  const handleReject = async (box: BlindBox, e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectModal({
      isOpen: true,
      boxId: box.id,
      boxName: box.name
    });
  };

  // Confirm reject với reason
  const handleConfirmReject = (reason: string) => {
    onReview(
      {
        blindboxesId: rejectModal.boxId,
        reviewData: { 
          approve: false, 
          rejectReason: reason 
        }
      },
      () => {
        // Close modal và refresh toàn bộ data
        setRejectModal({ isOpen: false, boxId: '', boxName: '' });
        refreshAllData();
      }
    );
  };

  // Close reject modal
  const handleCloseRejectModal = () => {
    if (!isReviewPending) {
      setRejectModal({ isOpen: false, boxId: '', boxName: '' });
    }
  };

  const handleViewDetails = (boxId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/staff/blindbox-detail/${boxId}`);
  };

  const handleFilterChange = (newFilter: typeof statusFilter) => {
    setStatusFilter(newFilter);
  };

  const isCurrentLoading = loading[statusFilter];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Blind Box</h1>
          <p className="text-gray-600">Duyệt và quản lý các blind box trong hệ thống</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => statusFilter === 'all' ? fetchAllData() : fetchDataByStatus(statusFilter)}
              className="mt-2 text-red-700 underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Filters & Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tất cả', count: stats.all },
                { key: 'PendingApproval', label: 'Chờ duyệt', count: stats.PendingApproval },
                { key: 'Approved', label: 'Đã duyệt', count: stats.Approved },
                { key: 'Rejected', label: 'Từ chối', count: stats.Rejected }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key as any)}
                  disabled={isCurrentLoading || isReviewPending}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    statusFilter === filter.key
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isCurrentLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Table */}
        {!isCurrentLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blind Box
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá bán
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBoxes.map((box) => (
                    <tr key={box.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={box.imageUrl || ''}
                              alt={box.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAxMkMxOCAxMiAxMiAxOCAxMiAyNFYyOEMxMiAzNCAxOCA0MCAyNCA0MEMzMCA0MCAzNiAzNCAzNiAyOFYyNEMzNiAxOCAzMCAxMiAyNCAxMloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                              }}
                            />
                            {box.hasSecretItem && (
                              <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full">
                                <Sparkles className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{box.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{box.description}</p>
                            {box.hasSecretItem && (
                              <p className="text-xs text-amber-600 font-medium">Secret: {box.secretProbability}%</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">{formatPrice(box.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{box.totalQuantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(box.releaseDate)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(box.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {box.status === 'PendingApproval' && (
                            <>
                              <button
                                onClick={(e) => handleApprove(box, e)}
                                disabled={isReviewPending}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                                title="Duyệt"
                              >
                                {isReviewPending ? (
                                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => handleReject(box, e)}
                                disabled={isReviewPending}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                title="Từ chối"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => handleViewDetails(box.id, e)}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isCurrentLoading && filteredBoxes.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'PendingApproval' ? 'Không có blind box nào chờ duyệt' : 
               statusFilter === 'Approved' ? 'Không có blind box nào đã duyệt' :
               statusFilter === 'Rejected' ? 'Không có blind box nào bị từ chối' :
               'Không có blind box nào'}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'PendingApproval' ? 'Tất cả blind box đã được xử lý' : 'Thử chọn bộ lọc khác'}
            </p>
          </div>
        )}

        {/* Reject Modal */}
        <RejectModal
          isOpen={rejectModal.isOpen}
          onClose={handleCloseRejectModal}
          onConfirm={handleConfirmReject}
          boxName={rejectModal.boxName}
          isPending={isReviewPending}
        />
      </div>
    </div>
  );
};

export default BlindBoxApprovalDashboard;