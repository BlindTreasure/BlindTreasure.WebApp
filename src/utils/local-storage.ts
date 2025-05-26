export const getStorageItem = (
  key: string,
  defaultValue?: string
): string | undefined => {
  const value = localStorage.getItem(key);
  return value && value.trim() !== "" ? value : defaultValue;
};

  
  export const setStorageItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };
  
  export const removeStorageItem = (key: string): void => {
    localStorage.removeItem(key);
  };