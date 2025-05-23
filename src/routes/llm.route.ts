import { Request, Router } from "express";
import { LLMController } from "../controller/llm.controller";
const router = Router();

router.post("/", async (req: Request, response: any) => {
  try {
    await LLMController.processChat(req, response);
  } catch (err) {
    response.status(500).json({ message: "Server error" });
  }
});

export default router;
