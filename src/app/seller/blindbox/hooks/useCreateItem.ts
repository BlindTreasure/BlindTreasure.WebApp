import { Rarity, RarityText } from "@/const/products";
import { useServiceCreateBlindboxItems } from "@/services/blindboxes/services";
import { BlindBoxItemRequest } from "@/services/blindboxes/typings";
import { useState } from "react";

export default function useCreateBlindboxItemForm(
  blindboxesId: string,
  items: BlindBoxItemRequest[],
  clearItems: () => void,
  resetFormFields: () => void,
  selectedRarities: Rarity[],
  setTotalItems: (value: number | undefined) => void 
) {
  const { mutate, isPending } = useServiceCreateBlindboxItems();
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = () => {
    if (!items.length || !blindboxesId) return;

    const rarityCountMap = selectedRarities.reduce((acc, rarity) => {
      acc[rarity] = items.filter((item) => item.rarity === rarity).length;
      return acc;
    }, {} as Record<Rarity, number>);

    const missingRarities = selectedRarities.filter(
      (rarity) => rarityCountMap[rarity] === 0
    );

    if (missingRarities.length > 0) {
      setError(
        `Vui lòng thêm ít nhất 1 sản phẩm cho các độ hiếm: ${missingRarities
          .map((r) => RarityText[r])
          .join(", ")}`
      );
      return;
    }
    setError(undefined);

    try {
      mutate(
        {
          blindboxesId,
          items,
        },
        {
          onSuccess: () => {
            clearItems();
            resetFormFields();
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {
    onSubmit,
    isPending,
    error,
    setError,
  };
}
