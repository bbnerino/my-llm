import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import llmRouter from "./routes/llm.route";
import vectorRouter from "./routes/vector.route";
import embeddingRouter from "./routes/embedding.route";

// 환경변수 설정
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 라우터 설정
app.use("/api/llm", llmRouter);
app.use("/api/vector", vectorRouter);
app.use("/api/embedding", embeddingRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 실행중입니다." });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행중입니다.`);
});
