import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function (req, res) {
  const { rows } = await db.query("SELECT id, name, genre, location, plays FROM artists ORDER BY plays DESC, name ASC LIMIT 20");
  res.setHeader("Cache-Control", "no-store");
  res.json(rows);
}