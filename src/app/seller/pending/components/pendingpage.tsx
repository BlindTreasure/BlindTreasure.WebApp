'use client'
import { CheckCircle2 } from "lucide-react"; // Nếu bạn dùng lucide

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          {/* Hoặc dùng emoji: <div className="text-6xl">✅</div> */}
        </div>
        <h1 className="text-3xl font-bold text-green-600">Cảm ơn bạn!</h1>
        <p className="text-gray-700 text-base">
          Hồ sơ của bạn đã được gửi thành công và đang trong quá trình xét duyệt.
        </p>
        <p className="text-gray-500 text-sm">
          Chúng tôi sẽ gửi email thông báo khi tài khoản của bạn được phê duyệt.
        </p>
        <div className="text-sm text-gray-400 pt-4 border-t">
          Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ: <br />
          <span className="text-blue-600">support@example.com</span>
        </div>
      </div>
    </div>
  );
}
