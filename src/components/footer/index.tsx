import React from 'react';
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaSquareThreads } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 sm:px-10 md:px-20 lg:px-32 py-12 font-open_sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo */}
        <div className='flex justify-center lg:justify-start'>
          <img src="/images/logo.png" alt="Logo" className="h-36 filter brightness-0 invert-[1]" />
        </div>

        {/* Address */}
        <div>
          <p className='text-base mb-3 text-gray-300'>ĐỊA CHỈ</p>
          <p className='text-gray-400 text-sm'>Thành phố Hồ Chí Minh, Việt Nam</p>
          <p className='text-gray-400 text-sm mt-1'>
            (Xin lưu ý rằng chúng tôi không có địa chỉ tạm thời, chúng tôi chỉ là mạng lưới cung cấp tài liệu)
          </p>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-base mb-3 text-gray-300">LIÊN HỆ</h2>
          <p className='text-gray-400 text-sm'>Số điện thoại: 0918777437</p>
          <p className='text-gray-400 text-sm'>Email: edusource@gmail.com</p>
        </div>

        {/* Social */}
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="text-base mb-3 text-gray-300 text-center lg:text-left">THEO DÕI CHÚNG TÔI</h2>
          <div className="flex justify-center lg:justify-start space-x-4">
            <a href="#"><FaFacebookSquare size={24} /></a>
            <a href="#"><FaInstagramSquare size={24} /></a>
            <a href="#"><IoLogoYoutube size={24} /></a>
            <a href="#"><FaSquareThreads size={24} /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-600" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-300">
        © Công ty BlindTreasure, 2025
      </div>
    </footer>
  );
};

export default Footer;
