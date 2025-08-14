import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Error404Page from './404';

export const metadata: Metadata = {
    title: "Không tìm thấy trang | BlindTreasure",
    description: "Không tìm thấy trang BlindTreasure",
};
export default function ErrorPage() {
    return (
        <div>
            <Error404Page />
        </div>
    )
}
