'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, ChevronRight, Clock, Sparkles, Check, X, Eye, Filter } from 'lucide-react';

interface BlindBoxItem {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Secret';
  imageUrl: string;
}

interface BlindBoxData {
  id: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  imageUrl: string;
  releaseDate: string;
  status: 'PendingApproval' | 'Approved' | 'Rejected';
  hasSecretItem: boolean;
  secretProbability: number;
  items: BlindBoxItem[];
}

const BlindBoxApprovalDashboard: React.FC = () => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'PendingApproval' | 'Approved' | 'Rejected'>('PendingApproval');

  const sampleData: BlindBoxData[] = [
    {
      id: "76db9c17-5e2b-425a-81aa-b151a563883d",
      name: "Summer Collection 2024",
      description: "Bộ sưu tập mùa hè với các items độc đáo và hiếm có",
      price: 260000,
      totalQuantity: 10,
      imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=blindbox-thumbnails%2Fthumbnails-24f6bceb-d224-42ce-8a7b-04e12eabf94a.webp&version_id=null",
      releaseDate: "2025-06-13T17:00:00Z",
      status: "PendingApproval",
      hasSecretItem: true,
      secretProbability: 10,
      items: [
        {
          productId: "ae3c3257-980e-42a0-992b-818af10c46a9",
          productName: "test2",
          quantity: 1,
          dropRate: 20,
          rarity: "Rare",
          imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=products%2Fproduct_thumbnails_ae3c3257-980e-42a0-992b-818af10c46a9_cf78c96e41bb40d6baa82a489a327b6b.jpg&version_id=null"
        }
      ]
    },
    {
      id: "86db9c17-5e2b-425a-81aa-b151a563883e",
      name: "Winter Special Box",
      description: "Hộp quà đặc biệt mùa đông",
      price: 180000,
      totalQuantity: 15,
      imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=blindbox-thumbnails%2Fthumbnails-24f6bceb-d224-42ce-8a7b-04e12eabf94a.webp&version_id=null",
      releaseDate: "2025-06-12T10:30:00Z",
      status: "Approved",
      hasSecretItem: false,
      secretProbability: 0,
      items: []
    },
    {
      id: "96db9c17-5e2b-425a-81aa-b151a563883f",
      name: "Limited Edition Box",
      description: "Phiên bản giới hạn",
      price: 450000,
      totalQuantity: 5,
      imageUrl: "https://minio.fpt-devteam.fun/api/v1/buckets/blindtreasure-bucket/objects/download?preview=true&prefix=blindbox-thumbnails%2Fthumbnails-24f6bceb-d224-42ce-8a7b-04e12eabf94a.webp&version_id=null",
      releaseDate: "2025-06-11T14:15:00Z",
      status: "Rejected",
      hasSecretItem: true,
      secretProbability: 5,
      items: []
    }
  ];

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
      default:
        return null;
    }
  };

  const filteredBoxes = sampleData.filter(box => 
    statusFilter === 'all' || box.status === statusFilter
  );

  const handleApprove = (boxId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Approve box:', boxId);
    // Handle approve logic here
  };

  const handleReject = (boxId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Reject box:', boxId);
    // Handle reject logic here
  };

  const handleViewDetails = (boxId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/staff/blindbox-form/${boxId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Blind Box</h1>
          <p className="text-gray-600">Duyệt và quản lý các blind box trong hệ thống</p>
        </div>

        {/* Filters & Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tất cả', count: sampleData.length },
                { key: 'PendingApproval', label: 'Chờ duyệt', count: sampleData.filter(b => b.status === 'PendingApproval').length },
                { key: 'Approved', label: 'Đã duyệt', count: sampleData.filter(b => b.status === 'Approved').length },
                { key: 'Rejected', label: 'Từ chối', count: sampleData.filter(b => b.status === 'Rejected').length }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Table */}
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
                            src={box.imageUrl}
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
                              onClick={(e) => handleApprove(box.id, e)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleReject(box.id, e)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

        {/* Empty State */}
        {filteredBoxes.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'PendingApproval' ? 'Không có blind box nào chờ duyệt' : `Không có blind box nào ${statusFilter === 'Approved' ? 'đã duyệt' : statusFilter === 'Rejected' ? 'bị từ chối' : ''}`}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'PendingApproval' ? 'Tất cả blind box đã được xử lý' : 'Thử chọn bộ lọc khác'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindBoxApprovalDashboard;