import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class EmbeddingController {
  static async createEmbedding(req: Request, res: Response) {
    const { texts } = req.body;
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: "No texts provided" });
    }

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts,
      });
      const embeddings = response.data.map((item: any) => item.embedding);
      return res.json({ embeddings });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message || "Embedding error" });
    }
  }
}
