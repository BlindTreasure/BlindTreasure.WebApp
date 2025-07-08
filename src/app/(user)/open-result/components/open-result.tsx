
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Confetti from "react-confetti";

// export default function MagicBoxOpening() {
//   const [step, setStep] = useState<
//     "rotate" | "fire" | "explode" | "item"
//   >("rotate");

//   useEffect(() => {
//     const timer1 = setTimeout(() => setStep("fire"), 3000); // Xoay xong thì hiện 3 vòng tròn ánh lửa
//     const timer2 = setTimeout(() => setStep("explode"), 4500); // Rung nhẹ và tỏa nhiều vòng tròn, hộp mờ dần
//     const timer3 = setTimeout(() => setStep("item"), 6000); // Hiện item
//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(timer3);
//     };
//   }, []);

//   // Kích thước vòng tròn ma thuật
//   const magicRadii = [70, 90, 110];

//   const createStarPoints = (
//     cx: number,
//     cy: number,
//     outerRadius: number,
//     innerRadius: number,
//     numPoints: number
//   ) => {
//     const angle = Math.PI / numPoints;
//     const points = [];

//     for (let i = 0; i < numPoints * 2; i++) {
//       const r = i % 2 === 0 ? outerRadius : innerRadius;
//       const a = i * angle - Math.PI / 2;
//       const x = cx + r * Math.cos(a);
//       const y = cy + r * Math.sin(a);
//       points.push(`${x},${y}`);
//     }

//     return points.join(" ");
//   };

//   const starPoints = useMemo(() => {
//     const outerR = 110;      // vòng ngoài
//     const innerR = 70;       // vòng trong (điểm lõm)
//     return Array.from({ length: 10 }, (_, i) => {
//       const angle = (-90 + i * 36) * Math.PI / 180; // -90° để đỉnh hướng lên
//       const r = i % 2 === 0 ? outerR : innerR;      // xen kẽ 110 – 70
//       const x = 100 + r * Math.cos(angle);
//       const y = 100 + r * Math.sin(angle);
//       return `${x},${y}`;
//     }).join(" ");
//   }, []);
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a2a] to-[#1a0444] relative overflow-hidden">
//       {step === "item" && <Confetti />}

//       {/* Vòng tròn ánh sáng lửa bùng mạnh (fire step) */}
//       {step === "fire" && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           {/* Vòng tròn ngoài cùng - xanh dương */}
//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 300,
//               height: 300,
//               background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)",
//               boxShadow: "0 0 100px 20px rgba(59,130,246,0.6), inset 0 0 60px rgba(59,130,246,0.4)",
//             }}
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [0.8, 1, 0.8],
//             }}
//             transition={{
//               duration: 1.5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />

//           {/* Vòng tròn giữa - tím */}
//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 220,
//               height: 220,
//               background: "radial-gradient(circle, rgba(147,51,234,0.9) 0%, rgba(147,51,234,0.4) 60%, transparent 80%)",
//               boxShadow: "0 0 80px 15px rgba(147,51,234,0.7), inset 0 0 40px rgba(147,51,234,0.5)",
//             }}
//             animate={{
//               scale: [1, 1.15, 1],
//               opacity: [0.7, 1, 0.7],
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 0.2,
//             }}
//           />

//           {/* Vòng tròn trong - cam/đỏ */}
//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 140,
//               height: 140,
//               background: "radial-gradient(circle, rgba(251,146,60,1) 0%, rgba(239,68,68,0.8) 40%, rgba(239,68,68,0.3) 70%, transparent 90%)",
//               boxShadow: "0 0 60px 10px rgba(251,146,60,0.8), inset 0 0 30px rgba(239,68,68,0.6)",
//             }}
//             animate={{
//               scale: [1, 1.3, 1],
//               opacity: [0.9, 1, 0.9],
//             }}
//             transition={{
//               duration: 0.8,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 0.4,
//             }}
//           />

//           {/* Hiệu ứng lửa nhấp nháy */}
//           {[...Array(6)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full"
//               style={{
//                 width: 80 + i * 15,
//                 height: 80 + i * 15,
//                 background: `radial-gradient(circle, rgba(251,146,60,${0.6 - i * 0.1}) 0%, transparent 70%)`,
//                 boxShadow: "0 0 40px rgba(251,146,60,0.8)",
//               }}
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.3, 0.8, 0.3],
//                 rotate: [0, 360],
//               }}
//               transition={{
//                 duration: 1 + i * 0.2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: i * 0.1,
//               }}
//             />
//           ))}

