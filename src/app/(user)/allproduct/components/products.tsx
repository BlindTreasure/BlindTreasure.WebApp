'use client'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import HeartToggle from "@/components/heart-toggle";
import PaginationBar from "@/components/pagination";

export default function AllProduct() {
    const products = [
        {
          name: "MEGA SPACE MOLLY 400%",
          price: 5420000,
          image: "/images/blindbox_2.jpg"
        },
        {
            name: "MEGA SPACE MOLLY 400%",
            price: 5420000,
            image: "/images/blindbox_2.jpg"
          },
          {
            name: "MEGA SPACE MOLLY 400%",
            price: 5420000,
            image: "/images/blindbox_2.jpg"
          },
          {
            name: "MEGA SPACE MOLLY 400%",
            price: 5420000,
            image: "/images/blindbox_2.jpg"
          },
          {
            name: "MEGA SPACE MOLLY 400%",
            price: 5420000,
            image: "/images/blindbox_2.jpg"
          },
          {
            name: "MEGA SPACE MOLLY 400%",
            price: 5420000,
            image: "/images/blindbox_2.jpg"
          },
    ];
    return(
        <div className="lg:p-[75px] mt-16 flex">
            <aside className="w-full md:w-1/4 p-4 space-y-6">
                <div>
                    <h2 className="text-2xl font-normal mb-4 text-red-500">Danh Mục</h2>
                    <ul className="space-y-2 text-gray-700">
                    <li><a href="#" className="hover:text-red-500">Tất cả sản phẩm</a></li>
                        <Disclosure>
                        {({ open }) => (
                        <div>
                            <Disclosure.Button className="flex justify-between w-full hover:text-red-500">
                            <span>Series túi mù</span>
                            <ChevronUpIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pl-4 text-sm text-gray-600 space-y-1">
                            <a href="#">Molly</a>
                            <a href="#">Labubu</a>
                            </Disclosure.Panel>
                        </div>
                        )}
                    </Disclosure>

                    <li><a href="#" className="hover:text-red-500">Gấu bông</a></li>
                    <li><a href="#" className="hover:text-red-500">Baby three</a></li>
                    <li><a href="#" className="hover:text-red-500">Hộp hiển thị</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold mb-2">Giá (₫)</h3>
                    <form className="space-y-2 text-sm text-gray-700">
                    {[
                        "Dưới 200.000đ",
                        "200.000 - 500.000đ",
                        "500.000 - 1.000.000đ",
                        "1.000.000 - 2.000.000đ",
                        "2.000.000 - 4.000.000đ",
                        "Trên 4.000.000đ"
                    ].map((label, i) => (
                        <label key={i} className="flex items-center space-x-2">
                        <input type="radio" name="price" className="accent-red-500" />
                        <span>{label}</span>
                        </label>
                    ))}
                    </form>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold mb-2">Thương hiệu</h3>
                    <form className="space-y-2 text-sm text-gray-700">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="accent-red-500" />
                        <span>44 Cats</span>
                    </label>

                    <Disclosure>
                        {({ open }) => (
                            <div>
                            <Disclosure.Button className="flex justify-between items-center w-full hover:text-red-500">
                                <div className="flex items-center space-x-2">
                                <input type="checkbox" className="accent-red-500" />
                                <span>Avengers</span>
                                </div>
                                <ChevronUpIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                            </Disclosure.Button>
                                
                            <Disclosure.Panel className="pl-7 text-xs text-gray-600 space-y-1">
                                <a href="#">Iron Man</a>
                                <a href="#">Thor</a>
                            </Disclosure.Panel>
                            </div>
                        )}
                        </Disclosure>

                    {["Dragon", "Batman", "Tobot"].map((brand, i) => (
                        <label key={i} className="flex items-center space-x-2">
                        <input type="checkbox" className="accent-red-500" />
                        <span>{brand}</span>
                        </label>
                    ))}
                    </form>
                </div>
            </aside>
            <main className="w-full p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                    <div
                        key={index}
                        className="relative bg-white rounded-2xl shadow hover:shadow-lg transition"
                    >
                        <span className="absolute top-2 right-2 bg-[#d02a2a] text-white text-xs font-semibold px-2 py-1 rounded">
                        -70%
                        </span>

                        <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        />

                        <div className="p-4">
                        <h3 className="text-xl font-semibold text-[#252424] truncate">
                            {product.name}
                        </h3>
                        <p className="text-[#d02a2a] font-bold text-2xl">
                            {product.price.toLocaleString()}₫
                        </p>

                        <div className="mt-4 flex justify-between items-center">
                            <button
                                className="inline-block cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-zinc-600 bg-zinc-950 px-5 py-3 font-medium text-slate-200 shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl"
                                >
                                Thêm vào giỏ hàng   
                                </button>
                             <HeartToggle />
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                
                <PaginationBar />

            </main>
        </div>
    )
}