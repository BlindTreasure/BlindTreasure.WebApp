// components/LightboxGallery.tsx
import React, { useRef } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";

interface LightboxGalleryProps {
    images: string[];
}

const LightboxGallery: React.FC<LightboxGalleryProps> = ({ images }) => {
    return (
        <Gallery>
            {images.map((src, idx) => (
                <Item
                    key={idx}
                    original={src}
                    thumbnail={src}
                    width="1200"
                    height="800"
                >
                    {({ ref, open }) => (
                        <img
                            ref={ref}
                            onClick={open}
                            src={src}
                            alt={`Image ${idx}`}
                            className="w-full h-80 object-cover rounded-xl cursor-zoom-in"
                        />
                    )}
                </Item>
            ))}
        </Gallery>
    );
};

export default LightboxGallery;