//           {/* Tia sáng */}
//           {[...Array(8)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
//               style={{
//                 width: 200,
//                 height: 2,
//                 transformOrigin: "left center",
//                 rotate: `${i * 45}deg`,
//               }}
//               animate={{
//                 opacity: [0, 1, 0],
//                 scaleX: [0, 1, 0],
//               }}
//               transition={{
//                 duration: 0.5,
//                 repeat: Infinity,
//                 delay: i * 0.1,
//                 repeatDelay: 1,
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Vòng tròn tỏa sáng nhiều vòng (explode step) */}
//       {step === "explode" && (
//         <>
//           {[...Array(3)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full"
//               style={{
//                 width: 240,                 // đường kính ban đầu
//                 height: 240,
//                 top: "32%",                 // căn giữa
//                 left: "42%",
//                 transform: "translate(-50%, -50%)",
//                 background:
//                   "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 60%, transparent 80%)",
//                 boxShadow:
//                   "0 0 30px 10px rgba(255,255,255,0.6), 0 0 60px 20px rgba(59,130,246,0.4)", // glow ngoài
//                 border: "1px solid rgba(255,255,255,0.8)",   // mỏng, giữ nét hypnotic nhẹ
//                 filter: "blur(2px)",                         // hơi mờ viền
//               }}
//               initial={{ scale: 1, opacity: 0.9 }}
//               animate={{ scale: 4, opacity: 0 }}
//               transition={{
//                 duration: 1.6,
//                 delay: i * 0.25,
//                 repeat: Infinity,
//                 ease: "easeOut",
//               }}
//             />
//           ))}
//         </>
//       )}


//       <AnimatePresence>
//         {step !== "item" && (
//           <motion.div
//             className="relative w-60 h-60"
//             initial={{ scale: 0 }}
//             animate={{
//               scale: 1,
//               opacity: step === "rotate" ? 0.5 : step === "fire" ? 0.7 : 0.4,
//             }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* 🔄 Vòng tròn + ngôi sao xoay nhanh hơn */}
//             {(step === "rotate" || step === "fire" || step === "explode") && (
//               <motion.svg
//                 viewBox="0 0 200 200"
//                 className="absolute w-full h-full z-20"
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 5, ease: "linear" }} // xoay nhanh hơn (trước 10s)
//               >
//                 {magicRadii.map((r, i) => (
//                   <circle
//                     key={i}
//                     cx="100"
//                     cy="100"
//                     r={r}
//                     stroke="#fff"
//                     strokeWidth="2"
//                     fill="none"
//                     strokeDasharray="4 6"
//                     opacity={0.6 - i * 0.15} // vòng ngoài mờ hơn
//                   />
//                 ))}
//                 <polygon
//                   points={createStarPoints(100, 100, 70, 40, 5)} // 5 cánh => 10 điểm
//                   stroke="#fff"
//                   strokeWidth="2"
//                   fill="none"
//                   strokeDasharray="4 6"
//                   opacity={0.8}
//                 />
//                 <polygon
//                   points={starPoints}
//                   stroke="#fff"
//                   strokeWidth="2"
//                   fill="none"
//                   strokeDasharray="4 6"
//                   opacity={0.8}
//                 />


//               </motion.svg>
//             )}

