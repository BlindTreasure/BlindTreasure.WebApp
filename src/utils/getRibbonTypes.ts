const isNewItem = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
};

export const getRibbonTypes = (item: any): ("new" | "sale" | "blindbox")[] => {
  const isBlindbox = !("productType" in item);
  const createdAt = item.createdAt || item.releaseDate;
  const isNew = isNewItem(createdAt);
  const hasSale =
    !isBlindbox && item.listedPrice != null && item.listedPrice > 0;

  if (isNew) return ["new"];
  if (hasSale) return ["sale"];
  if (isBlindbox) return ["blindbox"];
  return [];
};
