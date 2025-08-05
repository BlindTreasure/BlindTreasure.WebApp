'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarketplaceUI from '@/components/marketplace/marketplace';
import ProductMarketplaceDetail from '@/components/marketplace/martketplace-detail';
import MyListingDetail from '@/components/marketplace/marketplace-detail-owner';
import MyTradeRequestDetail from '@/components/marketplace/marketplace-my-trade-request';
import useGetAllListing from '../hooks/useGetAllListing';
import useGetListingById from '../hooks/useGetListingById';
import useGetAllTradeRequestByListingId from "../hooks/useGetAllTradeRequestByListingId"
import useGetAllMyTradeRequest from "../hooks/useGetAllMyTradeRequest";
import useGetTradeRequestHistory from "../hooks/useGetAllMyTradeHistory";
import { useServiceCloseListing } from '@/services/listing/services';
import { useServiceCreateTradeRequest } from '@/services/trading/services';
import { useServiceRespondTradeRequest } from '@/services/trading/services';
import { REQUEST as REQUESTLISTING, API as APILISTING } from "@/services/listing/typings";
import { ListingStatus } from "@/const/listing"

// Trading History Types
type ViewTradingHistory = {
  finalStatus?: string;
  requesterId?: string;
  listingId?: string;
  completedFromDate?: string;
  completedToDate?: string;
  createdFromDate?: string;
  createdToDate?: string;
  sortBy?: string;
  pageIndex?: number;
  pageSize?: number;
  desc?: boolean;
}

type TradingHistory = {
  id: string;
  listingId: string;
  listingItemName: string;
  listingItemImage: string;
  requesterId: string;
  requesterName: string;
  offeredItemName: string;
  offeredItemImage: string;
  finalStatus: string;
  completedAt: string;
  createdAt: string;
}

const mapApiDataToProduct = (apiItem: APILISTING.ListingItem): APILISTING.ListingItem => {
  return {
    id: apiItem.id,
    inventoryId: apiItem.inventoryId,
    productName: apiItem.productName,
    productImage: apiItem.productImage,
    isFree: apiItem.isFree,
    description: apiItem.description,
    status: apiItem.status,
    listedAt: apiItem.listedAt,
    ownerName: apiItem.ownerName
  };
};

// Map TradeRequest to ListingItem format for display in marketplace UI
const mapTradeRequestToProduct = (tradeRequest: API.TradeRequest): APILISTING.ListingItem => {
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Đang chờ phản hồi';
      case 'rejected':
        return 'Đã bị từ chối';
      case 'accepted':
      case 'in_progress':
        return 'Đang trao đổi';
      case 'locked':
        return 'Đã khóa';
      case 'completed':
        return 'Đã hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  return {
    id: tradeRequest.listingId,
    inventoryId: tradeRequest.id,
    productName: tradeRequest.listingItemName,
    productImage: tradeRequest.listingItemImgUrl,
    isFree: false,
    description: `${getStatusText(tradeRequest.status)} • ${tradeRequest.requesterName}`,
    status: tradeRequest.status,
    listedAt: tradeRequest.requestedAt,
    ownerName: tradeRequest.requesterName,
    _originalTradeRequest: tradeRequest
  } as APILISTING.ListingItem & { _originalTradeRequest: API.TradeRequest };
};

// Map history item to ListingItem format for display
const mapHistoryToProduct = (historyItem: TradingHistory): APILISTING.ListingItem => {
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Đã hết hạn';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Đã kết thúc';
    }
  };

  return {
    id: historyItem.listingId,
    inventoryId: historyItem.id,
    productName: historyItem.listingItemName,
    productImage: historyItem.listingItemImage,
    isFree: false,
    description: `${getStatusText(historyItem.finalStatus)} • ${historyItem.requesterName}`,
    status: historyItem.finalStatus,
    listedAt: historyItem.completedAt || historyItem.createdAt,
    ownerName: historyItem.requesterName,
    _originalHistoryItem: historyItem
  } as APILISTING.ListingItem & { _originalHistoryItem: TradingHistory };
};

