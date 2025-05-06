"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function AuthCarousel() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="absolute w-full h-[100vh]">
            <Image
              src={"/images/Login.png"}
              alt="Authen01"
              layout="fill"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative top-[60%]">
              <p className="text-3xl leading-normal text-gray-50 text-center font-montserrat_alternates">
                Đồng hành cùng bé chinh phục tiếng Anh từ đầu.
                <br />
                Tài liệu sinh động, giúp bé yêu thích học mỗi ngày.
              </p>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="relative w-full h-[100vh]">
            <Image
              src={"/images/Sign-up.png"}
              alt="Authen02"
              layout="fill"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative top-[60%]">
              <p className="text-3xl leading-normal text-gray-50 text-center font-montserrat_alternates">
                Học tiếng Anh dễ dàng, chắp cánh tương lai bé.
                <br />
                Từng bước nhỏ, khám phá tiếng Anh thú vị cùng bé!
              </p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
