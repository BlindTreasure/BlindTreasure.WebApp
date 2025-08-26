'use client'
import React from 'react'
import { MdLocationPin } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import { fadeIn } from '@/utils/variants';

export default function Contact() {
    return (
        <div>
            <section>
                <div className="relative w-full h-96">
                    <img
                        className="absolute h-full w-full object-cover object-center"
                        src="./images/contact.webp"
                        alt="Liên hệ với chúng tôi"
                    />
                    <div className="absolute inset-0 h-full w-full bg-black/50"></div>
                    <motion.div
                        variants={fadeIn("up", 0.3)}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.7 }}
                        className="relative pt-28 text-center"
                    >
                        <h2 className="block antialiased tracking-normal font-sans font-semibold leading-[1.3] text-white mb-4 text-3xl lg:text-4xl mt-6">
                            Thông tin liên hệ
                        </h2>
                        <p className="block antialiased font-sans text-xl font-normal leading-relaxed text-white mb-9 opacity-70">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu có bất kỳ câu hỏi nào!
                        </p>
                    </motion.div>
                </div>

                <div className="-mt-16 mb-8 px-8">
                    <div className="container mx-auto">
                        <div className="py-12 flex flex-col md:flex-row justify-center gap-12 rounded-xl border border-white bg-white shadow-md shadow-black/5 saturate-200 px-4">
                            <motion.div
                                variants={fadeIn("right", 0.3)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.7 }}
                                className="my-4 md:my-8 grid gap-6 px-4 w-full max-w-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <MdLocationPin className='text-2xl text-blue-600' />
                                    <div>
                                        <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-bold">
                                            Địa chỉ
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            Thành phố Hồ Chí Minh, Việt Nam
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaPhone className='text-2xl text-blue-600' />
                                    <div>
                                        <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-bold">
                                            Điện thoại
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            091 877 7437
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <MdEmail className='text-2xl text-blue-600' />
                                    <div>
                                        <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-bold">
                                            Email
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            blindtreasure@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-4">Giờ làm việc</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                                        <p>Thứ 7 - Chủ nhật: 8:00 - 12:00</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={fadeIn("left", 0.3)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.7 }}
                                className="w-full max-w-lg"
                            >
                                <div className="h-full flex flex-col justify-center">
                                    <img src="https://pitel.vn/wp-content/uploads/2025/01/1-Khong-chi-tra-loi-cau-hoi-tong-dai-vien-con-la-cau-noi-giua-thuong-hieu-va-khach-hang.png" alt="" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}