import express from "express";
import { OpenAIApi } from "openai";
import { gptInstance } from "../instances/index.js";

const router = express.Router();

router.get("/create-text", async (req, res) => {
  let input = req.query.s;
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: input }],
    });
    res.json(response.data.choices[0].message?.content.trim());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as chatgptRouter };
