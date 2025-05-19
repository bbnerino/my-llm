import { Request, Router } from "express";
import { VectorController } from "../controller/vector.controller";

const router = Router();

router.post("/search", async (req: Request, response: any) => {
  try {
    await VectorController.search(req, response);
  } catch (err) {
    response.status(500).json({ message: "Server error" });
  }
});

export default router;
