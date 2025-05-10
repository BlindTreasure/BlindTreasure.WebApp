
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Detail from "../components/detail";

export const metadata: Metadata = {
    title: "Detail",
    description: "Detail for BlindTreasure",
};

export default function DetailProp({ params }: any) {
    return (
         <div className="w-full">
            <Detail detailId={params?.detailid}/>
        </div>
    )
}