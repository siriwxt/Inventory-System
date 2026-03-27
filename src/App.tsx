import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

        {/* Navbar */}
        <div className="bg-gray-900/80 backdrop-blur border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">Inventory System</h1>

          <div className="space-x-6">
            <Link className="text-gray-300 hover:text-white" to="/">Dashboard</Link>
            <Link className="text-gray-300 hover:text-white" to="/products">Products</Link>
          </div>
        </div>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App