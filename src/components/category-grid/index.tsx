import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { cn } from '@/lib/utils'; // Adjust path as needed
import 'swiper/css';
import 'swiper/css/navigation';

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

interface CategoryGridProps {
  categories: API.Category[];
  onCategoryClick?: (category: API.Category) => void;
  loading?: boolean;
  className?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories = [],
  onCategoryClick,
  loading = false,
  className = ""
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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

  const handleCategoryClick = (category: API.Category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  const handleImageError = (categoryId: string | number) => {
    setImageErrors(prev => new Set(prev).add(String(categoryId)));
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded-xl mb-2"></div>
      <div className="w-16 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  // Render category image
  const renderCategoryImage = (category: API.Category) => {
    const hasImageError = imageErrors.has(String(category.id));
    
    if (hasImageError) {
      // Fallback placeholder when image fails to load
      return (
        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      );
    }
    
    return (
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-full object-cover rounded-xl"
        onError={() => handleImageError(category.id)}
        loading="lazy"
      />
    );
  };

  if (loading) {
    return (
      <div className={cn("py-6 bg-white", className)}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="px-12">
            <div className="grid grid-cols-10 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className={cn("py-6 bg-white", className)}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center text-gray-500 py-8">
            Không có danh mục nào để hiển thị
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-6 bg-white", className)}>
      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Navigation Buttons */}
        {categories.length > 10 && (
          <>
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
          </>
        )}

        {/* Categories Swiper */}
        <div className="px-12">
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={handleSlideChange}
            slidesPerView={10}
            spaceBetween={24}
            slidesPerGroup={10}
            modules={[Navigation]}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div
                  className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform duration-200"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-all duration-200 border border-orange-100 group-hover:border-orange-200 group-hover:bg-gradient-to-br group-hover:from-orange-100 group-hover:to-red-100 overflow-hidden">
                    {renderCategoryImage(category)}
                  </div>
                  <span className="text-sm text-gray-700 text-center leading-tight font-medium group-hover:text-orange-600 transition-colors duration-200 px-1 line-clamp-2">
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