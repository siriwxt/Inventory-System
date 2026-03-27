import { createContext, useContext } from "react"
import { useInventory } from "../hooks/useInventory"

const InventoryContext = createContext<any>(null)

export function InventoryProvider({ children }: any) {
  const inventory = useInventory()
  return (
    <InventoryContext.Provider value={inventory}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventoryContext() {
  return useContext(InventoryContext)
}