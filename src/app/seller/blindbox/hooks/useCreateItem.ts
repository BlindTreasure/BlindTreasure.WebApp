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
  setTotalItems: (value: number | undefined) => void,
  rarityRates: Record<string, number>
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

    // Validate weight totals for each rarity
    const weightValidationErrors: string[] = [];
    selectedRarities.forEach((rarity) => {
      const rarityItems = items.filter((item) => item.rarity === rarity);
      const totalWeight = rarityItems.reduce(
        (sum, item) => sum + (item.weight || 0),
        0
      );
      const expectedWeight = rarityRates[rarity] || 0;

      if (totalWeight !== expectedWeight) {
        weightValidationErrors.push(
          `${RarityText[rarity]}: tổng trọng số ${totalWeight} ≠ tỷ lệ ${expectedWeight}`
        );
      }
    });

    if (weightValidationErrors.length > 0) {
      setError(
        `Trọng số không khớp với tỷ lệ đã set:\n${weightValidationErrors.join(
          "\n"
        )}`
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
    }
  };

  return {
    onSubmit,
    isPending,
    error,
    setError,
  };
}
