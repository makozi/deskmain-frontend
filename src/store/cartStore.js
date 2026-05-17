import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart Store - Manages shopping cart state
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      totalPrice: 0,
      totalItems: 0,

      // Actions
      /**
       * Add item to cart
       */
      addItem: (product, quantity = 1, variant = null) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product_id === product.id && item.variant_id === variant?.id
          );

          let newItems;
          if (existingItem) {
            // Update quantity if item exists
            newItems = state.items.map((item) =>
              item.product_id === product.id && item.variant_id === variant?.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            newItems = [
              ...state.items,
              {
                id: `${product.id}-${variant?.id || 'default'}`,
                product_id: product.id,
                product_name: product.name,
                product_image: product.image_url,
                price: variant?.price || product.price,
                currency: product.currency,
                quantity,
                variant_id: variant?.id || null,
                variant_name: variant?.name || null,
              },
            ];
          }

          return {
            items: newItems,
            ...get().calculateTotals(newItems),
          };
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== itemId);
          return {
            items: newItems,
            ...get().calculateTotals(newItems),
          };
        });
      },

      /**
       * Update item quantity
       */
      updateQuantity: (itemId, quantity) => {
        set((state) => {
          let newItems;
          if (quantity <= 0) {
            newItems = state.items.filter((item) => item.id !== itemId);
          } else {
            newItems = state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            );
          }

          return {
            items: newItems,
            ...get().calculateTotals(newItems),
          };
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({
          items: [],
          totalPrice: 0,
          totalItems: 0,
        });
      },

      /**
       * Get cart summary
       */
      getCartSummary: () => {
        const state = get();
        const subtotal = state.totalPrice;
        const platformFee = Math.round((subtotal * 0.04) * 100) / 100;
        const total = subtotal + platformFee;

        return {
          subtotal,
          platformFee,
          total,
          itemCount: state.totalItems,
          itemsCount: state.items.length,
        };
      },

      /**
       * Calculate totals (helper function)
       */
      calculateTotals: (items) => {
        let totalPrice = 0;
        let totalItems = 0;

        items.forEach((item) => {
          totalPrice += item.price * item.quantity;
          totalItems += item.quantity;
        });

        return {
          totalPrice: Math.round(totalPrice * 100) / 100,
          totalItems,
        };
      },

      /**
       * Get items grouped by currency
       */
      getItemsByCurrency: () => {
        const state = get();
        const grouped = {};

        state.items.forEach((item) => {
          if (!grouped[item.currency]) {
            grouped[item.currency] = [];
          }
          grouped[item.currency].push(item);
        });

        return grouped;
      },

      /**
       * Check if item is in cart
       */
      isItemInCart: (productId, variantId = null) => {
        return get().items.some(
          (item) => item.product_id === productId && item.variant_id === variantId
        );
      },

      /**
       * Get item from cart
       */
      getItem: (itemId) => {
        return get().items.find((item) => item.id === itemId);
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
