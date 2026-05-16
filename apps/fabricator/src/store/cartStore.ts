import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CatalogSlab, CatalogProduct, UnitOfMeasure } from '@sb/types';

interface CartSlab {
  slab: CatalogSlab;
  unitPrice: number;
}

interface CartProduct {
  product: CatalogProduct;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  unitPrice: number;
}

interface CartState {
  slabs: CartSlab[];
  products: CartProduct[];
  linkedJobId: string | null;
  addSlab: (slab: CatalogSlab) => void;
  removeSlab: (slabId: string) => void;
  addProduct: (product: CatalogProduct, quantity: number) => void;
  removeProduct: (variantId: string) => void;
  updateProductQty: (variantId: string, quantity: number) => void;
  setLinkedJob: (jobId: string | null) => void;
  clear: () => void;
  totalItems: () => number;
  totalValue: () => number;
  isSlabInCart: (slabId: string) => boolean;
  isProductInCart: (variantId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      slabs: [],
      products: [],
      linkedJobId: null,
      addSlab: (slab) => {
        if (get().slabs.some((s) => s.slab.id === slab.id)) return;
        set((state) => ({
          slabs: [...state.slabs, { slab, unitPrice: slab.listPrice || 0 }],
        }));
      },
      removeSlab: (slabId) =>
        set((state) => ({
          slabs: state.slabs.filter((s) => s.slab.id !== slabId),
        })),
      addProduct: (product, quantity) => {
        const existing = get().products.find((p) => p.product.variantId === product.variantId);
        if (existing) {
          get().updateProductQty(product.variantId, existing.quantity + quantity);
          return;
        }
        set((state) => ({
          products: [
            ...state.products,
            {
              product,
              quantity,
              unitOfMeasure: product.unitOfMeasure,
              unitPrice: product.basePrice || 0,
            },
          ],
        }));
      },
      removeProduct: (variantId) =>
        set((state) => ({
          products: state.products.filter((p) => p.product.variantId !== variantId),
        })),
      updateProductQty: (variantId, quantity) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.product.variantId === variantId ? { ...p, quantity } : p
          ),
        })),
      setLinkedJob: (jobId) => set({ linkedJobId: jobId }),
      clear: () => set({ slabs: [], products: [], linkedJobId: null }),
      totalItems: () => {
        const { slabs, products } = get();
        return slabs.length + products.reduce((sum, p) => sum + p.quantity, 0);
      },
      totalValue: () => {
        const { slabs, products } = get();
        return (
          slabs.reduce((sum, s) => sum + s.unitPrice, 0) +
          products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0)
        );
      },
      isSlabInCart: (slabId) => get().slabs.some((s) => s.slab.id === slabId),
      isProductInCart: (variantId) =>
        get().products.some((p) => p.product.variantId === variantId),
    }),
    {
      name: 'sb-fabricator-cart',
    }
  )
);
