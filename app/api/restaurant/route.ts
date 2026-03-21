import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const result = await pool.query(
    "SELECT * FROM restaurants WHERE slug = $1",
    [slug]
  );

  return Response.json(result.rows[0]);
}