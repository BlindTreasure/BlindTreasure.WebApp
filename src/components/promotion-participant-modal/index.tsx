import React, { useState } from 'react';
import { X, Users, Building, Phone, Mail, MapPin, Calendar, Trophy, Star } from 'lucide-react';

interface PromotionParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: API.ViewParticipantPromotion[] | null;
  isLoading: boolean;
  promotionTitle?: string;
}

const PromotionParticipantsModal: React.FC<PromotionParticipantsModalProps> = ({
  isOpen,
  onClose,
  participants,
  isLoading,
  promotionTitle
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getRandomColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-teal-100 text-teal-800'
    ];
    return colors[index % colors.length];
  };

  const displayParticipants = participants || [];

  const getCompanyInitials = (companyName: string) => {
    if (!companyName) return '?';
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Danh sách Participants
                </h2>
                {promotionTitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    Promotion: {promotionTitle}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
              type="button"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách participants...</p>
            </div>
          ) : participants && participants.length > 0 ? (
            <div className="p-6">
              {/* Stats & Controls */}
              <div className="mb-6 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className="text-sm font-medium">Tổng Participants</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{participants.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span className="text-sm font-medium">Tham gia mới nhất</span>
                    </div>
                    <p className="text-sm font-semibold mt-1">
                      {participants.length > 0 ? formatDateShort(participants[0].joinedAt || '') : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      <span className="text-sm font-medium">Hiển thị</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{displayParticipants.length}</p>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex justify-end">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Participants Display */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayParticipants.map((participant, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getRandomColor(index)}`}>
                          {getCompanyInitials(participant.companyName || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 break-words">
                            {participant.companyName || 'Không có thông tin'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {participant.joinedAt ? formatDateShort(participant.joinedAt) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 break-all">{participant.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">{participant.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-xs leading-relaxed break-words">
                            {participant.companyAddress || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayParticipants.map((participant, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getRandomColor(index)}`}>
                          {getCompanyInitials(participant.companyName || '')}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 min-w-0">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 break-words">
                              {participant.companyName || 'Không có thông tin'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {participant.joinedAt ? formatDateShort(participant.joinedAt) : 'N/A'}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600 break-all">{participant.email || 'N/A'}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600">{participant.phone || 'N/A'}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-600 break-words">{participant.companyAddress || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Chưa có participants nào</p>
              <p className="text-sm text-gray-500 mt-2">
                Promotion này chưa có ai tham gia
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {participants && participants.length > 0 && (
                <>Hiển thị {displayParticipants.length} participants</>
              )}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              type="button"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionParticipantsModal;