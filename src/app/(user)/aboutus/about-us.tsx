'use client'
import React from 'react'
import { motion } from "framer-motion";
import { fadeIn } from '@/utils/variants';
export default function AboutUs() {
    const commitments = [
        {
            title: "Chất lượng đảm bảo",
            image: "images/blindbox1.webp",
            description: "Sản phẩm chất lượng cao, nguồn gốc rõ ràng, đảm bảo hài lòng"
        },
        {
            title: "Trải nghiệm dễ thương",
            image: "images/blindbox_2.jpg",
            description: "Thiết kế bao bì xinh xắn, mở hộp đầy cảm xúc"
        },
        {
            title: "Uy tín – tận tâm",
            image: "images/blindbox_3.jpg",
            description: "Đặt khách hàng làm trung tâm, hỗ trợ 24/7"
        },
        {
            title: "Niềm vui bất ngờ",
            image: "images/blindbox_4.webp",
            description: "Mỗi món quà là một trải nghiệm đáng nhớ"
        },
    ];

    return (
        <div>
            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.7 }}
                className='pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mt-28'>
                <h1 className='text-4xl md:text-5xl font-bold text-[#d02a2a] mb-6'>
                    Về chúng tôi
                </h1>
                <div className='max-w-4xl mx-auto'>
                    <p className='text-xl md:text-2xl text-gray-700 leading-relaxed'>
                        Chào mừng bạn đến với BlindTreasure – nơi hội tụ của bất ngờ, cảm xúc và những món quà đáng yêu!
                    </p>
                    <p className='mt-4 text-lg text-gray-600'>
                        Chúng tôi là nền tảng mua sắm kết hợp giữa túi mù bí ẩn và sản phẩm khác. Dù bạn yêu sự hồi hộp hay thích chọn lựa kỹ càng, BlindTreasure luôn có điều dành riêng cho bạn.
                    </p>
                </div>
            </motion.div>

            <div className="w-full py-16 bg-white">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeIn("right", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="order-2 md:order-1">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Sứ mệnh của chúng tôi
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Mang đến niềm vui mỗi ngày thông qua các sản phẩm chất lượng, đóng gói tinh tế – từ những món quà bất ngờ trong túi mù đến các mặt hàng được chọn lựa thủ công, đầy cảm hứng.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-[#d02a2a]">100%</h3>
                                <p className="text-sm text-gray-600">Chất lượng đảm bảo</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-[#d02a2a]">500+</h3>
                                <p className="text-sm text-gray-600">Khách hàng hài lòng</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        variants={fadeIn("left", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="order-1 md:order-2">
                        <img
                            src="https://readymadeui.com/team-image.webp"
                            alt="Team"
                            className="w-full h-auto object-cover rounded-xl shadow-lg"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="relative bg-gray-900 min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://readymadeui.com/cardImg.webp"
                        alt="Banner"
                        className="w-full h-full object-cover opacity-70"
                    />
                </div>
                <motion.div
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.7 }}
                    className="relative z-10 max-w-4xl mx-auto text-center px-6 py-12">
                    <h2 className="text-white text-3xl sm:text-4xl font-bold mb-6">
                        Vui từ điều chưa biết trước
                    </h2>
                    <p className="text-lg text-slate-200 leading-relaxed">
                        Niềm vui không phải lúc nào cũng cần được biết trước. Đôi khi, nó đến từ sự bất ngờ dịu dàng mà chúng tôi mang đến cho bạn qua từng sản phẩm.
                    </p>
                </motion.div>
            </div>

            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={fadeIn("up", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cam kết của chúng tôi</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Dù bạn chọn sự bất ngờ hay an tâm khi biết trước, chúng tôi luôn cam kết mang đến trải nghiệm tốt nhất
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeIn("up", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {commitments.map((item, index) => (
                            <div key={index} className="group bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                                <div className="overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="py-16 bg-gray-100">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Sẵn sàng trải nghiệm?</h2>
                    <motion.p
                        variants={fadeIn("up", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="text-lg text-gray-600 mb-8">
                        Hãy để BlindTreasure mang đến cho bạn những bất ngờ thú vị và những món quà đáng yêu nhất!
                    </motion.p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.button
                            variants={fadeIn("right", 0.3)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.7 }}
                            className="px-6 py-3 bg-[#d02a2a] text-white rounded-lg font-medium hover:bg-[#b02525] transition duration-300">
                            Mua sắm ngay
                        </motion.button>
                        <motion.button
                            variants={fadeIn("left", 0.3)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.7 }}
                            className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition duration-300">
                            Liên hệ chúng tôi
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}