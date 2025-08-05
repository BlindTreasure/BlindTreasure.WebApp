"use client";

import { useEffect, useState } from "react";
import useToast from "@/hooks/use-toast";
import { useServiceLockTradeRequest } from "@/services/trading/services"; // Adjust path

interface TradeRequestLockData {
  TradeRequestId: string;
  Message: string;
  OwnerLocked: boolean;
  RequesterLocked: boolean;
}

interface TradeRequestLockState {
  ownerLocked: boolean;
  requesterLocked: boolean;
  isCompleted: boolean;
  progress: number; // 0, 50, 100
}

export const useTradeRequestLock = (currentTradeRequestId?: string) => {
  const { addToast } = useToast();
  const lockTradeRequestMutation = useServiceLockTradeRequest();
  
  const [lockState, setLockState] = useState<TradeRequestLockState>({
    ownerLocked: false,
    requesterLocked: false,
    isCompleted: false,
    progress: 0
  });

  useEffect(() => {
    const handleTradeRequestLocked = (event: Event) => {
      const data = (event as CustomEvent<TradeRequestLockData>).detail;

      // Chỉ xử lý nếu đúng trade request hiện tại
      if (currentTradeRequestId && data.TradeRequestId !== currentTradeRequestId) {
        return;
      }

      // Cập nhật state
      const isCompleted = data.OwnerLocked && data.RequesterLocked;
      const newState: TradeRequestLockState = {
        ownerLocked: data.OwnerLocked,
        requesterLocked: data.RequesterLocked,
        isCompleted,
        progress: calculateProgress(data.OwnerLocked, data.RequesterLocked)
      };

      setLockState(newState);

      // Hiển thị notification
      if (data.Message) {
        addToast({ description: data.Message, type: "warning" });
      }

      // Nếu hoàn thành, emit event để redirect
      if (isCompleted) {
        addToast({ description: "Giao dịch hoàn thành!", type: "success" });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('trade-completed', {
            detail: { tradeRequestId: data.TradeRequestId }
          }));
        }, 2000);
      }
    };

    window.addEventListener('trade-request-locked', handleTradeRequestLocked);
    return () => window.removeEventListener('trade-request-locked', handleTradeRequestLocked);
  }, [currentTradeRequestId, addToast]);

  const calculateProgress = (ownerLocked: boolean, requesterLocked: boolean): number => {
    if (ownerLocked && requesterLocked) return 100;
    if (ownerLocked || requesterLocked) return 50;
    return 0;
  };

  // Sử dụng React Query mutation thay vì fetch thủ công
  const lockDeal = async (tradeRequestId: string): Promise<boolean> => {
    try {
      await lockTradeRequestMutation.mutateAsync(tradeRequestId);
      return true;
    } catch (error) {
      // Error đã được handle trong useServiceLockTradeRequest
      return false;
    }
  };

  return {
    lockState,
    lockDeal,
    setLockState, // Set initial state từ API
    isLocking: lockTradeRequestMutation.isPending, // Thêm loading state
    lockError: lockTradeRequestMutation.error // Thêm error state nếu cần
  };
};