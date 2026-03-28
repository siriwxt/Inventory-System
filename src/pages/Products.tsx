import { useState } from "react"
import { useInventoryContext } from "../context/InventoryContext"

export default function Products() {
  const { products, addProduct, updateQuantity, deleteProduct } = useInventoryContext()

  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [qty, setQty] = useState(0)
  const [search, setSearch] = useState("")

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">📦 จัดการสินค้า</h1>
          <p className="text-gray-400">สินค้าทั้งหมด: <span className="text-blue-400 font-bold">{products.length}</span></p>
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
              type="number"
              placeholder="ราคา"
              onChange={e => setPrice(+e.target.value)} 
            />

            <input 
              className="sm:w-32 bg-gray-900 border-2 border-gray-600 focus:border-blue-500 p-3 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
              type="number"
              placeholder="จำนวน"
              onChange={e => setQty(+e.target.value)} 
            />

            <button
              className="sm:w-32 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              onClick={() => {
                if (!name || price <= 0) return
                addProduct(name, price, qty)
                setName("")
                setPrice(0)
                setQty(0)
              }}
            >
              เพิ่ม
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10">
          <input
            className="w-full bg-gray-900 border-2 border-gray-600 focus:border-green-500 p-4 rounded-xl text-white placeholder-gray-500 transition-all outline-none text-lg"
            placeholder="🔍 ค้นหาสินค้า..."
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
                  <th className="text-left text-white font-bold p-4 rounded-tl-lg">ชื่อสินค้า</th>
                  <th className="text-center text-white font-bold p-4">ราคา</th>
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
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.quantity === 0 ? "⛔" : "✅"}</span>
                        <span className="text-white font-semibold">{p.name}</span>
                      </div>
                      {p.quantity === 0 && (
                        <p className="text-red-400 text-sm mt-1">⚠️ สินค้าหมด</p>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-green-400 font-bold text-lg">{p.price} บาท</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold text-lg ${p.quantity === 0 ? "text-red-400" : "text-blue-400"}`}>
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
                          onClick={() => deleteProduct(p.id)}
                          title="ลบสินค้า"
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