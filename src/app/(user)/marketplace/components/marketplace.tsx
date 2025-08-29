'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarketplaceUI from '@/components/marketplace/marketplace';
import ProductMarketplaceDetail from '@/components/marketplace/martketplace-detail';
import MyListingDetail from '@/components/marketplace/marketplace-detail-owner';
import MyTradeRequestDetail from '@/components/marketplace/marketplace-my-trade-request';
import MarketplaceGuideDialog from '@/components/marketplace/marketplace-guide-dialog';
import CustomerSellerChat from '@/components/chat-widget';
import useGetAllListing from '../hooks/useGetAllListing';
import useGetListingById from '../hooks/useGetListingById';
import useGetAllTradeRequestByListingId from "../hooks/useGetAllTradeRequestByListingId"
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
    ownerId: apiItem.ownerId,
    ownerName: apiItem.ownerName
  };
};

// Map TradeRequest to ListingItem format for display in marketplace UI
const mapTradeRequestToProduct = (tradeRequest: API.TradingHistory): APILISTING.ListingItem => {
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
    productImage: tradeRequest.listingItemImage,
    isFree: false,
    description: `${getStatusText(tradeRequest.finalStatus)} • ${tradeRequest.requesterName}`,
    status: tradeRequest.finalStatus,
    listedAt: tradeRequest.createdAt,
    ownerName: tradeRequest.requesterName,
    _originalTradeRequest: tradeRequest
  } as APILISTING.ListingItem & { _originalTradeRequest: API.TradingHistory };
};

// Map history item to ListingItem format for display
const mapHistoryToProduct = (historyItem: API.TradingHistory): APILISTING.ListingItem => {
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
  } as APILISTING.ListingItem & { _originalHistoryItem: API.TradingHistory };
};

