import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
    cartItemId: string;
    productId?: string;
    blindBoxId?: string;
    name: string;
    image: string;
    price: number;
    type: string;
    salePrice?: number;
    quantity: number;
    availableStock: number;
    addedAt: string;
    isValid: boolean;
}