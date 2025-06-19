"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStorageItem } from "@/utils/local-storage"; 

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = getStorageItem("accessToken");
        if (!token) {
            router.replace("/login"); 
        }
    }, []);

    return <>{children}</>;
}
