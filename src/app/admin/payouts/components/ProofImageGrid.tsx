"use client";

import { useEffect, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

type Props = {
  images: string[];
};

export default function ProofImageGrid({ images }: Props) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lightbox: PhotoSwipeLightbox | null = null;

    if (galleryRef.current) {
      lightbox = new PhotoSwipeLightbox({
        gallery: galleryRef.current,
        children: "a",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
    }

    return () => {
      lightbox?.destroy();
    };
  }, []);

  return (
    <div
      ref={galleryRef}
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      {images.map((url, idx) => (
        <a
          key={idx}
          href={url} 
          data-pswp-width="1600"
          data-pswp-height="1200"
          target="_blank"
          rel="noreferrer"
          className="block w-full aspect-square overflow-hidden rounded-lg"
        >
          <img
            src={url}
            alt={`Proof ${idx + 1}`}
            className="object-cover w-full h-full"
          />
        </a>
      ))}
    </div>
  );
}
