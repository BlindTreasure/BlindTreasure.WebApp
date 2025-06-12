'use client'
import React from 'react';
import { 
  Package, 
  X, 
  Calendar, 
  DollarSign, 
  Hash, 
  Sparkles, 
  Info, 
  ArrowLeft,
  Check,
  XCircle,
  Clock,
  Eye,
  Percent
} from 'lucide-react';

interface BlindBoxItem {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Secret';
  imageUrl: string;
}

export interface BlindBoxData {
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

interface BlindBoxDetailProps {
  blindBoxData: BlindBoxData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBack: () => void;
  loading?: boolean;
}

const BlindBoxDetail: React.FC<BlindBoxDetailProps> = ({ 
  blindBoxData, 
  onApprove, 
  onReject, 
  onBack,
  loading = false 
}) => {
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
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            <Check className="w-3 h-3" />
            Đã duyệt
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Rare':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Epic':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Secret':
        return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRarityOrder = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 1;
      case 'Rare': return 2;
      case 'Epic': return 3;
      case 'Secret': return 4;
      default: return 0;
    }
  };

  const handleApprove = () => {
    onApprove(blindBoxData.id);
  };

  const handleReject = () => {
    onReject(blindBoxData.id);
  };

  // Sort items by rarity (Common -> Rare -> Epic -> Secret)
  const sortedItems = [...blindBoxData.items].sort((a, b) => 
    getRarityOrder(a.rarity) - getRarityOrder(b.rarity)
  );

  const totalDropRate = blindBoxData.items.reduce((sum, item) => sum + item.dropRate, 0);
  const totalItems = blindBoxData.items.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blindBoxData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy dữ liệu</h2>
          <p className="text-gray-600">Blind box không tồn tại hoặc đã bị xóa</p>
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết Blind Box</h1>
            <p className="text-gray-600">Xem thông tin chi tiết và duyệt blind box</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={blindBoxData.imageUrl}
                      alt={blindBoxData.name}
                      className="w-28 h-28 object-cover rounded-xl border-2 border-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEyIiBoZWlnaHQ9IjExMiIgdmlld0JveD0iMCAwIDExMiAxMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMTIiIGhlaWdodD0iMTEyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01NiAyOEM0MiAyOCAyOCA0MiAyOCA1NlY2NkMyOCA4MCA0MiA4NCA1NiA4NEM3MCA4NCA4NCA3MCA4NCA2NlY1NkM4NCA0MiA3MCAyOCA1NiAyOFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                      }}
                    />
                    {blindBoxData.hasSecretItem && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-1.5 rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-2xl font-bold text-gray-900">{blindBoxData.name}</h2>
                      {getStatusBadge(blindBoxData.status)}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{blindBoxData.description}</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 block">Giá bán</span>
                          <span className="font-bold text-blue-600 text-lg">{formatPrice(blindBoxData.price)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Hash className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 block">Số lượng</span>
                          <span className="font-bold text-green-600 text-lg">{blindBoxData.totalQuantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 block">Ngày tạo</span>
                          <span className="font-semibold text-gray-900">{formatDate(blindBoxData.releaseDate)}</span>
                        </div>
                      </div>
                      {blindBoxData.hasSecretItem && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 rounded-lg">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 block">Secret Item</span>
                            <span className="font-bold text-amber-600 text-lg">{blindBoxData.secretProbability}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Danh sách Items
                  </h3>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="font-medium">{totalItems}</span> items • 
                    <span className="font-medium ml-1">{totalDropRate}%</span> drop rate
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {sortedItems.map((item, index) => (
                  <div key={item.productId} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMzMCAyMCAyMCAzMCAyMCA0MFY0NUMyMCA1NSAzMCA2MCA0MCA2MEM1MCA2MCA2MCA1NSA2MCA0NVY0MEM2MCAzMCA1MCAyMCA0MCAyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                          }}
                        />
                        {item.rarity === 'Secret' && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-1 rounded-full">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{item.productName}</h4>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getRarityColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Hash className="w-4 h-4" />
                            <span className="font-medium">SL: {item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Percent className="w-4 h-4" />
                            <span className="font-medium">Drop: {item.dropRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Actions Card */}
            {blindBoxData.status === 'PendingApproval' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Thao tác
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    Duyệt Blind Box
                  </button>
                  <button
                    onClick={handleReject}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Từ chối
                  </button>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Thống kê chi tiết
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tổng items:</span>
                  <span className="font-bold text-gray-900 text-lg">{totalItems}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tổng drop rate:</span>
                  <span className="font-bold text-gray-900 text-lg">{totalDropRate}%</span>
                </div>
                <div className="space-y-3 pt-2">
                    {['Common', 'Rare', 'Epic', 'Secret'].map((rarity) => {
                        const colorMap: Record<string, { dot: string; text: string }> = {
                        Common: { dot: 'bg-gray-400', text: 'text-gray-700' },
                        Rare: { dot: 'bg-blue-500', text: 'text-blue-600' },
                        Epic: { dot: 'bg-purple-500', text: 'text-purple-600' },
                        Secret: { dot: 'bg-gradient-to-r from-amber-400 to-yellow-500', text: 'text-amber-600' },
                        };

                        const items = blindBoxData.items.filter(item => item.rarity === rarity);
                        const quantity = items.length;
                        const dropRate = items.reduce((sum, item) => sum + item.dropRate, 0);

                        return (
                        <div key={rarity} className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center gap-2">
                            <span className={`w-3 h-3 ${colorMap[rarity].dot} rounded-full`}></span>
                            {rarity}:
                            </span>
                            <span className={`font-bold ${colorMap[rarity].text}`}>
                            {dropRate.toFixed(2)}% ({quantity} item{quantity !== 1 ? 's' : ''})
                            </span>
                        </div>
                        );
                    })}
                    </div>

              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-3">Lưu ý khi duyệt</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Kiểm tra thông tin giá cả và số lượng</li>
                    <li>• Xác minh tỷ lệ drop hợp lý</li>
                    <li>• Đảm bảo tuân thủ chính sách hệ thống</li>
                    <li>• Items được sắp xếp từ Common đến Secret</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindBoxDetail;