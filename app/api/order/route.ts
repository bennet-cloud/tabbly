import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();

  const { restaurantId, tableId, items } = body;

  try {
    // 1. Order erstellen
    const orderRes = await pool.query(
      `INSERT INTO orders (restaurant_id, table_id)
       VALUES ($1, $2)
       RETURNING id`,
      [restaurantId, tableId]
    );

    const orderId = orderRes.rows[0].id;

    // 2. Items speichern
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, item.menuItemId, item.quantity]
      );
    }

    return Response.json({ success: true, orderId });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "DB Fehler" }, { status: 500 });
  }
}