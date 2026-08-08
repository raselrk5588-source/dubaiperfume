import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../firebase';
import { ref, set, onValue, get, child } from 'firebase/database';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isStockOut?: boolean;
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
  customerName: string;
}

export interface AppNotification {
  id: string;
  phone: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  placeOrder: (address: string, phone: string, name?: string) => void;
  updateOrderStatus: (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addMultipleProducts: (products: Omit<Product, 'id'>[]) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string | number) => void;
  totalItems: number;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  notifications: AppNotification[];
  loginCustomer: (phone: string, password: string) => Promise<{success: boolean; message: string}>;
  registerCustomer: (name: string, phone: string, password: string) => Promise<{success: boolean; message: string}>;
  saveCustomerAddress: (address: string) => void;
  logoutCustomer: () => void;
  markNotificationsAsRead: () => void;
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [customerName, setCustomerName] = useState<string | null>(localStorage.getItem('customerName'));
  const [customerPhone, setCustomerPhone] = useState<string | null>(localStorage.getItem('customerPhone'));
  const [customerAddress, setCustomerAddress] = useState<string | null>(localStorage.getItem('customerAddress'));

  const loginCustomer = async (phone: string, password: string) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${phone}`));
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          localStorage.setItem('customerName', userData.name);
          localStorage.setItem('customerPhone', phone);
          setCustomerName(userData.name);
          setCustomerPhone(phone);
          return { success: true, message: 'Login successful' };
        } else {
          return { success: false, message: 'Invalid password' };
        }
      } else {
        return { success: false, message: 'User not found. Please sign up.' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const registerCustomer = async (name: string, phone: string, password: string) => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${phone}`));
      if (snapshot.exists()) {
        return { success: false, message: 'Phone number already registered. Please login.' };
      } else {
        const userData = { name, password, phone };
        await set(ref(db, `users/${phone}`), userData);
        
        localStorage.setItem('customerName', name);
        localStorage.setItem('customerPhone', phone);
        setCustomerName(name);
        setCustomerPhone(phone);
        return { success: true, message: 'Registration successful' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred during registration.' };
    }
  };

  const saveCustomerAddress = (address: string) => {
    localStorage.setItem('customerAddress', address);
    setCustomerAddress(address);
  };

  const logoutCustomer = () => {
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('customerAddress');
    setCustomerName(null);
    setCustomerPhone(null);
    setCustomerAddress(null);
  };

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

    // Notifications listener
    const notificationsRef = ref(db, 'notifications');
    const unsubNotifications = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notifsArray = Array.isArray(data) ? data.filter(Boolean) : Object.values(data) as AppNotification[];
        setNotifications(notifsArray);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubNotifications();
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

  const placeOrder = (address: string, phone: string, name?: string) => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toLocaleDateString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50,
      status: 'Processing',
      address,
      phone,
      customerName: name || customerName || 'Guest'
    };
    
    saveOrders([newOrder, ...orders]);
    setCart([]); // Clear cart after placing order
  };

  const updateOrderStatus = (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    const updatedOrders = orders.map(order => order.id === id ? { ...order, status } : order);
    saveOrders(updatedOrders);
    
    // Create a notification for the user
    const orderToUpdate = orders.find(o => o.id === id);
    if (orderToUpdate && orderToUpdate.phone) {
      const newNotif: AppNotification = {
        id: `NOTIF-${Math.floor(Math.random() * 100000)}`,
        phone: orderToUpdate.phone,
        title: 'Order Status Updated',
        message: `Your order ${id} is now ${status}.`,
        read: false,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      set(ref(db, 'notifications'), updatedNotifs);
    }
  };

  const markNotificationsAsRead = () => {
    if (!customerPhone) return;
    const updatedNotifs = notifications.map(n => 
      n.phone === customerPhone ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    set(ref(db, 'notifications'), updatedNotifs);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Date.now().toString();
    saveProducts([{ ...product, id: newId }, ...products]);
  };

  const addMultipleProducts = (newProducts: Omit<Product, 'id'>[]) => {
    const timestamp = Date.now();
    const productsToAdd = newProducts.map((p, index) => ({
      ...p,
      id: (timestamp + index).toString()
    }));
    saveProducts([...productsToAdd, ...products]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(p => p.id === String(id) ? { ...p, ...updates } : p);
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string | number) => {
    const updatedProducts = products.filter(p => p.id !== String(id));
    saveProducts(updatedProducts);
  };

  return (
    <CartContext.Provider value={{ 
      cart, orders, products, notifications,
      addToCart, removeFromCart, updateQuantity, placeOrder, updateOrderStatus, addProduct, addMultipleProducts, editProduct, deleteProduct,
      totalItems, customerName, customerPhone, customerAddress, loginCustomer, registerCustomer, saveCustomerAddress, logoutCustomer, markNotificationsAsRead
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
