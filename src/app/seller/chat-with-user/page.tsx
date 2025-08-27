import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ChatWithUser from './components/chat-with-user';

export const metadata: Metadata = {
    title: "Nhắn tin với khách hàng",
    description: "Nhắn tin với khách hàng BlindTreasure",
};
export default function ChatWithUserPage() {
    return (
        <div>
            <ChatWithUser />
        </div>
    )
}
