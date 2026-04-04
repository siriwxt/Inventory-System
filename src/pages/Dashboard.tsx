import { useInventoryContext } from "../context/InventoryContext"

export default function Dashboard() {
  const { products } = useInventoryContext()

  const totalProducts = products.length

  const totalStock = products.reduce(
    (sum: number, p: any) => sum + (p.quantity ?? 0),
    0
  )

  const outOfStock = products.filter((p: any) => p.quantity === 0).length
  
  const inStock = totalProducts - outOfStock

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">📊 Dashboard</h1>
          <p className="text-gray-400">ตรวจสอบข้อมูลสรุประบบคลังสินค้า</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 shadow-2xl border border-blue-600 hover:border-blue-400 transition-all hover:shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-2">จำนวนสินค้า</p>
                <p className="text-4xl font-bold text-white">{totalProducts}</p>
                <p className="text-blue-400 text-xs mt-2">รายการ</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* In Stock */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-2xl p-8 shadow-2xl border border-green-600 hover:border-green-400 transition-all hover:shadow-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-semibold mb-2">สินค้าคงมี</p>
                <p className="text-4xl font-bold text-white">{inStock}</p>
                <p className="text-green-400 text-xs mt-2">พร้อมจำหน่าย</p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-8 shadow-2xl border border-red-600 hover:border-red-400 transition-all hover:shadow-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-semibold mb-2">สินค้าหมด</p>
                <p className="text-4xl font-bold text-white">{outOfStock}</p>
                <p className="text-red-400 text-xs mt-2">ต้องสั่งซื้อเพิ่ม</p>
              </div>
              <div className="text-5xl">⛔</div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl p-8 shadow-2xl border border-purple-600 hover:border-purple-400 transition-all hover:shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold mb-2">สต็อกรวม</p>
                <p className="text-3xl font-bold text-white">{totalStock.toLocaleString()}</p>
                <p className="text-purple-400 text-xs mt-2">หน่วย</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-600">
          <h2 className="text-2xl font-bold text-white mb-6">📈 สรุปสถานการณ์</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stock Status */}
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-600">
              <p className="text-gray-400 text-sm mb-4">สถานะสินค้า</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">🟢 ยังมีสินค้า</span>
                  <span className="text-green-400 font-bold text-lg">{inStock} รายการ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">🔴 สินค้าหมด</span>
                  <span className="text-red-400 font-bold text-lg">{outOfStock} รายการ</span>
                </div>
                {totalProducts > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all"
                        style={{ width: `${(inStock / totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 text-center">
                      {((inStock / totalProducts) * 100).toFixed(1)}% ของสินค้าคงมี
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-600">
              <p className="text-gray-400 text-sm mb-4">สรุปตัวเลข</p>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">สต็อกรวมทั้งหมด</p>
                  <p className="text-3xl font-bold text-purple-400">{totalStock.toLocaleString()} หน่วย</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">เฉลี่ยต่อรายการ</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {totalProducts > 0 ? Math.round(totalStock / totalProducts).toLocaleString() : 0} หน่วย
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}