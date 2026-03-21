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

  const cartItems = items.filter((item) => item.quantity > 0);

  const total = cartItems.reduce((sum, item) => {
    return sum + item.quantity * (item.price || 0);
  }, 0);

  // 🔹 1. Restaurant über slug laden
  useEffect(() => {
    fetch(`/api/restaurant?slug=${restaurantSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurantId(data.id);
      });
  }, [restaurantSlug]);

  // 🔹 2. Menü laden (wenn restaurantId da ist)
  useEffect(() => {
    if (!restaurantId) return;

    fetch(`/api/menu?restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(
          data.map((item: { id: number; name: string; price: number }) => ({
            ...item,
            quantity: 0,
          })),
        );
      });
  }, [restaurantId]);

  // 🔹 Menge ändern
  const updateQuantity = (id: number, delta: number) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    );
  };

  // 🔹 Bestellung abschicken
  const order = async () => {
    const filtered = items.filter((i) => i.quantity > 0);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurantId,
        tableId: Number(tableId),
        items: filtered.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
      }),
    });
    setItems(items.map((item) => ({ ...item, quantity: 0 })));

    alert("Bestellung gesendet");
  };

  return (
    <div className="app">
      <div className="container">
        {/*<div className="welcome">
          <h2>Welcome! Order from your table.</h2>
          <p>Scan once, order as you go.</p>
        </div> */}
        <div className="categories">
          <button className="active">All</button>
          <button>Coffee</button>
          <button>Cold Drinks</button>
          <button>Snacks</button>
        </div>
        <div className="menu">
          <h1>Menü</h1>

          {items.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="info">
                <h2>{item.name}</h2>
                <p>{item.price}€</p>
              </div>

              <div className="controls">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart">
          <h2>Warenkorb</h2>

          {cartItems.length === 0 ? (
            <p className="empty">Leer</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{item.quantity * item.price}€</span>
              </div>
            ))
          )}

          <div className="total">
            <span>Gesamt</span>
            <span>{total}€</span>
          </div>

          {cartItems.length > 0 && (
            <div className="floating-cart" onClick={order}>
              <span>
                {cartItems.length} items · {total}€
              </span>
              <span>Review order →</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
