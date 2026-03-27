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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">จัดการสินค้า</h1>

      {/* FORM */}
      <div className="bg-white text-black rounded-xl shadow-lg p-4 flex gap-3">
        <input className="border p-2 flex-1 rounded-lg"
          placeholder="ชื่อสินค้า"
          value={name}
          onChange={e => setName(e.target.value)} />

        <input className="border p-2 w-24 rounded-lg"
          type="number"
          placeholder="ราคา"
          onChange={e => setPrice(+e.target.value)} />

        <input className="border p-2 w-24 rounded-lg"
          type="number"
          placeholder="จำนวน"
          onChange={e => setQty(+e.target.value)} />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
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

      {/* SEARCH */}
      <input
        className="mt-6 border p-3 w-full rounded-lg text-black"
        placeholder="ค้นหาสินค้า..."
        onChange={e => setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="mt-6 grid gap-4">
        {filtered.map((p: any) => (
          <div
            key={p.id}
            className={`p-5 rounded-xl shadow-lg flex justify-between items-center ${
              p.quantity === 0
                ? "bg-red-50 border border-red-200 text-black"
                : "bg-white text-black"
            }`}
          >
            <div>
              <p className="font-bold text-lg">{p.name}</p>
              <p className="text-gray-500">{p.price} บาท</p>
              <p>คงเหลือ: {p.quantity}</p>

              {p.quantity === 0 && (
                <p className="text-red-500 font-semibold">สินค้าหมด</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                onClick={() => updateQuantity(p.id, 1)}
              >
                +
              </button>

              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                disabled={p.quantity === 0}
                onClick={() => updateQuantity(p.id, -1)}
              >
                -
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                onClick={() => deleteProduct(p.id)}
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}