'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useGetLogsShipment from '../hooks/useGetLogsShipment';
import { OrderLog } from '@/services/shipment/typings';
import { Truck, CheckCircle, Copy } from 'lucide-react';
import { ShipmentStatus, ShipmentStatusText } from '@/const/products';

interface ShipmentLogsCardProps {
  shipmentId: string;
}

export default function ShipmentLogsCard({ shipmentId }: ShipmentLogsCardProps) {
  const { getLogsShipmentApi, isPending } = useGetLogsShipment();
  const [logs, setLogs] = useState<OrderLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipmentId) return;
    const fetchData = async () => {
      try {
        setError(null);
        const res = await getLogsShipmentApi(shipmentId);
        if (res?.isSuccess && res.value.data) {
          const sortedLogs = res.value.data.sort(
            (a, b) =>
              new Date(a.logTime).getTime() - new Date(b.logTime).getTime()
          );
          setLogs(sortedLogs);
        } else {
          setError('Không thể tải lịch sử giao hàng.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải lịch sử giao hàng.');
      }
    };
    fetchData();
  }, [shipmentId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shipmentId)
    } catch (err) {
    }
  }

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-6 h-6 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 text-sm">{error}</p>;
    }

    if (logs.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Chưa có lịch sử cho lần giao hàng này.
        </p>
      );
    }

    return (
      <div className="relative pl-4">
        {logs.map((log, index) => {
          const isLast = index === logs.length - 1;
          const isDelivered = [ShipmentStatus.DELIVERED, ShipmentStatus.COMPLETED].includes(
            log.newValue as ShipmentStatus
          );

          return (
            <div key={log.id} className="relative flex items-start pb-6">
              {!isLast && (
                <div className="absolute left-2.5 top-5 h-full w-0.5 bg-gray-300"></div>
              )}
              <div className="relative z-10 flex-shrink-0">
                {isLast ? (
                  isDelivered ? (
                    <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                  ) : (
                    <div className="w-5 h-5 bg-blue-500 rounded-full mt-1 ring-4 ring-blue-100 dark:ring-blue-900"></div>
                  )
                ) : (
                  <div className="w-5 h-5 bg-gray-400 rounded-full mt-1"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p
                  className={`font-medium text-sm ${isLast
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                  {log.logContent}
                </p>
                {log.oldValue && log.newValue && (
                  <p
                    className={`text-sm ${isLast
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                      }`}
                  >
                    Trạng thái:{' '}
                    <span className="font-semibold">
                      {ShipmentStatusText[log.oldValue as ShipmentStatus]}
                    </span>{' '}
                    →{' '}
                    <span className="font-semibold">
                      {ShipmentStatusText[log.newValue as ShipmentStatus]}
                    </span>
                  </p>
                )}
                <time
                  className={`text-xs ${isLast
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {new Date(log.logTime).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Lịch sử giao hàng
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{shipmentId.slice(0, 8).toUpperCase()}...</span>
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Copy mã vận chuyển"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
