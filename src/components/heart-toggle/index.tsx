import { useState } from "react";

export default function HeartToggle() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
        liked ? "bg-pink-100 text-red-500 scale-110" : "bg-gray-100 text-gray-400"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 transition-transform duration-300 ${
          liked ? "fill-[#ff5b89]" : "fill-none stroke-[#aaa]"
        }`}
      >
        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
      </svg>
    </button>
  );
}
