import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { FaTag, FaDollarSign, FaGift, FaExchangeAlt } from "react-icons/fa";
export function SpotlightPreview() {
    const reasons = [
        {
            icon: <FaTag className="text-4xl text-yellow-500 mb-4" />,
            title: "Sản phẩm độc đáo",
            description: "Khám phá các sản phẩm chưa từng có, mang lại trải nghiệm mới mẻ."
        },
        {
            icon: <FaDollarSign className="text-4xl text-green-500 mb-4" />,
            title: "Giá trị vượt trội",
            description: "Nhận được giá trị vượt trội với mỗi túi mù, tuyệt vời hơn cả mong đợi."
        },
        {
            icon: <FaGift className="text-4xl text-pink-500 mb-4" />,
            title: "Niềm vui bất ngờ",
            description: "Mỗi chiếc túi mù là một món quà đầy bất ngờ, mang lại niềm vui khám phá."
        },
        {
            icon: <FaExchangeAlt className="text-4xl text-blue-500 mb-4" />,
            title: "Chính sách linh hoạt",
            description: "Đổi trả dễ dàng, bảo vệ quyền lợi của bạn khi mua sắm tại chúng tôi."
        }
    ];

    return (
        <div className="relative flex h-[40rem] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
            <div
                className={cn(
                    "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
                    "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
                )}
            />

            <Spotlight
                className="-top-40 left-0 md:-top-20 md:left-60"
                fill="white"
            />
            <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
                <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
                    Tại sao nên chọn túi mù của chúng tôi?
                </h1>
                <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
                    Chúng tôi mang đến sự bất ngờ và niềm vui trong từng chiếc túi mù, giúp bạn khám phá những món đồ tuyệt vời mà bạn không thể tìm thấy ở đâu khác.
                </p>
                <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                    {reasons.map((reason, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            {reason.icon}
                            <h3 className="text-lg font-semibold text-white">{reason.title}</h3>
                            <p className="text-sm text-neutral-300">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
