import { create } from 'zustand';
import api from '@/lib/api';

interface CartItem {
  id?: string;
  _id?: string;
  productId: {
    _id: string;
    name: string;
    salePrice: number;
    mrp: number;
    images?: { url: string }[];
  };
  quantity: number;
  priceAtAddition: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      const fetchedItems = res.data.cart?.items || res.data.data?.cart?.items || [];
      const normalizedItems = fetchedItems.map((item: any) => ({
        ...item,
        id: item._id,
        productId: item.product || item.productId
      }));
      set({ items: normalizedItems, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number = 1, variantId?: string) => {
    try {
      await api.post('/cart/items', { productId, quantity, variantId });
      // Re-fetch cart
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await get().removeFromCart(itemId);
        return;
      }
      await api.put(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  }
}));
