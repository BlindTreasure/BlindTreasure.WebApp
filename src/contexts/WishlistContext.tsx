'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useGetWishlist from '@/app/(user)/wishlist/hooks/useGetWishlist';
import { WishlistItem } from '@/services/customer-favourite/typings';

interface WishlistStatus {
  [key: string]: {
    isInWishlist: boolean;
    wishlistId: string;
  };
}

interface WishlistContextType {
  wishlistStatus: WishlistStatus;
  isLoading: boolean;
  getItemWishlistStatus: (itemId: string) => {
    isInWishlist: boolean;
    wishlistId: string | undefined;
  };
  updateWishlistStatus: (itemId: string, isInWishlist: boolean, wishlistId?: string) => void;
  refreshWishlistStatus: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getWishlistApi } = useGetWishlist();
  const [wishlistStatus, setWishlistStatus] = useState<WishlistStatus>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllWishlistItems = async () => {
    setIsLoading(true);
    try {
      let allItems: WishlistItem[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const result = await getWishlistApi({
          pageIndex: currentPage,
          pageSize: 50,
        });

        if (result && result.value.data.result.length > 0) {
          allItems = [...allItems, ...result.value.data.result];
          hasMorePages = currentPage < result.value.data.totalPages;
          currentPage++;
        } else {
          hasMorePages = false;
        }
      }

      const statusMap: WishlistStatus = {};
      allItems.forEach((item) => {
        const itemId = item.type === 'Product' ? item.productId : item.blindBoxId;
        if (itemId) {
          statusMap[itemId] = {
            isInWishlist: true,
            wishlistId: item.id,
          };
        }
      });

      setWishlistStatus(statusMap);
    } catch (error) {
      console.error('Error fetching wishlist status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWishlistItems();
  }, []);

  const getItemWishlistStatus = (itemId: string) => {
    return wishlistStatus[itemId] || {
      isInWishlist: false,
      wishlistId: undefined,
    };
  };

  const updateWishlistStatus = (itemId: string, isInWishlist: boolean, wishlistId?: string) => {
    setWishlistStatus(prev => {
      const newStatus = { ...prev };
      if (isInWishlist && wishlistId) {
        newStatus[itemId] = {
          isInWishlist: true,
          wishlistId,
        };
      } else {
        delete newStatus[itemId];
      }
      return newStatus;
    });
  };

  const refreshWishlistStatus = () => {
    fetchAllWishlistItems();
  };

  const value: WishlistContextType = {
    wishlistStatus,
    isLoading,
    getItemWishlistStatus,
    updateWishlistStatus,
    refreshWishlistStatus,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};
