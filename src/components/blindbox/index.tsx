import React from "react";

interface RibbonProps {
    createdAt: string;
    types: ("new" | "sale" | "blindbox" | "product")[];
}

const Ribbon: React.FC<RibbonProps> = ({ createdAt, types }) => {
    const isNew = (() => {
        if (!createdAt) return false;
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffInDays =
            (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    })();

    const filteredTypes = types.filter((type) => {
        if (type === "new") return isNew;
        return true;
    });

    if (filteredTypes.length === 0) return null;

    // priority: new > sale > blindbox > product
    const priorityOrder: ("new" | "sale" | "blindbox" | "product")[] = [
        "new",
        "sale",
        "blindbox",
        "product",
    ];

    const labelMap: Record<typeof priorityOrder[number], string> = {
        new: "NEW",
        sale: "SALE",
        blindbox: "BLINDBOX",
        product: "PRODUCT",
    };

    const orderedLabels = priorityOrder
        .filter((key) => filteredTypes.includes(key))
        .map((key) => labelMap[key]);

    // chọn màu theo tag có priority cao nhất
    const backgroundColor = filteredTypes.includes("new")
        ? "#d02a2a"
        : filteredTypes.includes("sale")
        ? "#FF5722"
        : filteredTypes.includes("blindbox")
        ? "#4A90E2"
        : "#8BC34A";

    return (
        <div
            className="absolute top-2 right-[-2px] text-white text-[13px] font-semibold leading-tight px-3 py-3 z-20"
            style={{
                background: backgroundColor,
                borderLeft: "15px solid transparent",
                borderBottom: "10px solid rgba(0,0,0,0.3)",
                clipPath:
                    "polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,calc(100% - 10px) calc(100% - 10px),0 calc(100% - 10px),15px calc(50% - 5px))",
            }}
        >
            {orderedLabels.join(" ")}
        </div>
    );
};

export default Ribbon;
