'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';
import Basic from '@/components/tabs-seller/Basic';
import { TabWrapper } from '@/components/tabs-seller/TabWrapper';
import Detail from '@/components/tabs-seller/Detail';
import Sales from '@/components/tabs-seller/Sales';
import Delivery from '@/components/tabs-seller/Delivery';

const TABS = ['Thông tin cơ bản', 'Thông tin chi tiết', 'Thông tin bán hàng', 'Vận chuyển', 'Thông tin khác'];

export default function CreateProductSeller() {
    const [currentTab, setCurrentTab] = useState(TABS[0]);

    const sectionRefs = useRef<Record<string, HTMLElement | null>>(
        TABS.reduce((acc, tab) => {
            acc[tab] = null;
            return acc;
        }, {} as Record<string, HTMLElement | null>)
    );

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY; 
            for (const tab of TABS) {
                const section = sectionRefs.current[tab];
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < bottom) {
                        setCurrentTab(tab);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const handleClickTab = (tab: string) => {
        setCurrentTab(tab);
        const section = sectionRefs.current[tab];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="sticky top-0 bg-white z-50 border-b border-gray-200">
                <TabWrapper tabs={TABS} currentTab={currentTab} onClickTab={handleClickTab} />
            </div>

            <section
                ref={(el) => {
                    sectionRefs.current['Thông tin cơ bản'] = el;
                }}
                id="Thông tin cơ bản"
               className="bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
                <Basic />
            </section>

            <section
                ref={(el) => {
                    sectionRefs.current['Thông tin chi tiết'] = el;
                }}
                id="Thông tin chi tiết"
                className="bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
                <Detail />
            </section>

            <section
                ref={(el) => {
                    sectionRefs.current['Thông tin bán hàng'] = el;
                }}
                id="Thông tin bán hàng"
                className="bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold mb-4">Thông tin bán hàng</h2>
                <Sales />
            </section>

            <section
                ref={(el) => {
                    sectionRefs.current['Vận chuyển'] = el;
                }}
                id="Vận chuyển"
                className="bg-white rounded-lg shadow-md p-6"
            >
                <h2 className="text-xl font-semibold mb-4">Vận chuyển</h2>
                <Delivery />
            </section>
        </div>
    );
}
