import { useState } from 'react'
import ProductList from './components/ProductList.jsx'
import ResumenCarrito from './components/ResumenCarrito.jsx'

function App() {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.nombre,
          image: product.imagen,
          color: '',
          size: '',
          price: Number(product.precio),
          quantity: 1,
        },
      ]
    })
  }

  return showCart
    ? (
      <ResumenCarrito
        cartItems={cartItems}
        onCartItemsChange={setCartItems}
      />
    )
    : <ProductList onOpenCart={() => setShowCart(true)} onAddToCart={addToCart} />
}

export default App
