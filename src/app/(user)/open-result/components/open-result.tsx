"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Rarity, RarityText } from "@/const/products";
import { BlindBoxItem } from "@/services/blindboxes/typings";
import useGetProductById from "../hooks/useGetProductById";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/use-toast";
import useGetBlindboxById from "../hooks/useGetBlindboxById";

export default function MagicBoxOpening() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState<
    "rotate" | "fire" | "explode" | "spinning" | "item"
  >("rotate");
  const [hasShownToast, setHasShownToast] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Audio refs for sound effects
  const sound1Ref = useRef<HTMLAudioElement>(null);
  const sound2Ref = useRef<HTMLAudioElement>(null);
  const sound3Ref = useRef<HTMLAudioElement>(null);
  const sound4Ref = useRef<HTMLAudioElement>(null);

  // Get unbox result from URL params
  const productId = searchParams.get('productId') || '';
  const blindBoxId = searchParams.get('blindBoxId') || '';

  // Fetch product details and blindbox details
  const { product } = useGetProductById(productId);
  const { blindBox, isPending: isBlindBoxLoading } = useGetBlindboxById(blindBoxId);

  // Get rarity from blindbox items instead of URL
  const rarity = useMemo(() => {
    if (!blindBox?.items || !productId) return Rarity.Common;

    const matchingItem = blindBox.items.find(item => item.productId === productId);
    return matchingItem?.rarity || Rarity.Common;
  }, [blindBox?.items, productId]);

  // Check if this is a Secret rarity for special effects
  const isSecret = rarity === Rarity.Secret;

  // Convert blindbox items to spinning items format
  const blindBoxItems = blindBox?.items?.map((item: BlindBoxItem) => ({
    name: item.productName,
    image: item.imageUrl || "/images/item1.png",
    rarity: item.rarity.toLowerCase()
  })) || [];

  // Use real product data for won item
  const wonItem = product ? {
    name: product.name,
    image: product.imageUrls?.[0] || "/images/item1.png",
    rarity: rarity.toLowerCase()
  } : {
    name: "Unknown Item",
    image: "/images/item1.png",
    rarity: rarity.toLowerCase()
  };

  // Use only blindbox items for spinning animation
  const items = blindBoxItems.length > 0
    ? [wonItem, ...blindBoxItems.filter((item: any) => item.name !== wonItem.name)]
    : [wonItem];

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const finalItemIndex = 0;
  const finalItem = items[finalItemIndex];

  // Function to play sound with error handling
  const playSound = async (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        if (audioRef.current.readyState < 2) {
          await new Promise((resolve) => {
            audioRef.current!.addEventListener('canplay', resolve, { once: true });
          });
        }
        await audioRef.current.play();
      } catch (error) {
        // Audio play failed silently
      }
    }
  };

  // Function to stop sound
  const stopSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Enable audio context on first user interaction
  const enableAudio = async () => {
    if (audioEnabled) return;

    try {
      const audioElements = [sound1Ref, sound2Ref, sound3Ref, sound4Ref];
      for (const audioRef of audioElements) {
        if (audioRef.current) {
          audioRef.current.muted = true;
          await audioRef.current.play();
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
        }
      }
      setAudioEnabled(true);
    } catch (error) {
      // Audio context enable failed silently
    }
  };

  // Control sound effects based on step
  useEffect(() => {
    const playStepSound = async () => {
      // Enable audio context first
      await enableAudio();

      switch (step) {
        case "rotate":
          // Add small delay for sound 1 to ensure it's ready
          setTimeout(() => {
            playSound(sound1Ref);
          }, 100);
          break;
        case "fire":
          // Stop sound 1 and play sound 2 during fire phase
          stopSound(sound1Ref);
          playSound(sound2Ref);
          break;
        case "explode":
          // Continue sound 2 during explode phase (no change needed)
          break;
        case "spinning":
          // Stop sound 2 and play sound 3 during spinning phase
          stopSound(sound2Ref);
          playSound(sound3Ref);
          break;
        case "item":
          // Stop sound 3 and play sound 4 when item appears
          stopSound(sound3Ref);
          playSound(sound4Ref);
          break;
      }
    };

    playStepSound();
  }, [step]);

  // Show success toast when animation completes
  useEffect(() => {
    if (step === "item" && !hasShownToast && product) {
      setHasShownToast(true);
      addToast({
        type: "success",
        description: `Chúc mừng! Bạn đã nhận được ${product.name}!`,
        duration: 5000,
      });
    }
  }, [step, hasShownToast, product, addToast, setHasShownToast]);

  // Auto-enable audio on component mount
  useEffect(() => {
    const handleUserInteraction = () => {
      enableAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Cleanup sounds on unmount
  useEffect(() => {
    return () => {
      stopSound(sound1Ref);
      stopSound(sound2Ref);
      stopSound(sound3Ref);
      stopSound(sound4Ref);
    };
  }, []);

  // Start animation when ready
  useEffect(() => {
    // If we have blindBoxId, wait for blindbox data
    if (blindBoxId && (!blindBox || isBlindBoxLoading)) return;

    // Different timing for Secret vs other rarities
    const fireDelay = isSecret ? 4000 : 3000;
    const explodeDelay = isSecret ? 6000 : 4500;
    const spinningDelay = isSecret ? 8000 : 6000;
    const itemDelay = isSecret ? 15000 : 11000;

    const timer1 = setTimeout(() => setStep("fire"), fireDelay);
    const timer2 = setTimeout(() => setStep("explode"), explodeDelay);
    const timer3 = setTimeout(() => setStep("spinning"), spinningDelay);
    const timer4 = setTimeout(() => setStep("item"), itemDelay);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [blindBox, isBlindBoxLoading, blindBoxId]);

  useEffect(() => {
    if (step !== "spinning") return;

    let interval: NodeJS.Timeout;
    let currentSpeed = 50;
    let cycles = 0;
    const maxCycles = 35;

    const spin = () => {
      interval = setTimeout(() => {
        setCurrentItemIndex((prev) => (prev + 1) % items.length);
        cycles++;

        if (cycles > 20) currentSpeed += 20;
        if (cycles > 30) currentSpeed += 50;

        if (cycles < maxCycles) {
          spin();
        } else {
          setCurrentItemIndex(finalItemIndex);
        }
      }, currentSpeed);
    };

    spin();
    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [step, items.length, finalItemIndex]);

  const magicRadii = [70, 90, 110];

  const createStarPoints = (cx: number, cy: number, outerRadius: number, innerRadius: number, numPoints: number) => {
    const angle = Math.PI / numPoints;
    const points = [];
    for (let i = 0; i < numPoints * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const a = i * angle - Math.PI / 2;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const starPoints = useMemo(() => {
    const outerR = 110;
    const innerR = 70;
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (-90 + i * 36) * Math.PI / 180;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = 100 + r * Math.cos(angle);
      const y = 100 + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-blue-400";
      case "epic": return "text-purple-400";
      case "secret": return "text-yellow-400";
      default: return "text-white";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "common": return "shadow-lg shadow-gray-400/30";
      case "rare": return "shadow-lg shadow-blue-400/50";
      case "epic": return "shadow-xl shadow-purple-400/60";
      case "secret": return "shadow-2xl shadow-yellow-400/90 animate-pulse";
      default: return "";
    }
  };

  // Show loading state only when we have blindBoxId but no data yet
  if (blindBoxId && (isBlindBoxLoading || !blindBox)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a2a] to-[#1a0444] relative overflow-hidden">
        <motion.div
          className="flex flex-col items-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-semibold">Đang tải dữ liệu blindbox...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a2a] to-[#1a0444] relative overflow-hidden"
      onClick={enableAudio}
    >
      {/* Audio enable overlay - only show if audio not enabled */}
      {!audioEnabled && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <p className="text-lg font-semibold mb-2">🔊 Nhấn để bật âm thanh</p>
            <p className="text-sm opacity-80">Click anywhere to enable sound</p>
          </motion.div>
        </div>
      )}

      {step === "item" && (
        <Confetti
          numberOfPieces={isSecret ? 300 : 200}
          colors={isSecret ? ['#ffd700', '#ec4899', '#ffffff', '#fbbf24', '#f59e0b'] : undefined}
        />
      )}

      {/* Vòng tròn ánh sáng lửa bùng mạnh (fire step) */}
      {step === "fire" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)",
              boxShadow: "0 0 100px 20px rgba(59,130,246,0.6), inset 0 0 60px rgba(59,130,246,0.4)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 220,
              height: 220,
              background: "radial-gradient(circle, rgba(147,51,234,0.9) 0%, rgba(147,51,234,0.4) 60%, transparent 80%)",
              boxShadow: "0 0 80px 15px rgba(147,51,234,0.7), inset 0 0 40px rgba(147,51,234,0.5)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          {/* Inner core */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 140,
              height: 140,
              background: "radial-gradient(circle, rgba(251,146,60,1) 0%, rgba(239,68,68,0.8) 40%, rgba(239,68,68,0.3) 70%, transparent 90%)",
              boxShadow: "0 0 60px 10px rgba(251,146,60,0.8), inset 0 0 30px rgba(239,68,68,0.6)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />

          {/* Tia sáng - giống nhau cho tất cả rarity */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
              style={{
                width: 200,
                height: 2,
                transformOrigin: "left center",
                rotate: `${i * 45}deg`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleX: [0, 1, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Vòng tròn tỏa sáng nhiều vòng (explode step) */}
      {step === "explode" && (
        <>
          {/* Main explosion rings - giống nhau cho tất cả rarity */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 240,
                height: 240,
                top: "32%",
                left: "42%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 60%, transparent 80%)",
                boxShadow: "0 0 30px 10px rgba(255,255,255,0.6), 0 0 60px 20px rgba(59,130,246,0.4)",
                border: "1px solid rgba(255,255,255,0.8)",
                filter: "blur(2px)",
              }}
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{
                duration: 1.6,
                delay: i * 0.25,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      <AnimatePresence>
        {step !== "item" && step !== "spinning" && (
          <motion.div
            className="relative w-60 h-60"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              opacity: step === "rotate" ? 0.5 : step === "fire" ? 0.7 : 0.4,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            {(step === "rotate" || step === "fire" || step === "explode") && (
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute w-full h-full z-20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              >
                {magicRadii.map((r, i) => (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r={r}
                    stroke="#fff"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4 6"
                    opacity={0.6 - i * 0.15}
                  />
                ))}
                <polygon
                  points={createStarPoints(100, 100, 70, 40, 5)}
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 6"
                  opacity={0.8}
                />
                <polygon
                  points={starPoints}
                  stroke="#fff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 6"
                  opacity={0.8}
                />
              </motion.svg>
            )}

            <img
              src="/images/test.png"
              alt="Baby Tree Box"
              className="w-full h-full object-contain relative z-10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎰 Hiệu ứng quay item */}
      {step === "spinning" && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            {/* Khung viền sáng cho item đang quay */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffd93d, #6c5ce7)",
                backgroundSize: "200% 200%",
                padding: "4px",
                filter: "blur(8px)",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="relative bg-gray-900 rounded-xl p-6 w-48 h-48 flex flex-col items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
              }}
            >
              <motion.img
                key={currentItemIndex}
                src={items[currentItemIndex].image}
                alt={items[currentItemIndex].name}
                className={`w-24 h-24 object-contain rounded-lg ${getRarityGlow(items[currentItemIndex].rarity)}`}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
              <p className={`text-sm font-semibold mt-3 text-center ${getRarityColor(items[currentItemIndex].rarity)}`}>
                {items[currentItemIndex].name}
              </p>
            </motion.div>
          </div>

          <motion.p
            className="text-lg font-bold mt-4 text-white"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          >
            🎰 Đang quay...
          </motion.p>
        </motion.div>
      )}

      {/* 🎁 Hiển thị vật phẩm trúng cuối cùng */}
      {step === "item" && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ scale: isSecret ? 1.3 : 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: isSecret ? [0, 10, -10, 0] : [0, 5, -5, 0],
            }}
            transition={{
              duration: isSecret ? 1.5 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Background glow effects - enhanced for Secret */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: isSecret
                  ? "linear-gradient(45deg, #ffd700, #ec4899, #ffd700, #ec4899)"
                  : "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                filter: isSecret ? "blur(25px)" : "blur(20px)",
                scale: isSecret ? 2.2 : 1.5,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                rotate: isSecret ? [0, 360] : undefined,
              }}
              transition={{
                opacity: { duration: 1, repeat: Infinity },
                rotate: isSecret ? { duration: 4, repeat: Infinity, ease: "linear" } : undefined,
              }}
            />

            {/* Inner sparkle ring - only for Secret */}
            {isSecret && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(251,191,36,0.7) 30%, rgba(236,72,153,0.5) 60%, transparent 80%)",
                  filter: "blur(15px)",
                  scale: 1.8,
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1.8, 2.0, 1.8],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Floating sparkles - only for Secret */}
            {isSecret && [...Array(8)].map((_, i) => (
              <motion.div
                key={`item-sparkle-${i}`}
                className="absolute w-3 h-3 bg-white rounded-full"
                style={{
                  boxShadow: "0 0 15px 3px rgba(255,255,255,0.8)",
                }}
                animate={{
                  x: Math.cos(i * 45 * Math.PI / 180) * 100,
                  y: Math.sin(i * 45 * Math.PI / 180) * 100,
                  scale: [0.5, 1, 0.5],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}

            <img
              src={finalItem.image}
              alt={finalItem.name}
              className={`${isSecret ? 'w-44 h-44' : 'w-36 h-36'} object-contain rounded-full shadow-2xl ${getRarityGlow(finalItem.rarity)} relative z-10`}
            />
          </motion.div>

          <motion.p
            className="text-2xl font-bold mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">🎉 Chúc mừng! Bạn nhận được:</span>
          </motion.p>

          <motion.p
            className={`text-3xl font-extrabold mt-2 text-center ${isSecret
              ? 'bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent'
              : getRarityColor(rarity.toLowerCase())
              }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isSecret ? [1, 1.15, 1] : [1, 1.1, 1],
            }}
            transition={{
              delay: 0.7,
              scale: {
                duration: isSecret ? 1.5 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          >
            {isSecret ? '🌟✨ ' : '✨ '}{finalItem.name}{isSecret ? ' ✨🌟' : ' ✨'}
          </motion.p>

          {/* Rarity Display */}
          <motion.div
            className="flex items-center justify-center mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className={`px-4 py-2 rounded-full border-2 ${rarity === 'Secret'
                ? 'bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-yellow-400/20 border-yellow-400 shadow-lg shadow-yellow-400/50'
                : rarity === 'Epic'
                  ? 'bg-purple-400/20 border-purple-400 shadow-lg shadow-purple-400/50'
                  : rarity === 'Rare'
                    ? 'bg-blue-400/20 border-blue-400 shadow-lg shadow-blue-400/50'
                    : 'bg-gray-400/20 border-gray-400 shadow-lg shadow-gray-400/30'
                }`}
              animate={{
                scale: isSecret ? [1, 1.05, 1] : [1, 1.02, 1],
                boxShadow: isSecret
                  ? ["0 0 20px rgba(251,191,36,0.5)", "0 0 30px rgba(236,72,153,0.7)", "0 0 20px rgba(251,191,36,0.5)"]
                  : undefined
              }}
              transition={{
                duration: isSecret ? 1.5 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className={`font-bold text-lg ${getRarityColor(rarity.toLowerCase())}`}>
                {rarity === 'Secret' && '🌟 '}
                {rarity === 'Epic' && '💜 '}
                {rarity === 'Rare' && '💙 '}
                {rarity === 'Common' && '🤍 '}
                {RarityText[rarity as Rarity]}
                {rarity === 'Secret' && ' 🌟'}
              </span>
            </motion.div>
          </motion.div>

          {/* Back to Inventory Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <Button
              onClick={() => router.push('/inventory')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Quay lại túi đồ
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Audio elements for sound effects */}
      <audio ref={sound1Ref} preload="auto">
        <source src="/sounds/sound1.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sound2Ref} preload="auto">
        <source src="/sounds/sound2.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sound3Ref} preload="auto">
        <source src="/sounds/sound3.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={sound4Ref} preload="auto">
        <source src="/sounds/sound4.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}