// Map ongoing trades with slightly different description
const mapOngoingTradeToProduct = (tradeRequest: API.TradeRequest): APILISTING.ListingItem => {
  return {
    id: tradeRequest.listingId,
    inventoryId: tradeRequest.id,
    productName: tradeRequest.listingItemName,
    productImage: tradeRequest.listingItemImgUrl,
    isFree: false,
    description: `Đang trao đổi với ${tradeRequest.requesterName}`,
    status: tradeRequest.status,
    listedAt: tradeRequest.requestedAt,
    ownerName: tradeRequest.requesterName,
    _originalTradeRequest: tradeRequest
  } as APILISTING.ListingItem & { _originalTradeRequest: API.TradeRequest };
};

const mapToMyListingItem = (apiItem: APILISTING.ListingItem, tradeRequests: API.TradeRequest[] = []): any => {
  const mappedTradeRequests = tradeRequests.map(request => ({
    id: request.id,
    requesterName: request.requesterName,
    offeredItems: request.offeredItems,
    status: request.status,
    requestedAt: request.requestedAt,
    ownerLocked: request.ownerLocked,
    requesterLocked: request.requesterLocked
  }));

  return {
    id: apiItem.id,
    productName: apiItem.productName,
    productImage: apiItem.productImage,
    status: apiItem.status,
    isFree: apiItem.isFree,
    listedAt: apiItem.listedAt,
    description: apiItem.description,
    tradeRequests: mappedTradeRequests
  };
};

