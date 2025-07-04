// // 🎯 Professional Background Removal using @imgly/background-removal
// // Optimized for Next.js with high-quality AI models

// import {
//   removeBackground as removeBackgroundAI,
//   Config,
//   preload,
// } from "@imgly/background-removal";

// // Preload model for faster processing
// let modelPreloaded = false;
// const preloadModel = async () => {
//   if (!modelPreloaded) {
//     try {
//       console.log("🚀 Preloading AI model...");
//       await preload({
//         model: "isnet",
//         debug: false,
//       });
//       modelPreloaded = true;
//       console.log("✅ AI model ready");
//     } catch (error) {
//       console.warn("⚠️ Model preload failed:", error);
//     }
//   }
// };

// // Configuration for background removal
// const config: Config = {
//   debug: false,
//   model: "isnet", // Use isnet model for better quality
//   output: {
//     format: "image/png",
//     quality: 0.8,
//   },
//   progress: (key, current, total) => {
//     // Only log important steps to reduce console spam
//     if (key === "compute:inference" || key === "compute:mask") {
//       console.log(`🔄 ${key}: ${current}/${total}`);
//     }
//   },
// };

// /**
//  * Main function to remove background from uploaded images using AI
//  * @param file - The uploaded image file
//  * @returns Promise<File> - Processed image with background removed
//  */
// export const removeBackground = async (file: File): Promise<File> => {
//   try {
//     console.log(`🎯 Bắt đầu xóa nền AI cho: ${file.name}`);

//     // Check if image needs background removal
//     const needsProcessing = await checkIfNeedsBackgroundRemoval(file);

//     if (!needsProcessing) {
//       console.log(`✅ Ảnh ${file.name} không cần xóa nền`);
//       return file;
//     }

//     console.log("🤖 Đang xử lý xóa nền bằng AI...");

//     // Use professional AI background removal
//     const blob = await removeBackgroundAI(file, config);

//     // Convert blob to File
//     const processedFile = new File(
//       [blob],
//       file.name.replace(/\.[^/.]+$/, "_nobg.png"),
//       {
//         type: "image/png",
//         lastModified: Date.now(),
//       }
//     );

//     console.log(`✅ Hoàn thành xóa nền AI: ${processedFile.name}`);
//     return processedFile;
//   } catch (error) {
//     console.error("❌ Lỗi khi xóa nền AI:", error);

//     // Fallback to basic processing if AI fails
//     console.log("🔄 Fallback to basic processing...");
//     try {
//       const basicProcessed = await processImageBackgroundRemoval(file);
//       return basicProcessed;
//     } catch (fallbackError) {
//       console.error("❌ Fallback cũng thất bại:", fallbackError);
//       return file; // Return original file if all processing fails
//     }
//   }
// };

// /**
//  * Check if image needs background removal
//  * @param file - Image file to check
//  * @returns Promise<boolean> - True if needs processing
//  */
// // const checkIfNeedsBackgroundRemoval = async (file: File): Promise<boolean> => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement("canvas");
// //     const ctx = canvas.getContext("2d");
// //     const img = new Image();

// //     img.onload = () => {
// //       canvas.width = img.width;
// //       canvas.height = img.height;

// //       if (!ctx) {
// //         resolve(true); // Default to processing if canvas fails
// //         return;
// //       }

// //       ctx.drawImage(img, 0, 0);

// //       try {
// //         const backgroundInfo = analyzeImageBackground(
// //           ctx,
// //           canvas.width,
// //           canvas.height
// //         );

// //         console.log("🔍 Background analysis:", {
// //           edgeUniformity: backgroundInfo.edgeUniformity.toFixed(3),
// //           cornerUniformity: backgroundInfo.cornerUniformity.toFixed(3),
// //           isLightBackground: backgroundInfo.isLightBackground,
// //           isWhiteBackground: backgroundInfo.isWhiteBackground,
// //           hasBrightCorners: backgroundInfo.hasBrightCorners,
// //           hasBackground: backgroundInfo.hasBackground,
// //         });

// //         // More aggressive criteria for background detection
// //         const needsProcessing = backgroundInfo.hasBackground;

// //         console.log(`🎯 ${file.name} needs processing:`, needsProcessing);
// //         resolve(needsProcessing);
// //       } catch (error) {
// //         console.error("Error analyzing background:", error);
// //         resolve(true); // Default to processing if analysis fails
// //       }
// //     };

