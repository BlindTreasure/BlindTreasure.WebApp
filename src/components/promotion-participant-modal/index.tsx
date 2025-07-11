import React from 'react';
import { X, Users, Building, Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface PromotionParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: API.ResponseDataViewParticipantPromotion | null;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
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
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách participants...</p>
            </div>
          ) : participants?.result && participants.result.length > 0 ? (
            <div className="p-6">
              {/* Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Tổng số participants:</span> {participants.count || participants.result.length}
                </p>
              </div>

              {/* Participants Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.result.map((participant, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      {/* Company Name */}
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600">Công ty</p>
                          <p className="font-medium text-gray-900 break-words">
                            {participant.companyName || 'Không có thông tin'}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600">Số điện thoại</p>
                          <p className="font-medium text-gray-900 break-words">
                            {participant.phone || 'Không có thông tin'}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900 break-words">
                            {participant.email || 'Không có thông tin'}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600">Địa chỉ</p>
                          <p className="font-medium text-gray-900 break-words">
                            {participant.companyAddress || 'Không có thông tin'}
                          </p>
                        </div>
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-600">Tham gia lúc</p>
                          <p className="font-medium text-gray-900">
                            {participant.joinedAt ? formatDate(participant.joinedAt) : 'Không có thông tin'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Chưa có participants nào</p>
              <p className="text-sm text-gray-500 mt-2">
                Promotion này chưa có ai tham gia
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
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