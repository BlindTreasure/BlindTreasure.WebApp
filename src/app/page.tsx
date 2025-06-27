
// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useAppSelector } from '@/stores/store';
// import UserLayout from './(user)/layout';
// import HomePage from './(user)/homepage/components/home';

// export default function RootRedirect() {
//   const router = useRouter();
//   const user = useAppSelector((state) => state.userSlice.user);

//   useEffect(() => {
//     if (!user) return;

//     switch (user.roleName) {
//       case 'Staff':
//         router.replace('/staff/dashboard');
//         break;
//       case 'Admin':
//         router.replace('/admin/dashboard');
//         break;
//       case 'Seller':
//         router.replace('/seller/dashboard');
//         break;
//     }
//   }, [user]);

//   if (user?.roleName === 'Customer') {
//     return (
//       <UserLayout>
//         <HomePage />
//       </UserLayout>
//     );
//   }

//   if (!user) {
//     return (
//       <UserLayout>
//         <HomePage />
//       </UserLayout>
//     );
//   }

//   return null;
// }

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/stores/store';
import UserLayout from './(user)/layout';
import HomePage from './(user)/homepage/components/home';
import useInitialAuth from '@/hooks/use-initial-auth';

export default function RootRedirect() {
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
  }, [user]);

  if (loading) return null; // hoặc spinner

  if (user?.roleName === 'Customer') {
    return (
      <UserLayout>
        <HomePage />
      </UserLayout>
    );
  }

  if (!user) {
    return (
      <UserLayout>
        <HomePage />
      </UserLayout>
    );
  }

  return null;
}