// Map ongoing trades with slightly different description
const mapOngoingTradeToProduct = (tradeRequest: API.TradingHistory): APILISTING.ListingItem => {
  return {
    id: tradeRequest.listingId,
    inventoryId: tradeRequest.id,
    productName: tradeRequest.listingItemName,
    productImage: tradeRequest.listingItemImage,
    isFree: false,
    description: `Đang trao đổi với ${tradeRequest.requesterName}`,
    status: tradeRequest.finalStatus,
    listedAt: tradeRequest.createdAt,
    ownerName: tradeRequest.requesterName,
    _originalTradeRequest: tradeRequest
  } as APILISTING.ListingItem & { _originalTradeRequest: API.TradingHistory };
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
  const { isPending: isHistoryLoading, getTradeRequestHistoryApi } = useGetTradeRequestHistory();
  const { mutate: closeListingMutation, isPending: isClosingListing } = useServiceCloseListing();
  const { mutate: respondTradeRequestMutation, isPending: isRespondingTradeRequest } = useServiceRespondTradeRequest();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Data states
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<APILISTING.ListingItem | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<APILISTING.ListingItem | null>(null);
  const [selectedTradeRequest, setSelectedTradeRequest] = useState<API.TradingHistory | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<API.TradingHistory | null>(null);
  const [tradeRequests, setTradeRequests] = useState<API.TradeRequest[]>([]);
  const [myTradeRequests, setMyTradeRequests] = useState<API.TradingHistory[]>([]);
  const [ongoingTrades, setOngoingTrades] = useState<API.TradingHistory[]>([]);
  const [tradingHistory, setTradingHistory] = useState<API.TradingHistory[]>([]);
  const [products, setProducts] = useState<APILISTING.ListingItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGuideDialogOpen, setIsGuideDialogOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatTargetUserId, setChatTargetUserId] = useState<string>('');

  const { mutate: createTradeRequestMutation, isPending: isCreatingTradeRequest } = useServiceCreateTradeRequest(
    selectedProduct?.id || ''
  );

  // Refs để tracking mount state và debounce
  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to check if product has original trade request data
  const hasOriginalTradeRequest = (product: APILISTING.ListingItem): product is APILISTING.ListingItem & { _originalTradeRequest: API.TradingHistory } => {
    return '_originalTradeRequest' in product;
  };

  // Helper function to check if product has original history data
  const hasOriginalHistoryItem = (product: APILISTING.ListingItem): product is APILISTING.ListingItem & { _originalHistoryItem: API.TradingHistory } => {
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
        setProducts([]);
        setTotalItems(0);
      }
    }
  }, [pageSize, initialFilters, getAllListingApi]);

  // Function to fetch my trade requests (pending/rejected requests)
  const fetchMyTradeRequests = useCallback(async (
    searchValue?: string,
    pageIndex: number = 1
  ) => {
    try {
      const params: ViewTradingHistory = {
        finalStatus: 'PENDING', // Chỉ lấy các request đang pending
        pageIndex: pageIndex,
        pageSize: pageSize,
        desc: true
      };

      const response = await getTradeRequestHistoryApi(params);
      
      if (response?.value.data) {
        let filteredRequests = response.value.data.result || response.value.data || [];
        
        if (searchValue?.trim()) {
          filteredRequests = filteredRequests.filter((request: API.TradingHistory) => 
            request.listingItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.requesterName.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        setMyTradeRequests(filteredRequests);
        const mappedProducts = filteredRequests.map(mapTradeRequestToProduct);
        setProducts(mappedProducts);
        setTotalItems(response.value.data.count || mappedProducts.length);
      }
    } catch (error) {
      setMyTradeRequests([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [pageSize, getTradeRequestHistoryApi]);

  // Function to fetch ongoing trades
  const fetchOngoingTrades = useCallback(async (
    searchValue?: string,
    pageIndex: number = 1
  ) => {
    try {
      const params: ViewTradingHistory = {
        finalStatus: 'IN_PROGRESS', // Hoặc status nào đó cho ongoing trades
        pageIndex: pageIndex,
        pageSize: pageSize,
        desc: true
      };

      const response = await getTradeRequestHistoryApi(params);
      
      if (response?.value.data) {
        let ongoingTradesData = response.value.data.result || response.value.data || [];
        
        if (searchValue?.trim()) {
          ongoingTradesData = ongoingTradesData.filter((request: API.TradingHistory) => 
            request.listingItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
            request.requesterName.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        
        setOngoingTrades(ongoingTradesData);
        const mappedProducts = ongoingTradesData.map(mapOngoingTradeToProduct);
        setProducts(mappedProducts);
        setTotalItems(response.value.data.count || mappedProducts.length);
      }
    } catch (error) {
      setOngoingTrades([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [pageSize, getTradeRequestHistoryApi]);

  // Function to fetch trading history
  const fetchTradingHistory = useCallback(async (
    searchValue?: string,
    pageIndex: number = 1
  ) => {
    try {
      const params: ViewTradingHistory = {
        finalStatus: 'COMPLETED', // Chỉ lấy các giao dịch đã hoàn thành
        pageIndex: pageIndex,
        pageSize: pageSize,
        desc: true
      };

      const response = await getTradeRequestHistoryApi(params);
      
      if (response?.value.data) {
        let historyData = response.value.data.result || response.value.data || [];
        
        if (searchValue?.trim()) {
          historyData = historyData.filter((item: API.TradingHistory) => 
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
      setTradingHistory([]);
      setProducts([]);
      setTotalItems(0);
    }
  }, [pageSize, getTradeRequestHistoryApi]);

  // Fetch product detail
  const fetchProductDetail = useCallback(async (listingId: string) => {
    try {
      const response = await getListingByIdApi(listingId);
      if (response?.value) {
        setSelectedProductDetail(response.value.data);
      }
    } catch (error) {
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
      setTradeRequests([]);
    }
  }, [getAllTradeRequestByListingId]);

  // Load initial data - chỉ gọi 1 lần khi component mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (activeSection === 'buying') {
        fetchMyTradeRequests(searchTerm, 1);
      } else if (activeSection === 'trading') {
        fetchOngoingTrades(searchTerm, 1);
      } else if (activeSection === 'transaction-history') {
        fetchTradingHistory(searchTerm, 1);
      } else {
        fetchListings(1, searchTerm, isFreeFilter, activeSection);
      }
    }
  }, []);

  // Handle section change - gọi ngay lập tức
  useEffect(() => {
    if (!isInitialMount.current) {
      setCurrentPage(1);
      if (activeSection === 'buying') {
        fetchMyTradeRequests(searchTerm, 1);
      } else if (activeSection === 'trading') {
        fetchOngoingTrades(searchTerm, 1);
      } else if (activeSection === 'transaction-history') {
        fetchTradingHistory(searchTerm, 1);
      } else {
        fetchListings(1, searchTerm, isFreeFilter, activeSection);
      }
    }
  }, [activeSection]);

  // Handle search with debounce - delay 500ms
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!isInitialMount.current) {
        setCurrentPage(1);
        if (activeSection === 'buying') {
          fetchMyTradeRequests(searchTerm, 1);
        } else if (activeSection === 'trading') {
          fetchOngoingTrades(searchTerm, 1);
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
  }, [searchTerm]);

  // Handle filter change - gọi ngay lập tức (only for non-buying, non-trading, and non-history sections)
  useEffect(() => {
    if (!isInitialMount.current && activeSection !== 'buying' && activeSection !== 'trading' && activeSection !== 'transaction-history') {
      setCurrentPage(1);
      fetchListings(1, searchTerm, isFreeFilter, activeSection);
    }
  }, [isFreeFilter]);

  // Handle product selection
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
  }, [selectedProduct?.id, activeSection]);

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
    if (activeSection === 'buying') {
      fetchMyTradeRequests(searchTerm, page);
    } else if (activeSection === 'trading') {
      fetchOngoingTrades(searchTerm, page);
    } else if (activeSection === 'transaction-history') {
      fetchTradingHistory(searchTerm, page);
    } else {
      fetchListings(page, searchTerm, isFreeFilter, activeSection);
    }
  }, [activeSection, searchTerm, isFreeFilter, fetchListings, fetchMyTradeRequests, fetchOngoingTrades, fetchTradingHistory]);

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
            fetchMyTradeRequests(searchTerm, currentPage);
          } else if (activeSection === 'trading') {
            fetchOngoingTrades(searchTerm, currentPage);
          } else if (activeSection === 'transaction-history') {
            fetchTradingHistory(searchTerm, currentPage);
          } else {
            fetchListings(currentPage, searchTerm, isFreeFilter, activeSection);
          }
          handleCloseDetail();
          resolve();
        },
        onError: (error: any) => {
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
          reject(error);
        }
      });
    });
  }, [respondTradeRequestMutation, selectedProduct?.id, fetchTradeRequests, fetchProductDetail]);

    const handleRefresh = useCallback(async () => {
      setIsRefreshing(true);
      try {
        setCurrentPage(1);
        if (activeSection === 'buying') {
          await fetchMyTradeRequests(searchTerm, 1);
        } else if (activeSection === 'trading') {
          await fetchOngoingTrades(searchTerm, 1);
        } else if (activeSection === 'transaction-history') {
          await fetchTradingHistory(searchTerm, 1);
        } else {
          await fetchListings(1, searchTerm, isFreeFilter, activeSection);
        }
      } catch (error) {
      } finally {
        setIsRefreshing(false);
      }
    }, [activeSection, searchTerm, isFreeFilter, fetchListings, fetchMyTradeRequests, fetchOngoingTrades, fetchTradingHistory]);

  // Handle opening the guide dialog
  const handleOpenGuideDialog = useCallback(() => {
    setIsGuideDialogOpen(true);
  }, []);

  const handleOpenChat = useCallback((targetUserId: string) => {
  setChatTargetUserId(targetUserId);
  setShowChat(true);
}, []);

  // Determine which section we're in
  const isSellingSection = activeSection === 'selling';
  const isBuyingSection = activeSection === 'buying';
  const isTradingSection = activeSection === 'trading';
  const isHistorySection = activeSection === 'transaction-history';

  // Determine loading state based on active section
  const currentLoading = isPending || isHistoryLoading;

  return (
    <>
      <div className="relative">
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
          onOpenGuideDialog={handleOpenGuideDialog}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Marketplace Guide Dialog */}
      <MarketplaceGuideDialog
        open={isGuideDialogOpen}
        onOpenChange={setIsGuideDialogOpen}
        forceShow={isGuideDialogOpen} // Force show when opened via button
      />

      {/* Regular product detail */}
      {selectedProduct && !isSellingSection && !isBuyingSection && !isTradingSection && !isHistorySection && (
        <ProductMarketplaceDetail
          product={selectedProduct}
          onClose={handleCloseDetail}
          isLiked={likedItems.has(selectedProduct.inventoryId)}
          onToggleLike={() => toggleLike(selectedProduct.inventoryId)}
          isLoading={isDetailLoading}
          onCreateTradeRequest={handleCreateTradeRequest}
          isCreatingTradeRequest={isCreatingTradeRequest}
          onOpenChat={handleOpenChat}
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
          tradeRequest={{
            id: selectedTradeRequest.id,
            listingId: selectedTradeRequest.listingId,
            listingItemName: selectedTradeRequest.listingItemName,
            listingItemTier: '',
            listingItemImgUrl: selectedTradeRequest.listingItemImage,
            listingOwnerName: '',
            listingOwnerAvatarUrl: '',
            requesterId: selectedTradeRequest.requesterId,
            requesterName: selectedTradeRequest.requesterName,
            requesterAvatarUrl: '',
            offeredItems: [
              {
                inventoryItemId: selectedTradeRequest.id,
                itemName: selectedTradeRequest.offeredItemName,
                imageUrl: selectedTradeRequest.offeredItemImage,
                tier: ''
              }
            ],
            status: selectedTradeRequest.finalStatus,
            requestedAt: selectedTradeRequest.createdAt,
            timeRemaining: undefined,
            ownerLocked: false,
            requesterLocked: false
          }}
          onClose={handleCloseDetail}
          isLoading={isHistoryLoading}
          isHistoryView={false}
        />
      )}

      {/* Ongoing trade detail (for trading section) */}
      {selectedProduct && isTradingSection && selectedTradeRequest && (
        <MyTradeRequestDetail
          tradeRequest={{
            id: selectedTradeRequest.id,
            listingId: selectedTradeRequest.listingId,
            listingItemName: selectedTradeRequest.listingItemName,
            listingItemTier: '',
            listingItemImgUrl: selectedTradeRequest.listingItemImage,
            listingOwnerName: '',
            listingOwnerAvatarUrl: '',
            requesterId: selectedTradeRequest.requesterId,
            requesterName: selectedTradeRequest.requesterName,
            requesterAvatarUrl: '',
            offeredItems: [
              {
                inventoryItemId: selectedTradeRequest.id,
                itemName: selectedTradeRequest.offeredItemName,
                imageUrl: selectedTradeRequest.offeredItemImage,
                tier: ''
              }
            ],
            status: selectedTradeRequest.finalStatus,
            requestedAt: selectedTradeRequest.createdAt,
            timeRemaining: undefined,
            ownerLocked: false,
            requesterLocked: false
          }}
          onClose={handleCloseDetail}
          isLoading={isHistoryLoading}
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
            listingItemTier: '',
            listingItemImgUrl: selectedHistoryItem.listingItemImage,
            listingOwnerName: '',
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
      {/* Chat Component - quản lý bởi Marketplace */}
      {showChat && (
        <CustomerSellerChat 
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          targetUserId={chatTargetUserId}
        />
      )}
    </>
  );
};

export default Marketplace;