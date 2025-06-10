// components/BlindboxTabs.tsx
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import useCreateBlindboxForm from "../hooks/useCreateBlindbox";
import useGetAllBlindBoxes from "../../allblindboxes/hooks/useGetAllBlindBoxes";
import { BlindBox, BlindBoxItemRequest, BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { GetProduct, TProductResponse } from "@/services/product-seller/typings";
import useGetAllProduct from "../../allproduct/hooks/useGetAllProduct";
import useCreateBlindboxItemForm from "../hooks/useCreateItem";
import { Rarity } from "@/const/products";
import { AddItemToBlindboxForm } from "@/components/blindboxform/addItems";
import CreateBlindbox from "@/components/blindboxform/createBlindBox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function BlindboxTabs() {
    const {
        onSubmit: onSubmitCreateBox,
    } = useCreateBlindboxForm();

    const [selectedBoxId, setSelectedBoxId] = useState<string>("");
    const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
    const [rarityRates, setRarityRates] = useState<Record<string, number>>({});
    const [items, setItems] = useState<BlindBoxItemRequest[]>([]);
    const { getAllProductApi } = useGetAllProduct()
    const [blindboxes, setBlindBox] = useState<BlindBoxListResponse>()
    const [products, setProducts] = useState<TProductResponse>()
    const { getAllBlindBoxesApi, isPending } = useGetAllBlindBoxes()
    const [rarityRateError, setRarityRateError] = useState<string | undefined>(undefined);

    const {
        onSubmit,
        error,
        setError,
    } = useCreateBlindboxItemForm(selectedBoxId, items, () => setItems([]), selectedRarities);


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
        pageSize: 5,
    })

    const [productParams, setProductParams] = useState<GetProduct>({
        pageIndex: 1,
        pageSize: 100,
        search: "",
        status: "",
        categoryId: "",
        sortBy: undefined,
        desc: undefined,
    })

    useEffect(() => {
        (async () => {
            const res = await getAllBlindBoxesApi(params)
            if (res) {
                setBlindBox(res.value.data);
                const boxIds = res.value.data.result.map((box: any) => box.id);
                console.log("Danh sách Box ID:", boxIds);
            }
        })()
    }, [params])

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

    const totalRarityRate = Object.entries(rarityRates)
        .filter(([rarity]) => selectedRarities.includes(rarity as Rarity))
        .reduce((sum, [_, rate]) => sum + Number(rate), 0);

    useEffect(() => {
        const total = selectedRarities.reduce((sum, rarity) => sum + (rarityRates[rarity] || 0), 0);

        if (total !== 100) {
            setRarityRateError("Tổng tỉ lệ các độ hiếm phải bằng 100%");
        } else {
            setRarityRateError(undefined);
        }
    }, [rarityRates, selectedRarities]);

    const addItem = () => {
        if (selectedRarities.length === 0) return;
        const rarity = selectedRarities[0];

        const totalRate = rarityRates[rarity] || 0;
        const sameRarityItems = items.filter((item) => item.rarity === rarity);
        const newCount = sameRarityItems.length + 1;

        const ratePerItem = parseFloat((totalRate / newCount).toFixed(4));

        const updatedItems = items.map((item) =>
            item.rarity === rarity
                ? { ...item, dropRate: ratePerItem }
                : item
        );

        updatedItems.push({
            productId: "",
            quantity: 1,
            dropRate: ratePerItem,
            rarity: rarity as Rarity,
        });

        setItems(updatedItems);
    };

    const handleRarityChange = (index: number, newRarity: string) => {
        if (!Object.values(Rarity).includes(newRarity as Rarity)) return;

        const updated = [...items];
        updated[index].rarity = newRarity as Rarity;

        const rarityGroups: Record<Rarity, BlindBoxItemRequest[]> = {
            [Rarity.Common]: [],
            [Rarity.Rare]: [],
            [Rarity.Epic]: [],
            [Rarity.Secret]: [],
        };

        updated.forEach(item => {
            if (Object.values(Rarity).includes(item.rarity)) {
                rarityGroups[item.rarity].push(item);
            }
        });

        const rateMap = new Map<string, number>();
        for (const rarity of Object.values(Rarity)) {
            const itemsOfRarity = rarityGroups[rarity];
            const totalRate = rarityRates[rarity] || 0;
            const perItemRate = itemsOfRarity.length > 0
                ? parseFloat((totalRate / itemsOfRarity.length).toFixed(4))
                : 0;
            itemsOfRarity.forEach(item => {
                rateMap.set(item.productId, perItemRate);
            });
        }

        const finalItems = updated.map(item => ({
            ...item,
            dropRate: rateMap.get(item.productId) ?? item.dropRate,
        }));

        setItems(finalItems);
    };



    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
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
                    <CreateBlindbox mode="create" onSubmitCreateBox={onSubmitCreateBox} />
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
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}