//             {/* 📦 Hộp */}
//             <img
//               src="/images/test.png"
//               alt="Baby Tree Box"
//               className="w-full h-full object-contain relative z-10"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🎁 Hiển thị vật phẩm nhận được */}
//       {step === "item" && (
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1.2 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <img
//             src="/images/item6.png"
//             alt="Bạn nhận được"
//             className="w-36 h-36 object-contain rounded-full shadow-xl"
//           />
//           <p className="text-xl font-semibold mt-4 text-white">
//             🎉 Bạn nhận được:{" "}
//             <span className="text-pink-400">Labubu Siêu Hiếm</span>
//           </p>
//         </motion.div>
//       )}
//     </div>
//   );
// }


// LIA ITEM

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// // Confetti effect tự tạo

// export default function MagicBoxOpening() {
//   const [step, setStep] = useState<
//     "rotate" | "fire" | "explode" | "spinning" | "item"
//   >("rotate");

//   // Danh sách các item có thể quay
//     const items = [
//     { name: "Gấu Bông Thường", image: "/images/item1.png", rarity: "common" },
//     { name: "Búp Bê Mini", image: "/images/item2.png", rarity: "common" },
//     { name: "Mô Hình Robot", image: "/images/item3.png", rarity: "rare" },
//     { name: "Unicorn Bông", image: "/images/item4.png", rarity: "rare" },
//     { name: "Labubu", image: "/images/item5.png", rarity: "legendary" },
//     { name: "Baby Three Siêu Hiếm", image: "/images/item6.png", rarity: "epic" },
//   ];

//   const [currentItemIndex, setCurrentItemIndex] = useState(0);
//   const [spinSpeed, setSpinSpeed] = useState(100); // ms giữa các item
//   const finalItem = items[4]; // Labubu Siêu Hiếm

//   useEffect(() => {
//     const timer1 = setTimeout(() => setStep("fire"), 3000);
//     const timer2 = setTimeout(() => setStep("explode"), 4500);
//     const timer3 = setTimeout(() => setStep("spinning"), 6000);
//     const timer4 = setTimeout(() => setStep("item"), 11000); // Tăng thời gian để có đủ chỗ quay

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//       clearTimeout(timer3);
//       clearTimeout(timer4);
//     };
//   }, []);

//   const [scrollPosition, setScrollPosition] = useState(0);

//   // Hiệu ứng cuộn ngang
//   useEffect(() => {
//     if (step !== "spinning") return;

//     let animationFrame: number;
//     let startTime = Date.now();
//     const duration = 5000; // 5 giây
//     const itemWidth = 160; // Chiều rộng mỗi item + margin (w-36 + mx-2 = 144 + 16 = 160)
//     const containerCenter = 192; // Nửa chiều rộng container (w-96 = 384px / 2 = 192px)
//     const itemCenter = 80; // Nửa chiều rộng item (w-36 = 144px / 2 = 72px + margin)

//     // Tính vị trí để Labubu (index 4) dừng chính giữa khung vàng
//     // Vị trí Labubu trong loop cuối = loop 3 * 8 items + index 4 = item thứ 28
//     const labubuPosition = (3 * items.length + 4) * itemWidth;
//     // Điều chỉnh để center của Labubu trùng với center của container
//     const finalPosition = labubuPosition - containerCenter + itemCenter;

//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Easing function - bắt đầu nhanh, chậm dần
//       const easeOut = 1 - Math.pow(1 - progress, 3);

//       const currentPos = easeOut * finalPosition;
//       setScrollPosition(currentPos);

//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       }
//     };

//     animate();

//     return () => {
//       if (animationFrame) cancelAnimationFrame(animationFrame);
//     };
//   }, [step, items.length]);

//   // Kích thước vòng tròn ma thuật
//   const magicRadii = [70, 90, 110];

//   const createStarPoints = (
//     cx: number,
//     cy: number,
//     outerRadius: number,
//     innerRadius: number,
//     numPoints: number
//   ) => {
//     const angle = Math.PI / numPoints;
//     const points = [];

