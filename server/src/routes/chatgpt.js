import express from "express";
import { OpenAIApi } from "openai";
import { gptInstance } from "../instances/index.js";

const router = express.Router();

router.get("/create-text", async (req, res) => {
  let input = req.query.text;
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: input,
      max_tokens: 100,
      temperature: 0,
    });
    const responseText = response.data;
    res.json({ text: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export { router as chatgptRouter };
