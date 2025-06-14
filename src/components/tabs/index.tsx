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
                            Hộp đơn : Đối với box lẻ (đây là blindbox – hộp mù) ngẫu nhiên người
                            mua sẽ không xác định được bên trong là gì nhưng khi mua nhiều sản
                            phẩm trên cùng 1 đơn hàng thì sẽ không bị trùng mẫu, có tỷ lệ mở ra
                            SECRET
                        </li>
                        <li>
                            Toàn bộ hộp: Đối với nguyên set (không trùng), có tỷ lệ mở ra SECRET
                            <br />
                            <em>
                                SECRET là mẫu hiếm (mẫu ẩn được làm mờ hoặc tô đen trên hộp)
                            </em>
                        </li>
                    </ol>
                    <p className="font-semibold">→ DỊCH VỤ KHÁCH HÀNG :</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            Do các phương pháp đo khác nhau, kết quả đo sẽ có sai số từ 1-3cm,
                            thuộc phạm vi bình thường
                        </li>
                        <li>
                            Do ảnh hưởng của ánh sáng, màn hình hiển thị, máy ảnh và các yếu tố
                            khác, hình ảnh sẽ hơi khác so với vật thật. Kích thước hình ảnh chỉ
                            mang tính chất tham khảo
                        </li>
                    </ul>
                </TabsContent>

                <TabsContent value="warranty">
                    <p className="italic">Hello</p>
                </TabsContent>
            </div>
        </Tabs>
    )
}
