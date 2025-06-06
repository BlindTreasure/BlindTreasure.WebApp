import React from "react";

interface RibbonProps {
    createdAt: string;
}

const Ribbon: React.FC<RibbonProps> = ({ createdAt }) => {
    const isNew = (() => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffInDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    })();

    if (!isNew) return null;

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
            NEW
        </div>
    );
};

export default Ribbon;
