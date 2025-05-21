"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function AuthCarousel() {
  const [animation1, setAnimation1] = useState(null);
  const [animation2, setAnimation2] = useState(null);

  useEffect(() => {
    fetch("/images/login.json").then((res) => res.json()).then(setAnimation1);
    fetch("/images/register.json").then((res) => res.json()).then(setAnimation2);
  }, []);

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
          <div className="relative w-full h-screen bg-gradient-to-br from-[#252424] via-[#d02a2a] to-[#ebeaea]">
            <Lottie
              animationData={animation1}
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute bottom-[20%] w-full text-center px-4">
              <p className="text-3xl leading-normal text-white font-montserrat_alternates">
                Mở hộp quà bí ẩn – mỗi lần là một bất ngờ!
                <br />
                BlindTreasure - Khám phá điều mới mẻ trong từng hộp.
              </p>
            </div>
          </div>
        </CarouselItem>

        <CarouselItem>
          <div className="relative w-full h-screen bg-gradient-to-br from-[#1e3a8a] via-[#6b21a8] to-[#a5b4fc]">
            <Lottie
              animationData={animation2}
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute bottom-[20%] w-full text-center px-4">
              <p className="text-3xl leading-normal text-white font-montserrat_alternates">
                Chọn hộp, mở ra – quà tặng bất ngờ chờ bạn!
                <br />
                Trải nghiệm cảm giác hồi hộp cùng BlindTreasure ngay hôm nay.
              </p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
