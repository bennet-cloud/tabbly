"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function Page() {
  const params = useParams();
  const restaurantSlug = params.restaurantSlug as string;
  const tableId = params.tableId as string;

  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);

  // 🔹 Derived state
  const cartItems = items.filter((i) => i.quantity > 0);
  const total = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  // 🔹 Load restaurant
  useEffect(() => {
    fetch(`/api/restaurant?slug=${restaurantSlug}`)
      .then((res) => res.json())
      .then((data) => setRestaurantId(data.id));
  }, [restaurantSlug]);

  // 🔹 Load menu
  useEffect(() => {
    if (!restaurantId) return;

    fetch(`/api/menu?restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then((data) =>
        setItems(
          data.map((item: { id: number; name: string; price: number }) => ({
            ...item,
            quantity: 0,
          })),
        ),
      );
  }, [restaurantId]);

  // 🔹 Quantity handler
  const updateQuantity = (id: number, delta: number) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    );
  };

  // 🔹 Order
  const order = async () => {
    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId,
        tableId: Number(tableId),
        items: cartItems.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      }),
    });

    setItems(items.map((i) => ({ ...i, quantity: 0 })));
  };

  return (
    <Layout>
      <Menu items={items} updateQuantity={updateQuantity} />
      <Cart cartItems={cartItems} total={total} onOrder={order} />
    </Layout>
  );

  function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    );
  }
  
  function Menu({
    items,
    updateQuantity,
  }: {
    items: MenuItem[];
    updateQuantity: (id: number, delta: number) => void;
  }) {
    return (
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Menü</h1>

        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500">{item.price}€</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  function Cart({
    cartItems,
    total,
    onOrder,
  }: {
    cartItems: MenuItem[];
    total: number;
    onOrder: () => void;
  }) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-4">Warenkorb</h2>

        {cartItems.length === 0 && <p className="text-gray-500">Leer</p>}

        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>{item.quantity * item.price}€</span>
          </div>
        ))}

        <div className="border-t mt-4 pt-4 font-bold">Gesamt: {total}€</div>

        <button
          onClick={onOrder}
          disabled={cartItems.length === 0}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl disabled:bg-gray-300"
        >
          Bestellen
        </button>
      </div>
    );
  }
}
