import { Request, Router } from "express";
import { EmbeddingController } from "../controller/embedding.controller";

const router = Router();

router.post("/create", async (req: Request, response: any) => {
  try {
    await EmbeddingController.createEmbedding(req, response);
  } catch (err) {
    response.status(500).json({ message: "Server error" });
  }
});

export default router;
