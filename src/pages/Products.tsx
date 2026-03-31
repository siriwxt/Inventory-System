import { useState } from "react"
import { useInventoryContext } from "../context/InventoryContext"

export default function Products() {
  const { products, addProduct, updateQuantity, deleteProduct, loading } = useInventoryContext()

  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [zone, setZone] = useState("")
  const [search, setSearch] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddProduct = async () => {
    if (!name.trim() || !sku.trim() || !zone.trim()) {
      alert("กรุณากรอกชื่อสินค้า รหัส และโซนให้ครบถ้วน")
      return
    }

    setIsAdding(true)
    await addProduct(name, sku, zone) // quantity default 0
    setName("")
    setSku("")
    setZone("")
    setIsAdding(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">📦 จัดการสินค้า</h1>
          <p className="text-gray-400">สินค้าทั้งหมด: <span className="text-blue-400 font-bold">{products.length}</span></p>
          {loading && <p className="text-yellow-400 text-sm">กำลังโหลดข้อมูล...</p>}
        </div>

        {/* FORM */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 mb-10 border border-gray-600">
          <h2 className="text-xl font-bold text-white mb-6">➕ เพิ่มสินค้าใหม่</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              className="flex-1 bg-gray-900 border-2 border-gray-600 focus:border-blue-500 p-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={e => setName(e.target.value)} 
            />

            <input 
              className="sm:w-32 bg-gray-900 border-2 border-gray-600 focus:border-blue-500 p-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
              placeholder="รหัส (SKU)"
              value={sku}
              onChange={e => setSku(e.target.value)} 
            />

            <input 
              className="sm:w-32 bg-gray-900 border-2 border-gray-600 focus:border-blue-500 p-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
              placeholder="โซน"
              value={zone}
              onChange={e => setZone(e.target.value)} 
            />

            <button
              className="sm:w-32 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50"
              disabled={isAdding}
              onClick={handleAddProduct}
            >
              {isAdding ? "กำลัง..." : "เพิ่ม"}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10">
          <input
            className="w-full bg-gray-900 border-2 border-gray-600 focus:border-green-500 p-4 rounded-xl text-white placeholder-gray-500 transition-all outline-none text-lg"
            placeholder="🔍 ค้นหาสินค้า (ชื่อ หรือ รหัส)..."
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">ไม่พบสินค้า</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 border-b-2 border-blue-400">
                  <th className="text-left text-white font-bold p-4 rounded-tl-lg">ชื่อสินค้า / รหัส</th>
                  <th className="text-center text-white font-bold p-4">โซน</th>
                  <th className="text-center text-white font-bold p-4">คงเหลือ</th>
                  <th className="text-center text-white font-bold p-4 rounded-tr-lg">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: any) => (
                  <tr
                    key={p.id}
                    className={`border-b transition-all hover:bg-opacity-80 ${
                      p.quantity === 0
                        ? "bg-red-900/30 border-red-500/50 hover:bg-red-900/50"
                        : p.quantity <= 10
                        ? "bg-yellow-900/30 border-yellow-500/50 hover:bg-yellow-900/50"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.quantity === 0 ? "⛔" : p.quantity <= 10 ? "⚠️" : "✅"}</span>
                        <div>
                          <span className="text-white font-semibold">{p.name}</span>
                          <p className="text-gray-400 text-sm">รหัส: {p.sku}</p>
                        </div>
                      </div>
                      {p.quantity === 0 && (
                        <p className="text-red-400 text-sm mt-1">⛔ สินค้าหมด</p>
                      )}
                      {p.quantity <= 10 && p.quantity > 0 && (
                        <p className="text-yellow-400 text-sm mt-1">⚠️ ใกล้หมดสต็อก</p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-purple-400 font-semibold">{p.zone}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold text-lg ${p.quantity === 0 ? "text-red-400" : p.quantity <= 10 ? "text-yellow-400" : "text-blue-400"}`}>
                        {p.quantity} หน่วย
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold w-10 h-10 rounded-lg transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                          onClick={() => updateQuantity(p.id, 1)}
                          title="เพิ่มจำนวน"
                        >
                          ➕
                        </button>

                        <button
                          className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white font-bold w-10 h-10 rounded-lg transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          disabled={p.quantity === 0}
                          onClick={() => updateQuantity(p.id, -1)}
                          title="ลดจำนวน"
                        >
                          ➖
                        </button>

                        <button
                          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold w-10 h-10 rounded-lg transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                          onClick={() => {
                            if (p.quantity > 0) {
                              alert("ต้องลดจำนวนให้เป็น 0 ก่อนจึงจะลบสินค้าได้")
                              return
                            }
                            deleteProduct(p.id)
                          }}
                          title={p.quantity > 0 ? "ต้องลดจำนวนเป็น 0 ก่อน" : "ลบสินค้า"}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}