import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { cn } from '@/lib/utils'; // Adjust path as needed
import 'swiper/css';
import 'swiper/css/navigation';

// Shadcn-style button variants
const buttonVariants = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  },
  sizes: {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9"
  }
};

const CategoryGrid = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Tất cả",
      icon: "📦"
    },
    {
      id: 2,
      name: "Hàng mới", 
      icon: "🆕"
    },
    {
      id: 3,
      name: "Khuyến mãi",
      icon: "🏷️"
    },
    {
      id: 4,
      name: "Blind Box",
      icon: "🎁"
    },
    {
      id: 5,
      name: "Phụ kiện",
      icon: "🔧"
    },
    {
      id: 6,
      name: "Đồ chơi",
      icon: "🧸"
    },
    {
      id: 7,
      name: "Bách hóa",
      icon: "🛒"
    },
    {
      id: 8,
      name: "Sách",
      icon: "📚"
    },
    {
      id: 9,
      name: "Điện tử",
      icon: "📱"
    },
    {
      id: 10,
      name: "Thời trang",
      icon: "👕"
    },
    {
      id: 11,
      name: "Làm đẹp",
      icon: "💄"
    },
    {
      id: 12,
      name: "Thể thao",
      icon: "⚽"
    }
  ];

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Button component with shadcn styling
  const Button = ({ 
    className, 
    variant = "outline", 
    size = "icon", 
    disabled, 
    children, 
    ...props 
  }: {
    className?: string;
    variant?: keyof typeof buttonVariants.variants;
    size?: keyof typeof buttonVariants.sizes;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    return (
      <button
        className={cn(
          buttonVariants.base,
          buttonVariants.variants[variant],
          buttonVariants.sizes[size],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="py-6 bg-white">
      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Left Navigation Button */}
        <Button
          onClick={handlePrev}
          disabled={isBeginning}
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-2",
            "hover:bg-white hover:scale-110 hover:border-orange-300 hover:shadow-lg",
            "transition-all duration-200 ease-out",
            isBeginning && "opacity-30 hover:scale-100 hover:border-gray-200"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Right Navigation Button */}
        <Button
          onClick={handleNext}
          disabled={isEnd}
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-2",
            "hover:bg-white hover:scale-110 hover:border-orange-300 hover:shadow-lg",
            "transition-all duration-200 ease-out",
            isEnd && "opacity-30 hover:scale-100 hover:border-gray-200"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Categories Swiper */}
        <div className="px-12">
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={handleSlideChange}
            slidesPerView={4}
            spaceBetween={16}
            slidesPerGroup={4}
            modules={[Navigation]}
            className="category-swiper"
            breakpoints={{
              480: {
                slidesPerView: 5,
                slidesPerGroup: 5,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 6,
                slidesPerGroup: 6,
                spaceBetween: 18,
              },
              768: {
                slidesPerView: 8,
                slidesPerGroup: 8,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 10,
                slidesPerGroup: 10,
                spaceBetween: 24,
              },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div
                  className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    console.log(`Clicked category: ${category.name}`);
                    // Add your navigation logic here
                  }}
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all duration-200 border border-orange-100 group-hover:border-orange-200 group-hover:bg-gradient-to-br group-hover:from-orange-100 group-hover:to-red-100">
                    <span className="text-2xl sm:text-3xl md:text-3xl">{category.icon}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 text-center leading-tight font-medium group-hover:text-orange-600 transition-colors duration-200 px-1">
                    {category.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;