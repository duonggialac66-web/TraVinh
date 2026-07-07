import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  carts: Record<string, CartItem[]>
  activeUser: string
  isOpen: boolean
  setActiveUser: (userId: string) => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      carts: {},
      activeUser: 'guest',
      isOpen: false,
      setActiveUser: (userId) => set({ activeUser: userId }),
      addItem: (item) =>
        set((state) => {
          const currentItems = state.carts[state.activeUser] || []
          const existingItem = currentItems.find((i) => i.id === item.id)
          let newItems;
          if (existingItem) {
            newItems = currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          } else {
            newItems = [...currentItems, { ...item, quantity: 1 }]
          }
          return {
            carts: { ...state.carts, [state.activeUser]: newItems },
            isOpen: true,
          }
        }),
      removeItem: (id) =>
        set((state) => {
          const currentItems = state.carts[state.activeUser] || []
          return {
            carts: { ...state.carts, [state.activeUser]: currentItems.filter((i) => i.id !== id) },
          }
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const currentItems = state.carts[state.activeUser] || []
          return {
            carts: {
              ...state.carts,
              [state.activeUser]: currentItems.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
              ),
            },
          }
        }),
      clearCart: () =>
        set((state) => ({
          carts: { ...state.carts, [state.activeUser]: [] },
        })),
      setIsOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'tra-vinh-cart-v2', // Đổi tên để tránh conflict với bản cũ
    }
  )
)
