
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import BlindboxDetail from "../components/detail-blindbox";

export const metadata: Metadata = {
    title: "Chi tiết tùi mù",
    description: "Chi tiết túi mù của BlindTreasure",
};

export default function BlindboxProp({ params }: any) {
    return (
         <div className="w-full">
            <BlindboxDetail blindBoxId={params?.blindboxid}/>
        </div>
    )
}