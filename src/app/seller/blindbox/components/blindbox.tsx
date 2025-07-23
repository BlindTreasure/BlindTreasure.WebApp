// components/BlindboxTabs.tsx
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import useGetAllBlindBoxes from "../../allblindboxes/hooks/useGetAllBlindBoxes";
import { BlindBoxItemRequest, BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { GetProduct, TProductResponse } from "@/services/product-seller/typings";
import useGetAllProduct from "../../allproduct/hooks/useGetAllProduct";
import useCreateBlindboxItemForm from "../hooks/useCreateItem";
import { ProductStatus, Rarity } from "@/const/products";
import { AddItemToBlindboxForm } from "@/components/blindboxform/addItems";
import CreateBlindbox from "@/components/blindboxform/createBlindBox";

export default function BlindboxTabs() {
    const [selectedBoxId, setSelectedBoxId] = useState<string>("");
    const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
    const [rarityRates, setRarityRates] = useState<Record<string, number>>({});
    const [items, setItems] = useState<BlindBoxItemRequest[]>([]);
    const { getAllProductApi } = useGetAllProduct()
    const [blindboxes, setBlindBox] = useState<BlindBoxListResponse>()
    const [products, setProducts] = useState<TProductResponse>()
    const { getAllBlindBoxesApi, isPending } = useGetAllBlindBoxes()
    const [rarityRateError, setRarityRateError] = useState<string | undefined>(undefined);
    const [totalItemsToAdd, setTotalItemsToAdd] = useState<number | null>(null);
    const [totalItems, setTotalItems] = useState<number | undefined>();
    const [selectKey, setSelectKey] = useState(0);

    const resetFormFields = () => {
        setSelectedBoxId("");
        setSelectedRarities([]);
        setRarityRates({});
        setTotalItemsToAdd(null);
        setTotalItems(undefined);
        setSelectKey((prev) => prev + 1);
    };

    const {
        onSubmit,
        error,
        setError,
    } = useCreateBlindboxItemForm(selectedBoxId, items, resetFormFields, () => setItems([]), selectedRarities, setTotalItems, rarityRates);

    const [params, setParams] = useState<GetBlindBoxes>({
        search: "",
        SellerId: "",
        categoryId: "",
        status: "",
        minPrice: undefined,
        maxPrice: undefined,
        ReleaseDateFrom: "",
        ReleaseDateTo: "",
        pageIndex: 1,
        pageSize: 100,
    })

    const [productParams, setProductParams] = useState<GetProduct>({
        pageIndex: 1,
        pageSize: 100,
        search: "",
        productStatus: ProductStatus.Active,
        categoryId: "",
        sortBy: undefined,
        desc: undefined,
    })

    const fetchBlindboxes = async () => {
        const res = await getAllBlindBoxesApi(params);

        if (res) {
            setBlindBox(res.value.data);
        }
    };


    useEffect(() => {
        fetchBlindboxes();
    }, [params]);



    useEffect(() => {
        (async () => {
            const res = await getAllProductApi(productParams)
            if (res) setProducts(res.value.data)
        })()
    }, [productParams])


    const handleItemChange = (
        index: number,
        field: keyof BlindBoxItemRequest,
        value: string | number
    ) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        setItems(updatedItems);
    };

    function initializeWeights(
        items: BlindBoxItemRequest[],
        rarityRates: Record<Rarity, number>
    ): BlindBoxItemRequest[] {
        const rarityGroups: Record<Rarity, BlindBoxItemRequest[]> = {
            [Rarity.Common]: [],
            [Rarity.Rare]: [],
            [Rarity.Epic]: [],
            [Rarity.Secret]: [],
        };

        items.forEach(item => {
            rarityGroups[item.rarity]?.push(item);
        });

        return items.map(item => {
            if (item.weight === undefined || item.weight === 0) {
                const group = rarityGroups[item.rarity];
                const rarityRate = rarityRates[item.rarity] || 0;
                const initialWeight = group.length > 0
                    ? Math.floor(rarityRate / group.length)
                    : 0;

                return {
                    ...item,
                    weight: Math.max(initialWeight, 1), 
                };
            }

            return item;
        });
    }

    const isRarityRatesValid = () => {
        const total = selectedRarities.reduce((sum, rarity) => sum + (rarityRates[rarity] || 0), 0);
        const allSet = selectedRarities.every(rarity => rarityRates[rarity] !== undefined);
        return total === 100 && allSet;
    };

    useEffect(() => {
        const total = selectedRarities.reduce((sum, rarity) => sum + (rarityRates[rarity] || 0), 0);
        const allSet = selectedRarities.every(r => rarityRates[r] !== undefined && rarityRates[r] > 0);
        const validateRarityRules = () => {
            if (!selectedRarities.includes(Rarity.Secret)) {
                return "Bắt buộc phải có độ hiếm 'Cực hiếm'";
            }
            return null;
        };

        const rarityError = validateRarityRules();

        if (total !== 100 || !allSet) {
            setRarityRateError("Tổng tỉ lệ các độ hiếm phải bằng 100% và tất cả phải có giá trị");
            if (items.length > 0) {
                setItems([]);
            }
        } else if (rarityError) {
            setRarityRateError(rarityError);
            if (items.length > 0) {
                setItems([]);
            }
        } else {
            setRarityRateError(undefined);
        }
    }, [rarityRates, selectedRarities]);

    const addItem = () => {
        if (!isRarityRatesValid()) {
            setRarityRateError("Tổng tỉ lệ các độ hiếm phải bằng 100% và tất cả phải được nhập");
            return;
        }

        if (selectedRarities.length === 0 || totalItemsToAdd === null) return;

        const rarity = selectedRarities[0];

        const itemsLeft = totalItemsToAdd - items.length;
        if (itemsLeft <= 0) return;

        const newItems: BlindBoxItemRequest[] = Array.from({ length: itemsLeft }, () => ({
            productId: "",
            quantity: 1,
            weight: 0,
            rarity,
        }));

        const updatedItems = initializeWeights([...items, ...newItems], rarityRates);
        setItems(updatedItems);
    };


    const handleRarityChange = (index: number, newRarity: string) => {
        if (!Object.values(Rarity).includes(newRarity as Rarity)) return;

        const updated = [...items];
        updated[index].rarity = newRarity as Rarity;

        const finalItems = initializeWeights(updated, rarityRates);
        setItems(finalItems);
    };


    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(initializeWeights(updatedItems, rarityRates));
    };

    if (!blindboxes || !products) {
        return <div className="p-4">Đang tải dữ liệu túi mù và sản phẩm...</div>;
    }
    return (
        <Tabs defaultValue="blindbox" className="w-full">
            <TabsList className="grid max-w-[400px] grid-cols-2 h-14 gap-2">
                <TabsTrigger
                    value="blindbox"
                    className="data-[state=active]:bg-black data-[state=active]:text-white h-12 bg-white"
                >
                    Tạo túi mù
                </TabsTrigger>
                <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-black data-[state=active]:text-white h-12 bg-white"
                >
                    Thêm sản phẩm vào túi
                </TabsTrigger>
            </TabsList>
            <div className="shadow-lg rounded-lg bg-white border border-gray-200 p-8">
                <TabsContent value="blindbox">
                    <h2 className="text-xl font-semibold mb-4">Thông tin túi mù</h2>
                    <CreateBlindbox
                        mode="create"
                        onSuccess={() => {
                            setTimeout(() => {
                                setParams({
                                    search: "",
                                    SellerId: "",
                                    categoryId: "",
                                    status: "",
                                    minPrice: undefined,
                                    maxPrice: undefined,
                                    ReleaseDateFrom: "",
                                    ReleaseDateTo: "",
                                    pageIndex: 1,
                                    pageSize: 100,
                                });
                            }, 500);
                        }}
                    />
                </TabsContent>

                <TabsContent value="items">
                    <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm trong túi</h2>
                    <AddItemToBlindboxForm
                        blindboxes={blindboxes}
                        products={products}
                        selectedBoxId={selectedBoxId}
                        setSelectedBoxId={setSelectedBoxId}
                        selectedRarities={selectedRarities}
                        setSelectedRarities={setSelectedRarities}
                        rarityRates={rarityRates}
                        setRarityRates={setRarityRates}
                        items={items}
                        handleItemChange={handleItemChange}
                        handleRarityChange={handleRarityChange}
                        removeItem={removeItem}
                        addItem={addItem}
                        onSubmit={onSubmit}
                        isPending={isPending}
                        error={error}
                        setError={setError}
                        rarityRateError={rarityRateError}
                        setrarityRateError={setRarityRateError}
                        onTotalItemsChange={(value) => {
                            setTotalItems(value);
                            setTotalItemsToAdd(value ?? null);
                        }}
                        totalItemsToAdd={totalItemsToAdd}
                        totalItems={totalItems}
                        selectKey={selectKey}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}
