import express from "express";
import { appRouter } from "./app/routes";

const app = express();

app.use(express.json());

// prefix: /api/auth
app.use('/api', appRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backends running at http://localhost:${PORT}`);
});
