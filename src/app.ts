import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import llmRoutes from "./routes/llm.route";
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || "8080", 10);

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행중입니다.`);
});

// 기본 라우트
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "서버가 정상적으로 실행중입니다." });
});

app.use("/api/llm", llmRoutes);
