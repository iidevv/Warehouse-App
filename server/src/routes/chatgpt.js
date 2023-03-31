import express from "express";
import { OpenAIApi } from "openai";
import { gptInstance } from "../instances/index.js";

const router = express.Router();

router.get("/create-text", async (req, res) => {
  let input = req.query.s;
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: input,
      max_tokens: 100,
      temperature: 0,
    });
    console.log(response);
    res.json(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export { router as chatgptRouter };