//     for (let i = 0; i < numPoints * 2; i++) {
//       const r = i % 2 === 0 ? outerRadius : innerRadius;
//       const a = i * angle - Math.PI / 2;
//       const x = cx + r * Math.cos(a);
//       const y = cy + r * Math.sin(a);
//       points.push(`${x},${y}`);
//     }

//     return points.join(" ");
//   };

//   const starPoints = useMemo(() => {
//     const outerR = 110;
//     const innerR = 70;
//     return Array.from({ length: 10 }, (_, i) => {
//       const angle = (-90 + i * 36) * Math.PI / 180;
//       const r = i % 2 === 0 ? outerR : innerR;
//       const x = 100 + r * Math.cos(angle);
//       const y = 100 + r * Math.sin(angle);
//       return `${x},${y}`;
//     }).join(" ");
//   }, []);

//   const getRarityColor = (rarity: string) => {
//     switch (rarity) {
//       case "common": return "text-gray-400";
//       case "rare": return "text-blue-400";
//       case "epic": return "text-purple-400";
//       case "legendary": return "text-yellow-400";
//       default: return "text-white";
//     }
//   };

//   const getRarityGlow = (rarity: string) => {
//     switch (rarity) {
//       case "common": return "shadow-lg shadow-gray-400/30";
//       case "rare": return "shadow-lg shadow-blue-400/50";
//       case "epic": return "shadow-xl shadow-purple-400/60";
//       case "legendary": return "shadow-2xl shadow-yellow-400/80";
//       default: return "";
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a2a] to-[#1a0444] relative overflow-hidden">
//       {/* Confetti effect tự tạo */}
//       {step === "item" && (
//         <div className="absolute inset-0 pointer-events-none">
//           {[...Array(50)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-2 h-2 bg-yellow-400 rounded-full"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, -20, 20],
//                 x: [0, Math.random() * 40 - 20],
//                 rotate: [0, 360],
//                 opacity: [1, 0],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 delay: Math.random() * 2,
//                 ease: "easeOut",
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Vòng tròn ánh sáng lửa bùng mạnh (fire step) */}
//       {step === "fire" && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 300,
//               height: 300,
//               background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)",
//               boxShadow: "0 0 100px 20px rgba(59,130,246,0.6), inset 0 0 60px rgba(59,130,246,0.4)",
//             }}
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [0.8, 1, 0.8],
//             }}
//             transition={{
//               duration: 1.5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />

//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 220,
//               height: 220,
//               background: "radial-gradient(circle, rgba(147,51,234,0.9) 0%, rgba(147,51,234,0.4) 60%, transparent 80%)",
//               boxShadow: "0 0 80px 15px rgba(147,51,234,0.7), inset 0 0 40px rgba(147,51,234,0.5)",
//             }}
//             animate={{
//               scale: [1, 1.15, 1],
//               opacity: [0.7, 1, 0.7],
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 0.2,
//             }}
//           />

//           <motion.div
//             className="absolute rounded-full"
//             style={{
//               width: 140,
//               height: 140,
//               background: "radial-gradient(circle, rgba(251,146,60,1) 0%, rgba(239,68,68,0.8) 40%, rgba(239,68,68,0.3) 70%, transparent 90%)",
//               boxShadow: "0 0 60px 10px rgba(251,146,60,0.8), inset 0 0 30px rgba(239,68,68,0.6)",
//             }}
//             animate={{
//               scale: [1, 1.3, 1],
//               opacity: [0.9, 1, 0.9],
//             }}
//             transition={{
//               duration: 0.8,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 0.4,
//             }}
//           />

//           {[...Array(6)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full"
//               style={{
//                 width: 80 + i * 15,
//                 height: 80 + i * 15,
//                 background: `radial-gradient(circle, rgba(251,146,60,${0.6 - i * 0.1}) 0%, transparent 70%)`,
//                 boxShadow: "0 0 40px rgba(251,146,60,0.8)",
//               }}
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.3, 0.8, 0.3],
//                 rotate: [0, 360],
//               }}
//               transition={{
//                 duration: 1 + i * 0.2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//                 delay: i * 0.1,
//               }}
//             />
//           ))}

