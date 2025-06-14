'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BlindBoxDetailContent, { BlindBoxData } from '@/components/staff-blindbox-detail';
import useGetBlindboxById from '../hooks/useGetBlindboxById';
import useReviewBlindbox from '../../blindbox-management/hooks/useReviewBlindbox';

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

const BlindBoxDetailView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isPending, getBlindboxByIdApi } = useGetBlindboxById();
  const { onReview, isPending: isReviewPending } = useReviewBlindbox();
  
  const [blindBoxData, setBlindBoxData] = useState<BlindBoxData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reject Modal state
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    boxName: string;
  }>({
    isOpen: false,
    boxName: ''
  });

  const blindboxId = params?.id as string;

  const fetchBlindBoxData = async () => {
    if (!blindboxId) {
      setError('Blind box ID not found');
      return;
    }

    try {
      const response = await getBlindboxByIdApi(blindboxId);
      if (response?.value.data) {
        // Map API response to component expected format
        const mappedData: BlindBoxData = {
          id: response.value.data.id,
          name: response.value.data.name,
          description: response.value.data.description,
          price: response.value.data.price,
          totalQuantity: response.value.data.totalQuantity,
          imageUrl: response.value.data.imageUrl,
          releaseDate: response.value.data.releaseDate,
          status: response.value.data.status,
          hasSecretItem: response.value.data.hasSecretItem,
          secretProbability: response.value.data.secretProbability,
          items: response.value.data.items || [],
          // Add reject reason if available
          rejectReason: response.value.data.rejectReason || undefined
        };
        setBlindBoxData(mappedData);
      } else {
        setError('Failed to load blind box data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching blind box:', err);
    }
  };

  useEffect(() => {
    fetchBlindBoxData();
  }, [blindboxId]);

  const handleApprove = async () => {
    if (!blindboxId) return;
    
    onReview(
      {
        blindboxesId: blindboxId,
        reviewData: { approve: true }
      },
      () => {
        // Refresh data sau khi approve thành công
        fetchBlindBoxData();
      }
    );
  };

  const handleReject = async () => {
    if (!blindBoxData) return;
    
    setRejectModal({
      isOpen: true,
      boxName: blindBoxData.name
    });
  };

  const handleConfirmReject = (reason: string) => {
    if (!blindboxId) return;
    
    onReview(
      {
        blindboxesId: blindboxId,
        reviewData: { 
          approve: false, 
          rejectReason: reason 
        }
      },
      () => {
        // Close modal và refresh data
        setRejectModal({ isOpen: false, boxName: '' });
        fetchBlindBoxData();
      }
    );
  };

  const handleCloseRejectModal = () => {
    if (!isReviewPending) {
      setRejectModal({ isOpen: false, boxName: '' });
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blind box details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blindBoxData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No blind box data found</p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nội dung chi tiết */}
      <BlindBoxDetailContent
        blindBoxData={blindBoxData}
        onApprove={handleApprove}
        onReject={handleReject}
        onBack={handleBack}
        isReviewPending={isReviewPending}
      />
      
      {/* Reject Modal */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        onClose={handleCloseRejectModal}
        onConfirm={handleConfirmReject}
        boxName={rejectModal.boxName}
        isPending={isReviewPending}
      />
    </div>
  );
};

export default BlindBoxDetailView;