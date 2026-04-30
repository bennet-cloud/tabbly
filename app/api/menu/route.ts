import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId");

  const result = await pool.query(
    "SELECT restaurant_id, id, name, price, category FROM menu_items WHERE restaurant_id = $1",
    [restaurantId]
  );

  return Response.json(result.rows);
}