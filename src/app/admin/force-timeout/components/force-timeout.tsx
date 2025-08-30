'use client';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useServiceForceTimeout } from '@/services/admin/services';
import useGetAllTradeRequest from '../hooks/useGetAllTradeRequest';
import { ConfirmTimeoutDialog } from './confirm-timeout-dialog';

const TradeRequestsAdminPanel: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTradeRequest, setSelectedTradeRequest] = useState<API.TradeRequest | null>(null);
  const [tradeRequests, setTradeRequests] = useState<API.TradeRequest[]>([]);

  // Hook gọi API
  const { isPending, getAllTradeRequestApi } = useGetAllTradeRequest();
  const forceTimeoutMutation = useServiceForceTimeout();

  const fetchTradeRequests = async () => {
    const res = await getAllTradeRequestApi({});

    if (res && res.value.data) {
      const filtered = res.value.data.result.filter(
        (req: API.TradeRequest) => req.timeRemaining && req.timeRemaining !== 0
      );
      
      setTradeRequests(filtered);
    } else {
      setTradeRequests([]);
    }
  };

  useEffect(() => {
    fetchTradeRequests();
  }, []);

  const openModal = (tradeRequest: API.TradeRequest) => {
    setSelectedTradeRequest(tradeRequest);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTradeRequest(null);
  };

  const handleForceTimeout = async (): Promise<void> => {
    if (!selectedTradeRequest) return;

    try {
      await forceTimeoutMutation.mutateAsync(selectedTradeRequest.id);
      closeModal();
      fetchTradeRequests();
    } catch (error) {
      console.error('Force timeout failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'timeout':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'legendary':
        return 'bg-purple-100 text-purple-700';
      case 'epic':
        return 'bg-orange-100 text-orange-700';
      case 'rare':
        return 'bg-blue-100 text-blue-700';
      case 'common':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu Trao đổi</h1>
          <p className="text-gray-600 mt-2">Danh sách các yêu cầu trao đổi còn thời gian hiệu lực</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                    Mã yêu cầu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                    Vật phẩm listing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                    Chủ sở hữu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                    Người yêu cầu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                    Vật phẩm đề xuất
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tradeRequests.map((tradeRequest) => (
                  <tr key={tradeRequest.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-gray-900 truncate max-w-[100px]"
                        title={tradeRequest.id}
                      >
                        {tradeRequest.id}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="text-sm text-gray-900 truncate max-w-[140px]"
                        title={tradeRequest.listingItemName}
                      >
                        {tradeRequest.listingItemName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="text-sm text-gray-900 truncate max-w-[120px]"
                        title={tradeRequest.listingOwnerName}
                      >
                        {tradeRequest.listingOwnerName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="text-sm text-gray-900 truncate max-w-[120px]"
                        title={tradeRequest.requesterName}
                      >
                        {tradeRequest.requesterName}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tradeRequest.offeredItems.map((item) => (
                          <span
                            key={item.inventoryItemId}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(item.tier)}`}
                            title={item.itemName}
                          >
                            {item.tier}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tradeRequest.status)}`}
                      >
                        {tradeRequest.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {tradeRequest.requestedAt}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => openModal(tradeRequest)}
                        disabled={
                          forceTimeoutMutation.isPending ||
                          tradeRequest.status.toLowerCase() === 'timeout'
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Xử lí thời gian chờ</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <ConfirmTimeoutDialog
        isOpen={modalOpen && !!selectedTradeRequest}
        onClose={closeModal}
        onConfirm={handleForceTimeout}
        isLoading={forceTimeoutMutation.isPending}
        tradeRequestId={selectedTradeRequest?.id || ''}
      />
    </div>
  );
};

export default TradeRequestsAdminPanel;
