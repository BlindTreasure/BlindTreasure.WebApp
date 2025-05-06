import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Error from "./error"

export const metadata: Metadata = {
    title: "Error",
    description: "Error page",
};
export default function ErrorPage() {
    return (
        <div>
            <Error />
        </div>
    )
}
