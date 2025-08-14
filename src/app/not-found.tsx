"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Backdrop } from '@/components/backdrop';

export default function NotFound() {
    const router = useRouter();
    const [isRedirecting] = useState(true);

    useEffect(() => {
        router.replace('/404');
    }, [router]);

    return <Backdrop open={isRedirecting} />;
}
