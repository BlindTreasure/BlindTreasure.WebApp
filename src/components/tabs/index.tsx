import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

type ProductTabsProps = {
    description: string;
};


export function ProductTabs({ description }: ProductTabsProps) {
    return (
        <Tabs defaultValue="description" className="relative">
            <TabsList className="grid max-w-[400px] grid-cols-2 h-14">
                <TabsTrigger
                    value="description"
                    className="data-[state=active]:bg-black data-[state=active]:text-white h-12"
                >
                    MÔ TẢ SẢN PHẨM
                </TabsTrigger>
                <TabsTrigger
                    value="warranty"
                    className="data-[state=active]:bg-black data-[state=active]:text-white h-12"
                >
                    CHÍNH SÁCH BẢO HÀNH
                </TabsTrigger>
            </TabsList>

            <div className="mt-2 max-w-[1000px] border border-gray-300 p-4 rounded-md text-sm leading-relaxed">
                <TabsContent value="description" className="space-y-3">
                    {description && (
                        <>
                            <p className="font-semibold">→ MÔ TẢ SẢN PHẨM :</p>
                            <p className="whitespace-pre-line">{description}</p>
                        </>
                    )}

                    <p className="font-semibold">→ THÔNG TIN CHI TIẾT :</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>
                            Hộp đơn: Đây là <strong>blindbox (hộp mù)</strong>, bên trong hoàn toàn ngẫu nhiên –
                            người mua sẽ không biết trước mẫu nào.
                        </li>
                        <li>
                            Khi mua nhiều sản phẩm trên cùng 1 đơn hàng, hệ thống sẽ hạn chế tối đa việc trùng mẫu.
                        </li>
                        <li>
                            Mỗi đơn hàng đều có <strong>tỷ lệ mở ra SECRET</strong> – là mẫu hiếm được thể hiện mờ hoặc
                            tô đen trên bao bì.
                        </li>
                    </ol>

                    <p className="font-semibold">→ DỊCH VỤ KHÁCH HÀNG :</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            Do phương pháp đo thủ công khác nhau, kết quả có thể sai số 1–3cm (trong phạm vi bình thường).
                        </li>
                        <li>
                            Hình ảnh sản phẩm có thể khác nhẹ so với thực tế do ánh sáng, màn hình hiển thị và góc chụp.
                        </li>
                        <li>
                            Kích thước và màu sắc chỉ mang tính tham khảo, vui lòng cân nhắc trước khi mua.
                        </li>
                    </ul>
                </TabsContent>

                <TabsContent value="warranty" className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <div>
                        <h3 className="font-semibold text-red-600 mb-2">🛍️ Sản phẩm thường</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Bảo hành kỹ thuật trong vòng <strong>3 ngày</strong> kể từ ngày nhận hàng.</li>
                            <li>Đổi sản phẩm mới cùng loại nếu phát sinh lỗi do nhà sản xuất (không hoàn tiền).</li>
                            <li>Không áp dụng bảo hành khi: sản phẩm hư hỏng do rơi vỡ, va chạm, nước, hóa chất, hoặc tự ý sửa chữa.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-red-600 mb-2">🎁 Blindbox</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Không áp dụng đổi trả nếu không hài lòng với nhân vật/mẫu ngẫu nhiên nhận được.</li>
                            <li>Chỉ hỗ trợ đổi trong trường hợp sản phẩm lỗi do sản xuất hoặc hư hỏng trong quá trình vận chuyển.</li>
                            <li>Hộp blindbox có thể móp nhẹ trong vận chuyển nhưng sản phẩm bên trong không ảnh hưởng thì không áp dụng đổi.</li>
                            <li>Nếu lỗi nặng, khách hàng được đổi 1 blindbox khác cùng series (ngẫu nhiên, không chọn mẫu).</li>
                        </ul>
                    </div>

                    <p className="italic text-gray-500">
                        Lưu ý: Shop không áp dụng hoàn tiền dưới bất kỳ hình thức nào.
                    </p>
                </TabsContent>
            </div>
        </Tabs>
    )
}
