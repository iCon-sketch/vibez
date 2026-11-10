import { db } from "hatchable";
export const access = "public";
export const methods = ["POST"];
export default async function (req, res) {
  const allowed = ["amara", "jay", "kezi", "mira"];
  const artistId = req.body && req.body.artist_id;
  if (!allowed.includes(artistId)) return res.status(400).json({ error: "Unknown artist." });
  const result = await db.query("UPDATE artists SET plays = plays + 1 WHERE id = $1 RETURNING plays", [artistId]);
  if (!result.rows.length) return res.status(404).json({ error: "Artist not found." });
  res.json({ ok: true, plays: result.rows[0].plays });
}