// //     img.onerror = () => {
// //       console.error("Error loading image for analysis");
// //       resolve(true); // Default to processing if image load fails
// //     };

// //     img.src = URL.createObjectURL(file);
// //   });
// // };

// const checkIfNeedsBackgroundRemoval = async (file: File): Promise<boolean> => {
//   return new Promise((resolve) => {
//     // Sử dụng kích thước nhỏ hơn để phân tích nhanh
//     const ANALYSIS_SIZE = 200;
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });
//     const img = new Image();
    
//     img.onload = () => {
//       // Tính toán tỷ lệ scale để giữ nguyên tỷ lệ khung hình
//       const scale = Math.min(ANALYSIS_SIZE / img.width, ANALYSIS_SIZE / img.height);
//       canvas.width = Math.floor(img.width * scale);
//       canvas.height = Math.floor(img.height * scale);
      
//       if (!ctx) {
//         resolve(true);
//         return;
//       }

//       // Vẽ hình ảnh đã scale
//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
//       try {
//         const backgroundInfo = analyzeImageBackground(
//           ctx,
//           canvas.width,
//           canvas.height
//         );
//         resolve(backgroundInfo.hasBackground);
//       } catch (error) {
//         console.error("Error analyzing background:", error);
//         resolve(true);
//       }
//     };

//     img.onerror = () => resolve(true);
//     img.src = URL.createObjectURL(file);
//   });
// };

// /**
//  * Analyze image background to determine if removal is needed
//  */
// const analyzeImageBackground = (
//   ctx: CanvasRenderingContext2D,
//   width: number,
//   height: number
// ) => {
//   const imageData = ctx.getImageData(0, 0, width, height);
//   const data = imageData.data;

//   // Sample edge pixels more densely
//   const edgePixels: Array<{ r: number; g: number; b: number }> = [];
//   const cornerPixels: Array<{ r: number; g: number; b: number }> = [];

//   // Dynamic step size based on image size
//   const stepSize = Math.max(1, Math.floor(Math.min(width, height) / 100));

//   // Sample top and bottom edges
//   for (let x = 0; x < width; x += stepSize) {
//     // Top edge
//     const topIndex = x * 4;
//     edgePixels.push({
//       r: data[topIndex],
//       g: data[topIndex + 1],
//       b: data[topIndex + 2],
//     });

//     // Bottom edge
//     const bottomIndex = ((height - 1) * width + x) * 4;
//     edgePixels.push({
//       r: data[bottomIndex],
//       g: data[bottomIndex + 1],
//       b: data[bottomIndex + 2],
//     });
//   }

//   // Sample left and right edges
//   for (let y = 0; y < height; y += stepSize) {
//     // Left edge
//     const leftIndex = y * width * 4;
//     edgePixels.push({
//       r: data[leftIndex],
//       g: data[leftIndex + 1],
//       b: data[leftIndex + 2],
//     });

//     // Right edge
//     const rightIndex = (y * width + (width - 1)) * 4;
//     edgePixels.push({
//       r: data[rightIndex],
//       g: data[rightIndex + 1],
//       b: data[rightIndex + 2],
//     });
//   }

//   // Sample corners more densely
//   const cornerSize = Math.min(20, Math.floor(Math.min(width, height) / 10));

//   // Top-left corner
//   for (let y = 0; y < cornerSize; y++) {
//     for (let x = 0; x < cornerSize; x++) {
//       const index = (y * width + x) * 4;
//       cornerPixels.push({
//         r: data[index],
//         g: data[index + 1],
//         b: data[index + 2],
//       });
//     }
//   }

//   // Top-right corner
//   for (let y = 0; y < cornerSize; y++) {
//     for (let x = width - cornerSize; x < width; x++) {
//       const index = (y * width + x) * 4;
//       cornerPixels.push({
//         r: data[index],
//         g: data[index + 1],
//         b: data[index + 2],
//       });
//     }
//   }

//   // Bottom-left corner
//   for (let y = height - cornerSize; y < height; y++) {
//     for (let x = 0; x < cornerSize; x++) {
//       const index = (y * width + x) * 4;
//       cornerPixels.push({
//         r: data[index],
//         g: data[index + 1],
//         b: data[index + 2],
//       });
//     }
//   }

