import { Request, Router } from "express";
import { LLMController } from "../controller/llm.controller";
const router = Router();

router.post("/login", async (req: Request, response: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return response
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const res = await LLMController.login(username, password);

    response.json({ message: "Login successful", token: "123" });
  } catch (err) {
    response.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req: Request, response: any) => {
  try {
    response.json({ message: "Users fetched successfully" });
  } catch (err) {
    response.status(500).json({ message: "Server error" });
  }
});

export default router;
