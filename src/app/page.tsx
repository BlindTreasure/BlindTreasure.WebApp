'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAppSelector } from '@/stores/store';
import UserLayout from './(user)/layout';
import HomePage from './(user)/homepage/components/home';
import useInitialAuth from '@/hooks/use-initial-auth';

// Thêm loading UI để tránh blank space
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    <span className="ml-3 text-gray-700">Đang tải...</span>
  </div>
);

// Tách Home Component để có thể sử dụng với Suspense
const HomeComponent = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.userSlice.user);
  const { loading } = useInitialAuth({ redirectIfUnauthenticated: false });

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
    }
  }, [user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user?.roleName === 'Customer' || !user) {
    return (
      <UserLayout>
        <HomePage />
      </UserLayout>
    );
  }

  return <LoadingSpinner />;
};

export default function RootRedirect() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeComponent />
    </Suspense>
  );
}