//           {[...Array(8)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
//               style={{
//                 width: 200,
//                 height: 2,
//                 transformOrigin: "left center",
//                 rotate: `${i * 45}deg`,
//               }}
//               animate={{
//                 opacity: [0, 1, 0],
//                 scaleX: [0, 1, 0],
//               }}
//               transition={{
//                 duration: 0.5,
//                 repeat: Infinity,
//                 delay: i * 0.1,
//                 repeatDelay: 1,
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Vòng tròn tỏa sáng nhiều vòng (explode step) */}
//       {step === "explode" && (
//         <>
//           {[...Array(3)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full"
//               style={{
//                 width: 240,
//                 height: 240,
//                 top: "32%",
//                 left: "42%",
//                 transform: "translate(-50%, -50%)",
//                 background:
//                   "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 60%, transparent 80%)",
//                 boxShadow:
//                   "0 0 30px 10px rgba(255,255,255,0.6), 0 0 60px 20px rgba(59,130,246,0.4)",
//                 border: "1px solid rgba(255,255,255,0.8)",
//                 filter: "blur(2px)",
//               }}
//               initial={{ scale: 1, opacity: 0.9 }}
//               animate={{ scale: 4, opacity: 0 }}
//               transition={{
//                 duration: 1.6,
//                 delay: i * 0.25,
//                 repeat: Infinity,
//                 ease: "easeOut",
//               }}
//             />
//           ))}
//         </>
//       )}

//       <AnimatePresence>
//         {step !== "item" && step !== "spinning" && (
//           <motion.div
//             className="relative w-60 h-60"
//             initial={{ scale: 0 }}
//             animate={{
//               scale: 1,
//               opacity: step === "rotate" ? 0.5 : step === "fire" ? 0.7 : 0.4,
//             }}
//             exit={{ opacity: 0, scale: 0.5 }}
//             transition={{ duration: 0.5 }}
//           >
//             {(step === "rotate" || step === "fire" || step === "explode") && (
//               <motion.svg
//                 viewBox="0 0 200 200"
//                 className="absolute w-full h-full z-20"
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
//               >
//                 {magicRadii.map((r, i) => (
//                   <circle
//                     key={i}
//                     cx="100"
//                     cy="100"
//                     r={r}
//                     stroke="#fff"
//                     strokeWidth="2"
//                     fill="none"
//                     strokeDasharray="4 6"
//                     opacity={0.6 - i * 0.15}
//                   />
//                 ))}
//                 <polygon
//                   points={createStarPoints(100, 100, 70, 40, 5)}
//                   stroke="#fff"
//                   strokeWidth="2"
//                   fill="none"
//                   strokeDasharray="4 6"
//                   opacity={0.8}
//                 />
//                 <polygon
//                   points={starPoints}
//                   stroke="#fff"
//                   strokeWidth="2"
//                   fill="none"
//                   strokeDasharray="4 6"
//                   opacity={0.8}
//                 />
//               </motion.svg>
//             )}

//             <img
//               src="/images/test.png"
//               alt="Baby Tree Box"
//               className="w-full h-full object-contain relative z-10"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🎰 Hiệu ứng quét ngang như slot machine */}
//       {step === "spinning" && (
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           {/* Khung slot machine */}
//           <div className="relative bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-2xl shadow-2xl">
//             {/* Viền sáng chạy */}
//             <motion.div
//               className="absolute inset-0 rounded-2xl"
//               style={{
//                 background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffd93d, #6c5ce7)",
//                 backgroundSize: "200% 200%",
//                 padding: "3px",
//                 filter: "blur(6px)",
//               }}
//               animate={{
//                 backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
//               }}
//               transition={{
//                 duration: 0.5,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//             />

//             {/* Cửa sổ hiển thị */}
//             <div className="relative bg-black rounded-xl p-4 w-96 h-32 overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

