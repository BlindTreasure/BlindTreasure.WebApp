const isNewItem = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
};

export const getRibbonTypes = (item: any): ("new" | "sale" | "blindbox")[] => {
  const isBlindbox = !("productType" in item);
  const createdAt = item.createdAt || item.releaseDate;
  const isNew = isNewItem(createdAt);

  if (isNew) return ["new"];
  if (isBlindbox) return ["blindbox"];
  return []; 
};
