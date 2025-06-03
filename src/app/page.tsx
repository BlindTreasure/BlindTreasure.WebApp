
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/stores/store';

export default function RootRedirect() {
  const router = useRouter();
  const user = useAppSelector((state) => state.userSlice.user);

  useEffect(() => {
    if (!user) return;

    switch (user.roleName) {
      case 'Staff':
        router.replace('/staff/dashboard');
        break;
      case 'Admin':
        router.replace('/admin/dashboard');
        break;
      case 'Seller':
        router.replace('/seller/dashboard');
        break;
      case 'Customer':
      default:
        router.replace('/');
        break;
    }
  }, [user]);

  return null;
}
