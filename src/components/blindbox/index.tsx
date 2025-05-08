import React from "react";

interface RibbonProps {
    type: "new" | "sale" | "blindbox";
    percent?: number;
}

const Ribbon: React.FC<RibbonProps> = ({ type, percent }) => {
    if (type === "blindbox") {
        if (percent === undefined) return null;
        const isSale = percent > 0;
        const text = isSale ? `-${percent}%` : "NEW";

        return (
            <div
                className="absolute top-2 right-[-2px] text-white text-[13px] font-semibold leading-tight px-3 py-3 z-20"
                style={{
                    background: "#d02a2a",
                    borderLeft: "15px solid transparent",
                    borderBottom: "10px solid rgba(0,0,0,0.3)",
                    clipPath:
                        "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,calc(100% - 10px) calc(100% - 10px),0 calc(100% - 10px),15px calc(50% - 5px))",
                }}
            >
                {text}
            </div>
        );
    }

    if (type === "sale" || type === "new") {
        const isSale = type === "sale";
        const text = isSale ? `-${percent}%` : "NEW";
       
        return (
            <div
                className="absolute top-2 right-[-2px] text-white text-[13px] font-semibold leading-tight px-3 py-3 z-20"
                style={{
                    background: "#d02a2a",
                    borderLeft: "15px solid transparent",
                    borderBottom: "10px solid rgba(0,0,0,0.3)",
                    clipPath:
                        "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,calc(100% - 10px) calc(100% - 10px),0 calc(100% - 10px),15px calc(50% - 5px))",
                }}
            >
                {text}
            </div>
        );
    }
    return null;
};

export default Ribbon;