//               {/* Dải item cuộn */}
//               <div 
//                 className="flex absolute top-1/2 transform -translate-y-1/2 transition-none"
//                 style={{
//                   transform: `translateX(-${scrollPosition}px) translateY(-50%)`,
//                   width: `${items.length * 160 * 5}px`, // Lặp lại nhiều lần
//                 }}
//               >
//                 {/* Lặp lại items nhiều lần để tạo hiệu ứng cuộn liên tục */}
//                 {Array.from({ length: 5 }, (_, loopIndex) =>
//                   items.map((item, itemIndex) => (
//                     <div
//                       key={`${loopIndex}-${itemIndex}`}
//                       className="flex-shrink-0 w-36 mx-2 flex flex-col items-center justify-center"
//                     >
//                       <motion.img
//                         src={item.image}
//                         alt={item.name}
//                         className={`w-16 h-16 object-contain rounded-lg ${getRarityGlow(item.rarity)}`}
//                         animate={{
//                           scale: [0.9, 1, 0.9],
//                         }}
//                         transition={{
//                           duration: 0.8,
//                           repeat: Infinity,
//                           delay: itemIndex * 0.1,
//                         }}
//                       />
//                       <p className={`text-xs font-semibold mt-1 text-center truncate w-full ${getRarityColor(item.rarity)}`}>
//                         {item.name}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Viền chỉ vị trí trúng (chỉnh qua phải một chút) */}
//               <div className="absolute transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-yellow-400 rounded-lg shadow-lg shadow-yellow-400/50" style={{ left: '55%', top: '40%' }}>
//                 <motion.div
//                   className="absolute inset-0 border-2 border-yellow-300 rounded-lg"
//                   animate={{
//                     opacity: [0.5, 1, 0.5],
//                     scale: [0.95, 1.05, 0.95],
//                   }}
//                   transition={{
//                     duration: 1,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                 />
//               </div>

//               {/* Hiệu ứng tia sáng */}
//               <div className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ left: '55%' }}>
//                 {[...Array(4)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="absolute bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent"
//                     style={{
//                       width: 150,
//                       height: 1,
//                       transformOrigin: "center",
//                       rotate: `${i * 45}deg`,
//                     }}
//                     animate={{
//                       opacity: [0, 1, 0],
//                       scaleX: [0, 1, 0],
//                     }}
//                     transition={{
//                       duration: 1,
//                       repeat: Infinity,
//                       delay: i * 0.2,
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* LED indicators */}
//             <div className="flex justify-center mt-4 space-x-2">
//               {[...Array(5)].map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="w-3 h-3 rounded-full bg-red-500"
//                   animate={{
//                     backgroundColor: ["#ef4444", "#fbbf24", "#ef4444"],
//                     boxShadow: ["0 0 5px #ef4444", "0 0 15px #fbbf24", "0 0 5px #ef4444"],
//                   }}
//                   transition={{
//                     duration: 0.6,
//                     repeat: Infinity,
//                     delay: i * 0.1,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           <motion.p 
//             className="text-xl font-bold mt-6 text-white text-center"
//             animate={{
//               opacity: [1, 0.7, 1],
//               scale: [1, 1.05, 1],
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//             }}
//           >
//             🎰 ĐANG QUAY... 🎰
//           </motion.p>
//         </motion.div>
//       )}

//       {/* 🎁 Hiển thị vật phẩm trúng cuối cùng */}
//       {step === "item" && (
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ scale: 0 }}
//           animate={{ scale: 1.2 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <motion.div
//             className="relative"
//             animate={{
//               rotate: [0, 5, -5, 0],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           >
//             <motion.div
//               className="absolute inset-0 rounded-full"
//               style={{
//                 background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
//                 filter: "blur(20px)",
//                 scale: 1.5,
//               }}
//               animate={{
//                 opacity: [0.8, 1, 0.8],
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//               }}
//             />
//             <img
//               src={finalItem.image}
//               alt={finalItem.name}
//               className="w-36 h-36 object-contain rounded-full shadow-2xl shadow-yellow-400/80 relative z-10"
//             />
//           </motion.div>

