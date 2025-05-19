import { Request, Response } from "express";

function l2Distance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));
}

function searchTopK(
  embeddings: number[][],
  queryEmbedding: number[],
  k: number
) {
  const distances = embeddings.map((emb) => l2Distance(queryEmbedding, emb));
  return distances
    .map((dist, idx) => ({ dist, idx }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k)
    .map((item) => ({ idx: item.idx, dist: item.dist }));
}

export class VectorController {
  static async search(req: Request, res: Response) {
    const { embeddings, queryEmbedding, k = 10 } = req.body;

    if (!embeddings || !Array.isArray(embeddings) || !queryEmbedding) {
      return res
        .status(400)
        .json({ error: "No embeddings or queryEmbedding provided" });
    }

    try {
      const topK = searchTopK(embeddings, queryEmbedding, k);
      return res.json({
        topKIndices: topK.map((item) => item.idx),
        topKDistances: topK.map((item) => item.dist),
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Search error" });
    }
  }
}
