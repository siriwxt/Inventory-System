import { useInventoryContext } from "../context/InventoryContext"

export default function Dashboard() {
  const { products } = useInventoryContext()

  const totalProducts = products.length

  const totalValue = products.reduce(
    (sum: number, p: any) => sum + p.price * p.quantity,
    0
  )

  const outOfStock = products.filter((p: any) => p.quantity === 0).length

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white text-black rounded-xl p-6 shadow-lg">
          <p className="text-gray-500">จำนวนสินค้า</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>

        <div className="bg-white text-black rounded-xl p-6 shadow-lg">
          <p className="text-gray-500">มูลค่ารวม</p>
          <p className="text-3xl font-bold">{totalValue} บาท</p>
        </div>

        <div className="bg-white text-black rounded-xl p-6 shadow-lg">
          <p className="text-gray-500">สินค้าหมด</p>
          <p className="text-3xl font-bold text-red-500">{outOfStock}</p>
        </div>
      </div>
    </div>
  )
}