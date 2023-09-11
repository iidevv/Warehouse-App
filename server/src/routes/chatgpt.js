import express from "express";
import { OpenAIApi } from "openai";
import { gptInstance } from "../instances/index.js";

const router = express.Router();

export const gpt4 = async (prompt) => {
  try {
    const openai = new OpenAIApi(gptInstance);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    return response.data.choices[0].message?.content.trim();
  } catch (error) {
    throw error;
  }
};

const MAX_LENGTH = 7000;

const trimDescription = (title, description, promptTemplateLength) => {
  const maxDescriptionLength = MAX_LENGTH - promptTemplateLength - title.length;
  return description.length > maxDescriptionLength
    ? description.substring(0, maxDescriptionLength) + "..."
    : description;
};

export const createSEOContent = async (title, description) => {
  const promptTemplate = `
    Product ${title} PLACEHOLDER_DESCRIPTION. Create:
    1. Comma-separated list of 4 search keywords (Don't use quotation marks),
    2. Comma-separated list of 4 meta keywords use DMG (Don't use quotation marks),
    3. Create meta description use Discount Moto Gear (Don't use quotation marks).
    4. Description use Discount Moto Gear (use html format, don't use title tags (h1,h2,h3 etc), if contains a list before list use list title: <p><strong>Features:</strong></p>)
    Response format JSON, example: {
      search_keywords: "",
      meta_keywords: "",
      meta_description: "",
      description: "",
    }
  `;

  const trimmedDescription = trimDescription(
    title,
    description,
    promptTemplate.length
  );
  const prompt = promptTemplate.replace(
    "PLACEHOLDER_DESCRIPTION",
    trimmedDescription
  );

  try {
    const gpt4Response = await gpt4(prompt);
    return JSON.parse(gpt4Response);
  } catch (error) {
    throw error;
  }
};

router.post("/create-seo", async (req, res) => {
  let { title, description } = req.body;
  try {
    const response = await createSEOContent(title, description);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as chatgptRouter };