//           <motion.p 
//             className="text-2xl font-bold mt-6 text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <span className="text-white">🎉 Chúc mừng! Bạn nhận được:</span>
//           </motion.p>

//           <motion.p
//             className="text-3xl font-extrabold text-yellow-400 mt-2 text-center"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ 
//               opacity: 1, 
//               scale: [1, 1.1, 1],
//             }}
//             transition={{ 
//               delay: 0.7,
//               scale: {
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }
//             }}
//           >
//             ✨ {finalItem.name} ✨
//           </motion.p>
//         </motion.div>
//       )}
//     </div>
//   );
// }



// NHẢY ITEM

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Rarity } from "@/const/products";
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

  // Get unbox result from URL params
  const productId = searchParams.get('productId') || '';
  const rarity = searchParams.get('rarity') as Rarity || Rarity.Common;
  const blindBoxId = searchParams.get('blindBoxId') || '';

  // Check if this is a Secret rarity for special effects
  const isSecret = rarity === Rarity.Secret;

  // Fetch product details and blindbox details
  const { product } = useGetProductById(productId);
  const { blindBox, isPending: isBlindBoxLoading } = useGetBlindboxById(blindBoxId);

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
  // Always put the won item first, then other items from the blindbox
  const items = blindBoxItems.length > 0
    ? [wonItem, ...blindBoxItems.filter((item: any) => item.name !== wonItem.name)]
    : [wonItem]; // If no blindbox items, just show the won item

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Final item is always the won item (first item in array)
  const finalItemIndex = 0;
  const finalItem = items[finalItemIndex];

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

  // Hiệu ứng quay item
  // useEffect(() => {
  //   if (step !== "spinning") return;

  //   let interval: NodeJS.Timeout;
  //   let currentSpeed = 50; // Bắt đầu nhanh
  //   let cycles = 0;
  //   const maxCycles = 35; // Số lần quay

  //   const spin = () => {
  //     interval = setTimeout(() => {
  //       setCurrentItemIndex((prev) => (prev + 1) % items.length);
  //       cycles++;

  //       // Giảm tốc độ dần dần
  //       if (cycles > 20) {
  //         currentSpeed += 20; // Chậm dần
  //       }
  //       if (cycles > 30) {
  //         currentSpeed += 50; // Chậm hơn nữa
  //       }

  //       if (cycles < maxCycles) {
  //         spin();
  //       } else {
  //         // Đảm bảo dừng ở item cuối cùng (Labubu)
  //         setCurrentItemIndex(4);
  //       }
  //     }, currentSpeed);
  //   };

  //   spin();

  //   return () => {
  //     if (interval) clearTimeout(interval);
  //   };
  // }, [step, items.length]);

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

        if (cycles > 20) {
          currentSpeed += 20;
        }
        if (cycles > 30) {
          currentSpeed += 50;
        }

        if (cycles < maxCycles) {
          spin();
        } else {
          // Stop at the final item (won item)
          setCurrentItemIndex(finalItemIndex);
        }
      }, currentSpeed);
    };

    spin();

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [step, items.length]);

  // Kích thước vòng tròn ma thuật
  const magicRadii = [70, 90, 110];

  const createStarPoints = (
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    numPoints: number
  ) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a2a] to-[#1a0444] relative overflow-hidden">
      {step === "item" && (
        <Confetti
          numberOfPieces={isSecret ? 300 : 200}
          colors={isSecret ? ['#ffd700', '#ec4899', '#ffffff', '#fbbf24', '#f59e0b'] : undefined}
        />
      )}

      {/* Vòng tròn ánh sáng lửa bùng mạnh (fire step) */}
      {step === "fire" && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Secret rarity gets special golden/pink effects */}
          {isSecret ? (
            <>
              {/* Golden outer ring for Secret */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 400,
                  height: 400,
                  background: "radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(251,191,36,0.4) 40%, rgba(236,72,153,0.3) 70%, transparent 90%)",
                  boxShadow: "0 0 150px 30px rgba(251,191,36,0.8), inset 0 0 80px rgba(236,72,153,0.6)",
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Pink middle ring for Secret */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 280,
                  height: 280,
                  background: "radial-gradient(circle, rgba(236,72,153,1) 0%, rgba(236,72,153,0.6) 50%, rgba(251,191,36,0.4) 80%, transparent 90%)",
                  boxShadow: "0 0 120px 25px rgba(236,72,153,0.9), inset 0 0 60px rgba(251,191,36,0.7)",
                }}
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />

              {/* Inner sparkle core for Secret */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 160,
                  height: 160,
                  background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(251,191,36,0.9) 30%, rgba(236,72,153,0.6) 60%, transparent 80%)",
                  boxShadow: "0 0 80px 15px rgba(255,255,255,0.9), inset 0 0 40px rgba(251,191,36,0.8)",
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              />
            </>
          ) : (
            <>
              {/* Normal effects for other rarities */}
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
            </>
          )}

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 80 + i * 15,
                height: 80 + i * 15,
                background: `radial-gradient(circle, rgba(251,146,60,${0.6 - i * 0.1}) 0%, transparent 70%)`,
                boxShadow: "0 0 40px rgba(251,146,60,0.8)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}

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
          {isSecret ? (
            // Special Secret explosion with more rings and golden/pink colors
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 280 + i * 40,
                    height: 280 + i * 40,
                    top: "32%",
                    left: "42%",
                    transform: "translate(-50%, -50%)",
                    background: i % 2 === 0
                      ? "radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(251,191,36,0.3) 40%, rgba(236,72,153,0.2) 70%, transparent 90%)"
                      : "radial-gradient(circle, rgba(236,72,153,0.9) 0%, rgba(236,72,153,0.3) 40%, rgba(251,191,36,0.2) 70%, transparent 90%)",
                    boxShadow: i % 2 === 0
                      ? "0 0 50px 15px rgba(251,191,36,0.8), 0 0 100px 30px rgba(236,72,153,0.4)"
                      : "0 0 50px 15px rgba(236,72,153,0.8), 0 0 100px 30px rgba(251,191,36,0.4)",
                    border: `2px solid ${i % 2 === 0 ? 'rgba(251,191,36,0.9)' : 'rgba(236,72,153,0.9)'}`,
                    filter: "blur(1px)",
                  }}
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: 6, opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Additional sparkle effects for Secret */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-4 h-4 bg-white rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    boxShadow: "0 0 20px 5px rgba(255,255,255,0.8)",
                  }}
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos(i * 30 * Math.PI / 180) * 200,
                    y: Math.sin(i * 30 * Math.PI / 180) * 200,
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          ) : (
            // Normal explosion for other rarities
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 240,
                  height: 240,
                  top: "32%",
                  left: "42%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 60%, transparent 80%)",
                  boxShadow:
                    "0 0 30px 10px rgba(255,255,255,0.6), 0 0 60px 20px rgba(59,130,246,0.4)",
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
            ))
          )}
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
            {/* Special background effects for Secret */}
            {isSecret ? (
              <>
                {/* Outer golden ring for Secret */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(45deg, #ffd700, #ec4899, #ffd700, #ec4899)",
                    filter: "blur(25px)",
                    scale: 2.2,
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 360],
                  }}
                  transition={{
                    opacity: { duration: 1, repeat: Infinity },
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  }}
                />

                {/* Inner sparkle ring for Secret */}
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

                {/* Floating sparkles around Secret item */}
                {[...Array(8)].map((_, i) => (
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
              </>
            ) : (
              // Normal background for other rarities
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(45deg, #ffd700, #ffed4e, #ffd700)",
                  filter: "blur(20px)",
                  scale: 1.5,
                }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            )}

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
              : 'text-yellow-400'
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
              Quay lại Inventory
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}