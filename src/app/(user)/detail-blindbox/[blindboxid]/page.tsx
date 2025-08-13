
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import BlindboxDetail from "../components/detail-blindbox";
import { getRibbonTypes } from "@/utils/getRibbonTypes";

export const metadata: Metadata = {
    title: "Chi tiết túi mù",
    description: "Chi tiết túi mù của BlindTreasure",
};

export default function BlindboxProp({ params }: any) {
    return (
         <div className="w-full">
            <BlindboxDetail blindBoxId={params?.blindboxid}/>
        </div>
    )
}