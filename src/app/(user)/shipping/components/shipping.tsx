import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const statusMap = {
  confirmed: 0,
  shipped: 33,
  delivering: 66,
  delivered: 100,
};

const fakeOrder = {
  id: "3354654654526",
  date: "16/02/2025",
  estimatedDelivery: "20/02/2025",
  statusPercent: statusMap.shipped,
  items: [
    {
      name: "Blindbox Gấu Trúc May Mắn",
      image: "/images/blindbox_2.jpg",
      price: 499000,
      qty: 1,
    },
    {
      name: "Hộp Gacha Huyền Bí",
      image: "/images/blindbox_2.jpg",
      price: 299000,
      qty: 2,
    },
  ],
  paymentMethod: "Thẻ Visa •••• 1234",
  address: "174 Nguyễn Văn Linh, Quận 7, TP. HCM",
  summary: {
    subtotal: 1097000,
    discount: 200000,
    shipping: 0,
    tax: 10000,
    total: 909000,
  },
};

export default function OrderDetailPage() {
  const steps = ["Đã xác nhận", "Đã gửi hàng", "Đang giao", "Đã giao"];
  const currentStep = Math.floor(fakeOrder.statusPercent / 33);

  return (
    <div className="mt-28 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto py-6 sm:py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#252424]">Đơn hàng: #{fakeOrder.id}</h1>
            <p className="text-sm text-muted-foreground">Ngày đặt: {fakeOrder.date}</p>
            <p className="text-sm text-green-600 font-medium">
              Dự kiến giao: {fakeOrder.estimatedDelivery}
            </p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button variant="outline" className="flex-1 sm:flex-auto">Hóa đơn</Button>
            <Button className="bg-[#252424] text-white flex-1 sm:flex-auto">Theo dõi đơn hàng</Button>
          </div>
        </div>

        {/* Progress with markers */}
        <div className="relative mb-10">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-2 bg-[#d02a2a] rounded-full transition-all duration-300"
              style={{ width: `${fakeOrder.statusPercent}%` }}
            />
            {/* Marker chấm */}
            {steps.map((_, index) => {
              const isActive = index <= currentStep;
              const stepPercent = (index / (steps.length - 1)) * 100;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${stepPercent}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 z-10 ${
                      isActive ? "bg-[#d02a2a] border-[#d02a2a]" : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          {/* Đây là phần được sửa - điều chỉnh vị trí của nhãn văn bản và thêm margins */}
          <div className="flex mt-4 text-xs sm:text-sm w-full relative mb-6">
            {steps.map((step, index) => {
              const stepPercent = (index / (steps.length - 1)) * 100;
              let textAlignClass;
              let adjustedPosition;
              
              // Căn chỉnh văn bản dựa trên vị trí
              if (index === 0) {
                textAlignClass = "text-left";
                adjustedPosition = "0%";
              } else if (index === steps.length - 1) {
                textAlignClass = "text-right";
                adjustedPosition = "100%";
              } else {
                textAlignClass = "text-center";
                adjustedPosition = `${stepPercent}%`;
              }
              
              return (
                <div
                  key={index}
                  className={`absolute text-[#252424] transform -translate-x-1/2 ${textAlignClass} font-medium`}
                  style={{ 
                    width: index === 0 ? "25%" : index === steps.length - 1 ? "25%" : "50%",
                    textAlign: index === 0 ? "left" : index === steps.length - 1 ? "right" : "center",
                    transform: index === 0 ? "none" : index === steps.length - 1 ? "none" : "translateX(-50%)",
                    left: index === 0 ? "0" : index === steps.length - 1 ? "auto" : adjustedPosition,
                    right: index === steps.length - 1 ? "0" : "auto"
                  }}
                >
                  {step}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          {fakeOrder.items.map((item, idx) => (
            <Card key={idx} className="bg-white shadow-sm">
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 py-4 px-3 sm:px-4 space-y-2 sm:space-y-0">
                <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-semibold text-[#252424]">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Số lượng: {item.qty}</p>
                </div>
                <div className="text-center sm:text-right w-full sm:w-auto">
                  <p className="font-semibold text-[#252424]">
                    {(item.price * item.qty).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Thanh toán & Giao hàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2 text-[#252424]">Phương thức thanh toán</h3>
            <p className="text-sm text-[#252424]">{fakeOrder.paymentMethod}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2 text-[#252424]">Địa chỉ giao hàng</h3>
            <p className="text-sm text-[#252424]">{fakeOrder.address}</p>
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="border rounded-md p-4 mt-6 space-y-2 bg-white shadow-sm">
          <div className="flex justify-between text-sm text-[#252424]">
            <span>Tạm tính</span>
            <span>{fakeOrder.summary.subtotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá</span>
            <span>-{fakeOrder.summary.discount.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-sm text-[#252424]">
            <span>Phí vận chuyển</span>
            <span>{fakeOrder.summary.shipping.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-sm text-[#252424]">
            <span>Thuế</span>
            <span>{fakeOrder.summary.tax.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t text-[#252424]">
            <span>Tổng cộng</span>
            <span>{fakeOrder.summary.total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>

        {/* Hỗ trợ */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center sm:justify-start sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-[#d02a2a]">
          <a href="#" className="hover:underline text-center sm:text-left">Vấn đề đơn hàng</a>
          <a href="#" className="hover:underline text-center sm:text-left">Thông tin giao hàng</a>
          <a href="#" className="hover:underline text-center sm:text-left">Trả hàng</a>
        </div>
      </div>
    </div>
  );
}