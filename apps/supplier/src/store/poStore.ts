import { create } from 'zustand';
import type { PurchaseOrder } from '@sb/types';

interface POState {
  activePO: PurchaseOrder | null;
  isAcknowledging: boolean;
  isCountering: boolean;
  setActivePO: (po: PurchaseOrder | null) => void;
  setAcknowledging: (v: boolean) => void;
  setCountering: (v: boolean) => void;
}

export const usePOStore = create<POState>((set) => ({
  activePO: null,
  isAcknowledging: false,
  isCountering: false,
  setActivePO: (po) => set({ activePO: po }),
  setAcknowledging: (v) => set({ isAcknowledging: v }),
  setCountering: (v) => set({ isCountering: v }),
}));
