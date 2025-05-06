'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Auth({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [hasAccessToken, setHasAccessToken] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            router.push('/');
        } else {
            setHasAccessToken(false);
        }
    }, [router]);

    return <main>{children}</main>;
}
