'use client'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

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
        <div className="p-[75px] mt-16 flex ">
            <aside className="w-full md:w-1/4 p-4 border-r border-gray-200 space-y-6">
                    <div>
                        <h2 className="text-3xl font-normal mb-4 text-red-500">Danh Mục</h2>
                        <ul className="space-y-2 text-gray-700">
                        <li><a href="#" className="hover:text-red-500">Tất cả sản phẩm</a></li>
                        <Disclosure>
                            {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between w-full hover:text-red-500">
                                <span>Series túi mù</span>
                                <ChevronUpIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                                </Disclosure.Button>
                                <Disclosure.Panel className="pl-4 text-sm text-gray-600 space-y-1">
                                <a href="#">Molly</a>
                                <a href="#">Labubu</a>
                                </Disclosure.Panel>
                            </>
                            )}
                        </Disclosure>

                        <li><a href="#" className="hover:text-red-500">Gấu bông</a></li>
                        <li><a href="#" className="hover:text-red-500">Baby three</a></li>
                        <li><a href="#" className="hover:text-red-500">Hộp hiển thị</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Giá (₫)</h3>
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
                        <h3 className="text-lg font-semibold mb-2">Thương hiệu</h3>
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
            <main className="w-full p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product, index) => (
                    <div key={index} className="relative border rounded-lg p-2 shadow hover:shadow-md transition">
                        {/* Badge giảm giá */}
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-70%</span>

                        {/* Ảnh sản phẩm */}
                        <img src={product.image} alt={product.name} className="w-full h-auto rounded-md" />

                        {/* Nội dung */}
                        <div className="mt-2">
                        <h3 className="text-sm font-medium truncate">{product.name}</h3>
                        <p className="text-red-600 font-semibold">{product.price.toLocaleString()}₫</p>

                        <div className="mt-1 flex justify-between items-center">
                            <button className="text-sm px-3 py-1 bg-gray-800 text-white rounded hover:bg-black transition">Thêm vào giỏ hàng</button>
                            <button className="text-gray-400 hover:text-red-500">❤️</button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </main>
        </div>
    )
}