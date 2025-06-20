import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  categoryId: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  releaseDateFrom: string | undefined;
  releaseDateTo: string | undefined;
  selectedCategoryId?: string | undefined
}

const initialState: FilterState = {
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  releaseDateFrom: undefined,
  releaseDateTo: undefined,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategoryId: (state, action: PayloadAction<string | undefined>) => {
      state.categoryId = action.payload;
    },
    setMinPrice: (state, action: PayloadAction<number | undefined>) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action: PayloadAction<number | undefined>) => {
      state.maxPrice = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number | undefined; max: number | undefined }>) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setReleaseDateFrom: (state, action: PayloadAction<string | undefined>) => {
      state.releaseDateFrom = action.payload;
    },
    setReleaseDateTo: (state, action: PayloadAction<string | undefined>) => {
      state.releaseDateTo = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ from: string | undefined; to: string | undefined }>) => {
      state.releaseDateFrom = action.payload.from;
      state.releaseDateTo = action.payload.to;
    },
    clearFilters: () => initialState,
    clearFiltersExceptCategory: (state) => {
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.releaseDateFrom = undefined;
      state.releaseDateTo = undefined;
    },
  },
});

export const {
  setCategoryId,
  setMinPrice,
  setMaxPrice,
  setPriceRange,
  setReleaseDateFrom,
  setReleaseDateTo,
  setDateRange,
  clearFilters,
  clearFiltersExceptCategory
} = filterSlice.actions;

export default filterSlice.reducer;