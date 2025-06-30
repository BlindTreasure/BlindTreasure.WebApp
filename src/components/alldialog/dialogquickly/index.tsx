'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { Product } from '@/services/inventory-item/typings'
import { BlindBox } from '@/services/customer-inventory/typings'
import { Swiper as SwiperCore } from 'swiper/types'
import { stockStatusMap } from '@/const/products'

type QuickViewDialogProps =
    | { type: 'product'; data: Product }
    | { type: 'blindbox'; data: BlindBox }

export default function QuickViewDialog(props: QuickViewDialogProps) {
    const [open, setOpen] = useState(false)
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)

    const { type, data } = props
    const isProduct = type === 'product'
    const images = isProduct
        ? (data as Product).imageUrls
        : [(data as BlindBox).imageUrl]

    useEffect(() => {
        if (!open) {
            thumbsSwiper?.destroy(true, false)
            setThumbsSwiper(null)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="text-xs px-3 py-2 rounded-md"
                    onClick={() => setOpen(true)}
                >
                    Xem nhanh
                </Button>
            </DialogTrigger>

            <DialogContent
                className="max-w-4xl p-6"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Xem nhanh</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {open && (
                            <>
                                <Swiper
                                    spaceBetween={10}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    modules={[Thumbs]}
                                >
                                    {images.map((img, idx) => (
                                        <SwiperSlide key={`main-${idx}`}>
                                            <img
                                                src={img}
                                                alt={`Main ${idx}`}
                                                className="w-full h-80 object-cover rounded-xl"
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {images.length > 1 && (
                                    <div className="mt-4">
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            spaceBetween={10}
                                            slidesPerView={4}
                                            watchSlidesProgress
                                            modules={[Thumbs, Navigation]}
                                            navigation
                                        >
                                            {images.map((img, idx) => (
                                                <SwiperSlide key={`thumb-${idx}`}>
                                                    <img
                                                        src={img}
                                                        alt={`Thumb ${idx}`}
                                                        className="w-full h-20 object-cover rounded-md cursor-pointer border hover:border-black"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="space-y-2 text-sm">
                        <h2 className="text-2xl font-semibold">{data.name}</h2>
                        <p className="text-muted-foreground">{data.description}</p>
                        <p className="text-red-600 font-bold text-3xl">
                            {data.price.toLocaleString('vi-VN')}₫
                        </p>

                        {!isProduct && (
                            <div>Loại: Blindbox</div>
                        )}

                        {isProduct ? (
                            <>
                                <div>Thương hiệu: {(data as Product).brand}</div>
                                <div>Chất liệu: {(data as Product).material}</div>
                                <div>Chiều cao: {(data as Product).height} cm</div>
                                <div>
                                    Tình trạng kho:{' '}
                                    {stockStatusMap[(data as Product).productStockStatus]}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>Tổng số lượng: {(data as BlindBox).totalQuantity}</div>
                                <div>
                                    Tình trạng kho:{' '}
                                    {stockStatusMap[(data as BlindBox).blindBoxStockStatus]}
                                </div>
                                <div>
                                    Ngày phát hành:{' '}
                                    {new Date((data as BlindBox).releaseDate).toLocaleDateString(
                                        'vi-VN'
                                    )}
                                </div>
                                <div>
                                    Có vật phẩm bí mật:{' '}
                                    {(data as BlindBox).hasSecretItem ? 'Có' : 'Không'}
                                </div>
                                {(data as BlindBox).hasSecretItem && (
                                    <div>
                                        Tỉ lệ ra vật phẩm bí mật:{' '}
                                        {(data as BlindBox).secretProbability}%
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
