import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../firebase';
import { ref, set, onValue } from 'firebase/database';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  address: string;
  phone: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  placeOrder: (address: string, phone: string) => void;
  updateOrderStatus: (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Default data
const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Oud Majestic', brand: 'Dubai Luxury', price: 1250, image: '/perfume1.png', rating: 4.9, isNew: true },
  { id: '2', name: 'Midnight Velvet', brand: 'Arabian Nights', price: 850, originalPrice: 1100, image: '/perfume2.png', rating: 4.8 },
  { id: '3', name: 'Desert Gold', brand: 'Royal Essence', price: 1400, image: '/perfume1.png', rating: 5.0 },
  { id: '4', name: 'Saffron Whisper', brand: 'Dubai Luxury', price: 950, originalPrice: 1200, image: '/perfume2.png', rating: 4.7 }
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Listen to Firebase for real-time data
  useEffect(() => {
    // Products listener
    const productsRef = ref(db, 'products');
    const unsubProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // data could be an object keyed by id or an array
        const productsArray = Array.isArray(data) ? data.filter(Boolean) : Object.values(data) as Product[];
        setProducts(productsArray);
      } else {
        // First time - push default products to Firebase
        set(productsRef, DEFAULT_PRODUCTS);
      }
    });

    // Orders listener
    const ordersRef = ref(db, 'orders');
    const unsubOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Array.isArray(data) ? data.filter(Boolean) : Object.values(data) as Order[];
        setOrders(ordersArray);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Save products to Firebase
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    set(ref(db, 'products'), newProducts);
  };

  // Save orders to Firebase
  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    set(ref(db, 'orders'), newOrders);
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => prevCart.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (address: string, phone: string) => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50,
      status: 'Processing',
      address,
      phone
    };
    
    saveOrders([newOrder, ...orders]);
    setCart([]); // Clear cart after placing order
  };

  const updateOrderStatus = (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    const updated = orders.map(order => order.id === id ? { ...order, status } : order);
    saveOrders(updated);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Date.now().toString();
    saveProducts([{ ...product, id: newId }, ...products]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    saveProducts(updated);
  };

  return (
    <CartContext.Provider value={{ 
      cart, orders, products, 
      addToCart, removeFromCart, updateQuantity, placeOrder, updateOrderStatus, addProduct, editProduct, 
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
