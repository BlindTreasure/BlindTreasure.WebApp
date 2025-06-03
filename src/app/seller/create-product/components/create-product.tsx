// 'use client';

// import { useState, useEffect, useRef, MutableRefObject } from 'react';
// import Basic from '@/components/tabs-seller/Basic';
// import { TabWrapper } from '@/components/tabs-seller/TabWrapper';
// import Detail from '@/components/tabs-seller/Detail';
// import useGetCategory from '@/app/staff/category-management/hooks/useGetCategory';
// import useCreateProductForm from '../hooks/useCreateProduct';
// import { Button } from '@/components/ui/button';
// import { Backdrop } from '@/components/backdrop';
// import { CreateProductForm } from '@/services/product/typings';

// const TABS = ['Thông tin cơ bản', 'Thông tin chi tiết'];

// export default function CreateProductSeller() {
//     const {
//         register,
//         handleSubmit,
//         onSubmit: onSubmitHook,
//         errors,
//         setValue,
//         reset,
//         watch,
//         isPending,
//     } = useCreateProductForm();

//     const onSubmit = (data: CreateProductForm) => {
//         onSubmitHook(data, clearImages);
//     };

//     const [currentTab, setCurrentTab] = useState(TABS[0]);
//     const [images, setImages] = useState<File[]>([]);
//     const [clearSignal, setClearSignal] = useState(0);
//     const [categories, setCategories] = useState<API.ResponseDataCategory>();
//     const { getCategoryApi } = useGetCategory();

//     const sectionRefs = useRef<Record<string, HTMLElement | null>>(
//         TABS.reduce((acc, tab) => {
//             acc[tab] = null;
//             return acc;
//         }, {} as Record<string, HTMLElement | null>)
//     );

//     useEffect(() => {
//         (async () => {
//             const res = await getCategoryApi({});
//             if (res) {
//                 setCategories(res.value.data || []);
//             }
//         })();
//     }, []);

//     const handleClickTab = (tab: string) => {
//         setCurrentTab(tab);
//         const section = sectionRefs.current[tab];
//         if (section) {
//             section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         }
//     };

//     const clearImages = () => {
//         setClearSignal(prev => prev + 1);
//     };

//     return (
//         <div className="p-6 space-y-8">
//             <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
//                 <TabWrapper tabs={TABS} currentTab={currentTab} onClickTab={handleClickTab} />
//             </div>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className='space-y-8'>
//                     <section
//                         ref={(el) => {
//                             sectionRefs.current['Thông tin cơ bản'] = el;
//                         }}
//                         id="Thông tin cơ bản"
//                         className="bg-white rounded-lg shadow-md p-6"
//                     >
//                         <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
//                         <Basic
//                             register={register}
//                             setValue={setValue}
//                             errors={errors}
//                             watch={watch}
//                             clearSignal={clearSignal} />
//                     </section>

//                     <section
//                         ref={(el) => {
//                             sectionRefs.current['Thông tin chi tiết'] = el;
//                         }}
//                         id="Thông tin chi tiết"
//                         className="bg-white rounded-lg shadow-md p-6"
//                     >
//                         <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
//                         <Detail categories={categories}
//                             register={register}
//                             errors={errors}
//                             setValue={setValue}
//                             watch={watch} />
//                     </section>
//                 </div>

//                 <div className="flex justify-end gap-4 mt-6">
//                     <Button
//                         type="button"
//                         onClick={() => {
//                             reset();
//                             clearImages();
//                         }}
//                         className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-300"
//                     >
//                         Hủy
//                     </Button>
//                     <Button
//                         type="submit"
//                         className="px-4 py-2 bg-[#d02a2a] text-white rounded hover:bg-opacity-80"
//                     >
//                         Lưu
//                     </Button>
//                 </div>
//             </form>
//             <Backdrop open={isPending} />
//         </div>
//     );
// }

'use client';

import { CreateProductForm } from '@/services/product-seller/typings';
import useCreateProductForm from '../hooks/useCreateProduct';
import ProductForm from '@/components/product-form';

export default function CreateProductSeller() {
  const {
    onSubmit: onSubmitHook,
    isPending,
  } = useCreateProductForm();

  const handleCreate = (data: CreateProductForm, clearImages: () => void) => {
    onSubmitHook(data, clearImages);
  };

  return <ProductForm onSubmit={handleCreate} isPending={isPending} />;
}