interface MarketplaceProps {
  customTitle?: string;
  onProductSelect?: (product: APILISTING.ListingItem) => void;
  pageSize?: number;
  initialFilters?: Partial<REQUESTLISTING.GetAllListing>;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  customTitle,
  onProductSelect,
  pageSize = 10,
  initialFilters = {}
}) => {
  const router = useRouter();
  
  const { isPending, getAllListingApi } = useGetAllListing();
  const { isPending: isDetailLoading, getListingByIdApi } = useGetListingById();
  const { isPending: isTradeRequestLoading, getAllTradeRequestByListingId } = useGetAllTradeRequestByListingId()
  const { isPending: isMyTradeRequestLoading, getAllMyTradeRequestApi } = useGetAllMyTradeRequest();
  const { isPending: isHistoryLoading, getTradeRequestHistoryApi } = useGetTradeRequestHistory();
  const { mutate: closeListingMutation, isPending: isClosingListing } = useServiceCloseListing();
  const { mutate: respondTradeRequestMutation, isPending: isRespondingTradeRequest } = useServiceRespondTradeRequest();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<string>('all');
  
  // Data states
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<APILISTING.ListingItem | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<APILISTING.ListingItem | null>(null);
  const [selectedTradeRequest, setSelectedTradeRequest] = useState<API.TradeRequest | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<TradingHistory | null>(null);
  const [tradeRequests, setTradeRequests] = useState<API.TradeRequest[]>([]);
  const [myTradeRequests, setMyTradeRequests] = useState<API.TradeRequest[]>([]);
  const [ongoingTrades, setOngoingTrades] = useState<API.TradeRequest[]>([]);
  const [tradingHistory, setTradingHistory] = useState<TradingHistory[]>([]);
  const [products, setProducts] = useState<APILISTING.ListingItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { mutate: createTradeRequestMutation, isPending: isCreatingTradeRequest } = useServiceCreateTradeRequest(
    selectedProduct?.id || ''
  );

  // Refs để tracking mount state và debounce
  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to check if product has original trade request data
  const hasOriginalTradeRequest = (product: APILISTING.ListingItem): product is APILISTING.ListingItem & { _originalTradeRequest: API.TradeRequest } => {
    return '_originalTradeRequest' in product;
  };

  // Helper function to check if product has original history data
  const hasOriginalHistoryItem = (product: APILISTING.ListingItem): product is APILISTING.ListingItem & { _originalHistoryItem: TradingHistory } => {
    return '_originalHistoryItem' in product;
  };

  // Fetch listings with cancellation support
  const fetchListings = useCallback(async (
    pageIndex: number = 1,
    searchValue?: string,
    isFreeValue?: boolean | null,
    section?: string
  ) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    const params: REQUESTLISTING.GetAllListing = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      searchByName: searchValue?.trim() || undefined,
      isFree: isFreeValue !== null ? isFreeValue : undefined,
      status: ListingStatus.Active,
      desc: true,
      ...initialFilters
    };

    if (section === 'selling') {
      params.isOwnerListings = true;
    }

    try {
      const response = await getAllListingApi(params);
      
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      if (response?.value.data) {
        const mappedProducts = response.value.data.result.map(mapApiDataToProduct);
        setProducts(mappedProducts);
        setTotalItems(response.value.data.count || mappedProducts.length);
      }
    } catch (error) {
      if (error !== 'AbortError') {
        console.error('Error fetching listings:', error);
        setProducts([]);
        setTotalItems(0);
      }
    }
  }, [pageSize, initialFilters, getAllListingApi]);

  // Function to fetch my trade requests (pending/rejected requests) - FIXED: Removed dependency
  const fetchMyTradeRequests = useCallback(async (
    searchValue?: string
  ) => {
    try {
      const response = await getAllMyTradeRequestApi();
      
      if (response?.value.data) {
        let filteredRequests = response.value.data.filter((request: API.TradeRequest) => 
          request.status.toLowerCase() === 'pending' || 
          request.status.toLowerCase() === 'rejected'
        );
        
        if (searchValue?.trim()) {
          filteredRequests = filteredRequests.filter((request: API.TradeRequest) => 
            request.listingItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.requesterName.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        setMyTradeRequests(filteredRequests);
        const mappedProducts = filteredRequests.map(mapTradeRequestToProduct);
        setProducts(mappedProducts);
        setTotalItems(mappedProducts.length);
      }
    } catch (error) {
      console.error('Error fetching my trade requests:', error);
      setMyTradeRequests([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [getAllMyTradeRequestApi]);

  // Function to fetch ongoing trades - FIXED: Removed dependency
  const fetchOngoingTrades = useCallback(async (
    searchValue?: string
  ) => {
    try {
      const response = await getAllMyTradeRequestApi();
      
      if (response?.value.data) {
        let ongoingTradesData = response.value.data.filter((request: API.TradeRequest) => 
          request.status.toLowerCase() === 'accepted' || 
          request.status.toLowerCase() === 'in_progress' || 
          request.status.toLowerCase() === 'locked'
        );
        
        if (searchValue?.trim()) {
          ongoingTradesData = ongoingTradesData.filter((request: API.TradeRequest) => 
            request.listingItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.requesterName.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        setOngoingTrades(ongoingTradesData);
        const mappedProducts = ongoingTradesData.map(mapOngoingTradeToProduct);
        setProducts(mappedProducts);
        setTotalItems(mappedProducts.length);
      }
    } catch (error) {
      console.error('Error fetching ongoing trades:', error);
      setOngoingTrades([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [getAllMyTradeRequestApi]);

  // Function to fetch trading history - FIXED: Removed unstable dependency
  const fetchTradingHistory = useCallback(async (
    searchValue?: string,
    pageIndex: number = 1
  ) => {
    try {
      const params: ViewTradingHistory = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        desc: true
      };

      const response = await getTradeRequestHistoryApi(params);
      
      if (response?.value.data) {
        let historyData = response.value.data.result || response.value.data || [];
        
        if (searchValue?.trim()) {
          historyData = historyData.filter((item: TradingHistory) => 
            item.listingItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.requesterName.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.offeredItemName.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        setTradingHistory(historyData);
        const mappedProducts = historyData.map(mapHistoryToProduct);
        setProducts(mappedProducts);
        setTotalItems(response.value.data.count || mappedProducts.length);
      }
    } catch (error) {
      console.error('Error fetching trading history:', error);
      setTradingHistory([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [pageSize]); // REMOVED: getTradeRequestHistoryApi dependency

  // Fetch product detail
  const fetchProductDetail = useCallback(async (listingId: string) => {
    try {
      const response = await getListingByIdApi(listingId);
      if (response?.value) {
        setSelectedProductDetail(response.value.data);
      }
    } catch (error) {
      console.error('Error fetching product detail:', error);
      setSelectedProductDetail(null);
    }
  }, [getListingByIdApi]);

  // Fetch trade requests
  const fetchTradeRequests = useCallback(async (listingId: string) => {
    try {
      const response = await getAllTradeRequestByListingId(listingId);
      if (response?.value?.data) {
        setTradeRequests(response.value.data);
      } else {
        setTradeRequests([]);
      }
    } catch (error) {
      console.error('Error fetching trade requests:', error);
      setTradeRequests([]);
    }
  }, [getAllTradeRequestByListingId]);

  // Load initial data - chỉ gọi 1 lần khi component mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (activeSection === 'buying') {
        fetchMyTradeRequests(searchTerm);
      } else if (activeSection === 'trading') {
        fetchOngoingTrades(searchTerm);
      } else if (activeSection === 'transaction-history') {
        fetchTradingHistory(searchTerm, 1);
      } else {
        fetchListings(1, searchTerm, isFreeFilter, activeSection);
      }
    }
  }, []); // FIXED: Empty dependency array

  // Handle section change - gọi ngay lập tức
  useEffect(() => {
    if (!isInitialMount.current) {
      setCurrentPage(1);
      if (activeSection === 'buying') {
        fetchMyTradeRequests(searchTerm);
      } else if (activeSection === 'trading') {
        fetchOngoingTrades(searchTerm);
      } else if (activeSection === 'transaction-history') {
        fetchTradingHistory(searchTerm, 1);
      } else {
        fetchListings(1, searchTerm, isFreeFilter, activeSection);
      }
    }
  }, [activeSection]); // FIXED: Only depend on activeSection

  // Handle search with debounce - delay 500ms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!isInitialMount.current) {
        setCurrentPage(1);
        if (activeSection === 'buying') {
          fetchMyTradeRequests(searchTerm);
        } else if (activeSection === 'trading') {
          fetchOngoingTrades(searchTerm);
        } else if (activeSection === 'transaction-history') {
          fetchTradingHistory(searchTerm, 1);
        } else {
          fetchListings(1, searchTerm, isFreeFilter, activeSection);
        }
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]); // FIXED: Only depend on searchTerm

  // Handle filter change - gọi ngay lập tức (only for non-buying, non-trading, and non-history sections)
  useEffect(() => {
    if (!isInitialMount.current && activeSection !== 'buying' && activeSection !== 'trading' && activeSection !== 'transaction-history') {
      setCurrentPage(1);
      fetchListings(1, searchTerm, isFreeFilter, activeSection);
    }
  }, [isFreeFilter]); // FIXED: Only depend on isFreeFilter

  // Handle product selection - FIXED: Better dependency management
  useEffect(() => {
    if (selectedProduct?.id) {
      if (activeSection === 'buying') {
        if (hasOriginalTradeRequest(selectedProduct)) {
          setSelectedTradeRequest(selectedProduct._originalTradeRequest);
        }
      } else if (activeSection === 'trading') {
        if (hasOriginalTradeRequest(selectedProduct)) {
          setSelectedTradeRequest(selectedProduct._originalTradeRequest);
        }
      } else if (activeSection === 'transaction-history') {
        if (hasOriginalHistoryItem(selectedProduct)) {
          setSelectedHistoryItem(selectedProduct._originalHistoryItem);
        }
      } else {
        fetchProductDetail(selectedProduct.id);
        
        if (activeSection === 'selling') {
          fetchTradeRequests(selectedProduct.id);
        }
      }
    } else {
      setSelectedProductDetail(null);
      setSelectedTradeRequest(null);
      setSelectedHistoryItem(null);
      setTradeRequests([]);
    }
  }, [selectedProduct?.id, activeSection]); // FIXED: Only depend on stable values

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Event handlers
  const toggleLike = useCallback((inventoryId: string) => {
    setLikedItems(prev => {
      const newLikedItems = new Set(prev);
      if (newLikedItems.has(inventoryId)) {
        newLikedItems.delete(inventoryId);
      } else {
        newLikedItems.add(inventoryId);
      }
      return newLikedItems;
    });
  }, []);

  const handleProductClick = useCallback((product: APILISTING.ListingItem) => {
    setSelectedProduct(product);
    if (onProductSelect) {
      onProductSelect(product);
    }
  }, [onProductSelect]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleIsFreeChange = useCallback((isFree: boolean | null) => {
    setIsFreeFilter(isFree);
  }, []);

  const handleNavigationChange = useCallback((section: string, params?: any) => {
    setActiveSection(section);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (activeSection === 'buying' || activeSection === 'trading') {
      // For buying and trading sections, we already have all data
    } else if (activeSection === 'transaction-history') {
      fetchTradingHistory(searchTerm, page);
    } else {
      fetchListings(page, searchTerm, isFreeFilter, activeSection);
    }
  }, [activeSection, searchTerm, isFreeFilter, fetchListings, fetchTradingHistory]);

  const handleCloseDetail = useCallback(() => {
    setSelectedProduct(null);
    setSelectedProductDetail(null);
    setSelectedTradeRequest(null);
    setSelectedHistoryItem(null);
    setTradeRequests([]);
  }, []);

  // Trade request actions
  const handleCreateTradeRequest = useCallback(async (offeredInventoryIds: string[]) => {
    if (!selectedProduct?.id) {
      console.error('No selected product for trade request');
      return;
    }

    const payload: REQUEST.OfferedInventory = {
      offeredInventoryIds: offeredInventoryIds
    };

    return new Promise<void>((resolve, reject) => {
      createTradeRequestMutation(payload, {
        onSuccess: (data : any) => {
          resolve();
        },
        onError: (error : any) => {
          console.error('Error creating trade request:', error);
          reject(error);
        }
      });
    });
  }, [selectedProduct?.id, createTradeRequestMutation]);

  const handleDeleteListing = useCallback(async (productId: string) => {
    return new Promise<void>((resolve, reject) => {
      closeListingMutation(productId, {
        onSuccess: () => {
          if (activeSection === 'buying') {
            fetchMyTradeRequests(searchTerm);
          } else if (activeSection === 'trading') {
            fetchOngoingTrades(searchTerm);
          } else if (activeSection === 'transaction-history') {
            fetchTradingHistory(searchTerm, currentPage);
          } else {
            fetchListings(currentPage, searchTerm, isFreeFilter, activeSection);
          }
          handleCloseDetail();
          resolve();
        },
        onError: (error: any) => {
          console.error('Error closing listing:', error);
          reject(error);
        }
      });
    });
  }, [closeListingMutation, currentPage, searchTerm, isFreeFilter, activeSection, fetchListings, fetchMyTradeRequests, fetchOngoingTrades, fetchTradingHistory, handleCloseDetail]);

  const handleAcceptTradeRequest = useCallback(async (requestId: string) => {
    const payload: REQUEST.AcceptTradeRequest = {
      tradeRequestId: requestId,
      isAccepted: true
    };

    return new Promise<void>((resolve, reject) => {
      respondTradeRequestMutation(payload, {
        onSuccess: (data: any) => {
          router.push(`/marketplace/confirm-trading/${requestId}`);
          if (selectedProduct?.id) {
            fetchTradeRequests(selectedProduct.id);
            fetchProductDetail(selectedProduct.id);
          }
          resolve();
        },
        onError: (error: any) => {
          console.error('Error accepting trade request:', error);
          reject(error);  
        }
      });
    });
  }, [respondTradeRequestMutation, router, selectedProduct?.id, fetchTradeRequests, fetchProductDetail]);

  const handleRejectTradeRequest = useCallback(async (requestId: string) => {
    const payload: REQUEST.AcceptTradeRequest = {
      tradeRequestId: requestId,
      isAccepted: false
    };

    return new Promise<void>((resolve, reject) => {
      respondTradeRequestMutation(payload, {
        onSuccess: (data: any) => {
          if (selectedProduct?.id) {
            fetchTradeRequests(selectedProduct.id);
            fetchProductDetail(selectedProduct.id);
          }
          resolve();
        },
        onError: (error: any) => {
          console.error('Error rejecting trade request:', error);
          reject(error);
        }
      });
    });
  }, [respondTradeRequestMutation, selectedProduct?.id, fetchTradeRequests, fetchProductDetail]);

  // Determine which section we're in
  const isSellingSection = activeSection === 'selling';
  const isBuyingSection = activeSection === 'buying';
  const isTradingSection = activeSection === 'trading';
  const isHistorySection = activeSection === 'transaction-history';

  // Determine loading state based on active section
  const currentLoading = isBuyingSection || isTradingSection ? isMyTradeRequestLoading : 
                        isHistorySection ? isHistoryLoading : isPending;

  return (
    <>
      <MarketplaceUI
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filteredProducts={products}
        likedItems={likedItems}
        onToggleLike={toggleLike}
        onProductClick={handleProductClick}
        title={customTitle || "Marketplace - Figure & Blind Box"}
        searchPlaceholder="Tìm kiếm figure, blind box..."
        isLoading={currentLoading}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        isFreeFilter={(isBuyingSection || isTradingSection || isHistorySection) ? null : isFreeFilter}
        onIsFreeChange={(isBuyingSection || isTradingSection || isHistorySection) ? undefined : handleIsFreeChange}
        activeSection={activeSection}
        onNavigationChange={handleNavigationChange}
      />

      {/* Regular product detail */}
      {selectedProduct && !isSellingSection && !isBuyingSection && !isTradingSection && !isHistorySection && (
        <ProductMarketplaceDetail
          product={selectedProductDetail || selectedProduct}
          onClose={handleCloseDetail}
          isLiked={likedItems.has(selectedProduct.inventoryId)}
          onToggleLike={() => toggleLike(selectedProduct.inventoryId)}
          isLoading={isDetailLoading}
          onCreateTradeRequest={handleCreateTradeRequest}
          isCreatingTradeRequest={isCreatingTradeRequest}
        />
      )}

      {/* My listing detail */}
      {selectedProduct && isSellingSection && (
        <MyListingDetail
          product={mapToMyListingItem(selectedProductDetail || selectedProduct, tradeRequests)}
          onClose={handleCloseDetail}
          isLoading={isDetailLoading || isTradeRequestLoading || isClosingListing}
          onDeleteListing={handleDeleteListing}
          onAcceptTradeRequest={handleAcceptTradeRequest}
          onRejectTradeRequest={handleRejectTradeRequest}
          isAcceptingTradeRequest={isRespondingTradeRequest}
          isRejectingTradeRequest={isRespondingTradeRequest}
        />
      )}

      {/* My trade request detail (for buying section) */}
      {selectedProduct && isBuyingSection && selectedTradeRequest && (
        <MyTradeRequestDetail
          tradeRequest={selectedTradeRequest}
          onClose={handleCloseDetail}
          isLoading={isMyTradeRequestLoading}
          isHistoryView={false}
        />
      )}

      {/* Ongoing trade detail (for trading section) */}
      {selectedProduct && isTradingSection && selectedTradeRequest && (
        <MyTradeRequestDetail
          tradeRequest={selectedTradeRequest}
          onClose={handleCloseDetail}
          isLoading={isMyTradeRequestLoading}
          isHistoryView={false}
        />
      )}

      {/* Trading history detail (for history section) */}
      {selectedProduct && isHistorySection && selectedHistoryItem && (
        <MyTradeRequestDetail
          tradeRequest={{
            id: selectedHistoryItem.id,
            listingId: selectedHistoryItem.listingId,
            listingItemName: selectedHistoryItem.listingItemName,
            listingItemTier: '', // Not available in TradingHistory
            listingItemImgUrl: selectedHistoryItem.listingItemImage,
            listingOwnerName: '', // Not available in TradingHistory  
            listingOwnerAvatarUrl: '',
            requesterId: selectedHistoryItem.requesterId,
            requesterName: selectedHistoryItem.requesterName,
            requesterAvatarUrl: '',
            offeredItems: [
              {
                inventoryItemId: selectedHistoryItem.id,
                itemName: selectedHistoryItem.offeredItemName,
                imageUrl: selectedHistoryItem.offeredItemImage,
                tier: ''
              }
            ],
            status: selectedHistoryItem.finalStatus,
            requestedAt: selectedHistoryItem.createdAt,
            timeRemaining: undefined,
            ownerLocked: false,
            requesterLocked: false
          }}
          onClose={handleCloseDetail}
          isLoading={isHistoryLoading}
          isHistoryView={true}
        />
      )}
    </>
  );
};

export default Marketplace;