//   // Bottom-right corner
//   for (let y = height - cornerSize; y < height; y++) {
//     for (let x = width - cornerSize; x < width; x++) {
//       const index = (y * width + x) * 4;
//       cornerPixels.push({
//         r: data[index],
//         g: data[index + 1],
//         b: data[index + 2],
//       });
//     }
//   }

//   // Calculate uniformity
//   const edgeUniformity = calculateUniformity(edgePixels);
//   const cornerUniformity = calculateUniformity(cornerPixels);

//   // Calculate average colors
//   const avgColor = calculateAverageColor(edgePixels);

//   // Enhanced background detection
//   const isLightBackground =
//     avgColor.r > 180 && avgColor.g > 180 && avgColor.b > 180;
//   const isWhiteBackground =
//     avgColor.r > 220 && avgColor.g > 220 && avgColor.b > 220;

//   // Check for bright corners
//   const avgCornerColor = calculateAverageColor(cornerPixels);
//   const hasBrightCorners =
//     avgCornerColor.r + avgCornerColor.g + avgCornerColor.b > 650;

//   // More aggressive detection for product images
//   const hasBackground =
//     edgeUniformity > 0.15 || // Lower threshold for edge uniformity
//     cornerUniformity > 0.4 || // Lower threshold for corner uniformity
//     isLightBackground || // Light background detection
//     hasBrightCorners || // Bright corners detection
//     avgColor.r + avgColor.g + avgColor.b > 600; // High brightness sum

//   return {
//     edgeUniformity,
//     cornerUniformity,
//     isLightBackground,
//     isWhiteBackground,
//     hasBrightCorners,
//     hasBackground,
//     avgColor,
//   };
// };

// /**
//  * Calculate color uniformity (0 = very diverse, 1 = very uniform)
//  */
// const calculateUniformity = (
//   pixels: Array<{ r: number; g: number; b: number }>
// ): number => {
//   if (pixels.length === 0) return 0;

//   const avgColor = calculateAverageColor(pixels);
//   let totalVariance = 0;

//   for (const pixel of pixels) {
//     const rDiff = pixel.r - avgColor.r;
//     const gDiff = pixel.g - avgColor.g;
//     const bDiff = pixel.b - avgColor.b;
//     totalVariance += Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
//   }

//   const avgVariance = totalVariance / pixels.length;
//   // Normalize to 0-1 scale (assuming max variance of ~441 for RGB)
//   return Math.max(0, 1 - avgVariance / 441);
// };

// /**
//  * Calculate average color of pixels
//  */
// const calculateAverageColor = (
//   pixels: Array<{ r: number; g: number; b: number }>
// ) => {
//   if (pixels.length === 0) return { r: 0, g: 0, b: 0 };

//   const total = pixels.reduce(
//     (acc, pixel) => ({
//       r: acc.r + pixel.r,
//       g: acc.g + pixel.g,
//       b: acc.b + pixel.b,
//     }),
//     { r: 0, g: 0, b: 0 }
//   );

//   return {
//     r: Math.round(total.r / pixels.length),
//     g: Math.round(total.g / pixels.length),
//     b: Math.round(total.b / pixels.length),
//   };
// };

// /**
//  * Fallback basic background removal (simplified version)
//  */
// const processImageBackgroundRemoval = async (file: File): Promise<File> => {
//   return new Promise((resolve) => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     const img = new Image();

//     img.onload = () => {
//       canvas.width = img.width;
//       canvas.height = img.height;

//       if (!ctx) {
//         resolve(file);
//         return;
//       }

//       ctx.drawImage(img, 0, 0);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       // Simple background removal - make light pixels transparent
//       for (let i = 0; i < data.length; i += 4) {
//         const r = data[i];
//         const g = data[i + 1];
//         const b = data[i + 2];

//         // If pixel is very light (likely background), make it transparent
//         if (r > 240 && g > 240 && b > 240) {
//           data[i + 3] = 0; // Make transparent
//         }
//       }

//       ctx.putImageData(imageData, 0, 0);

//       canvas.toBlob((blob) => {
//         if (blob) {
//           const processedFile = new File(
//             [blob],
//             file.name.replace(/\.[^/.]+$/, "_nobg.png"),
//             { type: "image/png", lastModified: Date.now() }
//           );
//           resolve(processedFile);
//         } else {
//           resolve(file);
//         }
//       }, "image/png");
//     };

//     img.onerror = () => resolve(file);
//     img.src = URL.createObjectURL(file);
//   });
// };
