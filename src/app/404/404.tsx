"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error404Page() {
    const [darkMode, setDarkMode] = useState(false);
    const [loaded, setLoaded] = useState(true);

    useEffect(() => {
        // Load dark mode preference from localStorage
        const savedMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
        setDarkMode(savedMode);

        // Hide preloader after page load
        const timer = setTimeout(() => setLoaded(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Save dark mode preference
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className={`relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            {/* ==== Preloader ==== */}
            {loaded && (
                <div className="fixed left-0 top-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
                    {/* Preloader content here */}
                </div>
            )}

            {/* ==== Background Grid Shapes ==== */}
            <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                {/* Grid shape SVG or image */}
                <Image
                    src="https://demo.tailadmin.com/src/images/shape/grid-01.svg"
                    alt="404"
                    width={500}
                    height={500}
                />
            </div>
            <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                {/* Grid shape SVG or image */}
                <Image src="https://demo.tailadmin.com/src/images/shape/grid-01.svg"
                    alt="404"
                    width={500}
                    height={500} />
            </div>

            {/* ==== Main Content ==== */}
            <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                <h1 className="mb-8 text-2xl font-bold text-gray-800 dark:text-white/90 xl:text-8xl">ERROR</h1>

                {/* 404 Image - Switch based on theme */}
                <div className="relative h-40 w-full">
                    <Image
                        src="https://demo.tailadmin.com/src/images/error/404.svg"
                        alt="404"
                        fill
                        className="dark:hidden"
                    />
                    <Image
                        src="https://demo.tailadmin.com/src/images/error/404-dark.svg"
                        alt="404"
                        fill
                        className="hidden dark:block"
                    />
                </div>

                <p className="mb-6 mt-10 text-base text-gray-700 dark:text-gray-200 sm:text-lg">
                    Có vẻ như chúng tôi không thể tìm thấy trang bạn đang tìm kiếm!
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-white dark:text-black dark:hover:bg-white/5 dark:hover:text-gray-200"
                >
                    Quay về trang chủ
                </Link>
            </div>

            <div className="mt-12 text-sm text-gray-500 dark:text-white">
                © {new Date().getFullYear()} - Capstone
            </div>

            {/* Dark Mode Toggle Button (optional) */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
                {darkMode ? '☀️' : '🌙'}
            </button>
        </div>
    );
}