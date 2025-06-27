
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Detail from "../components/detail";
import { getRibbonTypes } from "@/utils/getRibbonTypes";

export const metadata: Metadata = {
    title: "Chi tiết sản phẩm",
    description: "Chi tiết sản phẩm của BlindTreasure",
};

export default function DetailProp({ params }: any) {
    return (
         <div className="w-full">
            <Detail detailId={params?.detailid}/>
        </div>
    )
}