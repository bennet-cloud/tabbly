"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  picture: string;
  quantity: number;
};

export default function Page() {
  const params = useParams();
  const restaurantSlug = params.restaurantSlug as string;
  const tableId = params.tableId as string;

  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🔹 Kategorien
  const categories = [
    "All",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];

  // 🔹 Filter
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  // 🔹 Warenkorb
  const cartItems = items.filter((i) => i.quantity > 0);
  const total = cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  // 🔹 Restaurant laden
  useEffect(() => {
    fetch(`/api/restaurant?slug=${restaurantSlug}`)
      .then((res) => res.json())
      .then((data) => setRestaurantId(data.id));
  }, [restaurantSlug]);

  // 🔹 Menü laden
  useEffect(() => {
    if (!restaurantId) return;

    fetch(`/api/menu?restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then((data) =>
        setItems(
          data.map(
            (item: {
              id: number;
              name: string;
              price: number;
              category: string;
              description: string;
              picture: string;
            }) => ({
              ...item,
              quantity: 0,
            }),
          ),
        ),
      );
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

  // 🔹 Bestellung
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
    <div className="app">
      <div className="container">
        <Menu
          items={filteredItems}
          updateQuantity={updateQuantity}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <Cart cartItems={cartItems} total={total} onOrder={order} />
      </div>

      {/* 🔥 Mobile Floating Cart 
      {cartItems.length > 0 && (
        <div className="floating-cart" onClick={order}>
          <span>
            {cartItems.length} items · {total}€
          </span>
          <span>Bestellen →</span>
        </div>
      )} */}
    </div>
  );
}

//
// 🔹 MENU
//

const Menu = ({
  items,
  updateQuantity,
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  items: MenuItem[];
  updateQuantity: (id: number, delta: number) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}) => {
  return (
    <div className="menu">
      <h1>Menü</h1>

      {/* Kategorien */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      {items.map((item) => (
        <div key={item.id} className="menu-item">
          <div className="info">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <span className="price">
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(item.price)}
            </span>
          </div>

          {/*{item.picture && <img src={item.picture} alt={item.name} />}*/}

          {/* Controls */}
          <div className="controls">
            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};

//
// 🔹 CART
//

const Cart = ({
  cartItems,
  total,
  onOrder,
}: {
  cartItems: MenuItem[];
  total: number;
  onOrder: () => void;
}) => {
  return (
    <div className="cart">
      <h2>Warenkorb</h2>

      {cartItems.length === 0 ? (
        <p className="empty">Leer</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <span>{item.name} x {item.quantity}
            </span>
            <span>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
              }).format(item.quantity * item.price)}
            </span>
          </div>
        ))
      )}

      <div className="total">
        <span>Gesamt</span>
        <span>
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(total)}
        </span>
      </div>

      <button
        onClick={onOrder}
        disabled={cartItems.length === 0}
        className="order-btn"
      >
        Bestellen
      </button>
    </div>
  );
};
