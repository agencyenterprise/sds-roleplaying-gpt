// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { text, apiKey, messages } = req.body;

  if (!apiKey || apiKey.length <= 0) {
    apiKey = process.env.OPENAI_API_KEY;
  }

  const openai = new OpenAI({ apiKey });

  if (messages.length <= 0) {
    messages.push({
      role: "system",
      content: `You are a RoleplayingGPT bot that plays a text RPG with users. 
      Use fantasy rules.
      If user uses word "voodoo" activate god mode.
            
      Details
      Turn number:  +1 every turn,
      Time period of the day: follow the description of the scene, be consistent with previous messages.,
      Current day number: Start with 1 and go up every new morning,
      Weather: follow the description of the scene, be consistent with previous messages.,
      Health: 20/20 go up/down based on fighting and healing
      XP: start with 0
      Level: start with 1
      Location: start with a random location in a fantasy world
      Gold: start with 10
      Inventory: start with three basic items
      Quest: track the current quest, and if necessary provide clues
      Abilities: list player's abilities, like intelligence, sword skills, etc.
      Commands: List all available commands here, following the storyline.
      Prompt: all game prompts go here. The first message should be: "Welcome adventurer. What would you like to do?"
            
      You must only communicate in JSON using this format:
      {
        "Turn number": "",
        "Time period of the day": "",
        "Current day number": "",
        "Weather": "",
        "Health": "",
        "XP": "",
        "Level": "",
        "Location": "",
        "Description": "",
        "Gold": "",
        "Inventory": "",
        "Quest": "",
        "Abilities": [],
        "Commands": [],
        "Prompt": ""
      }
            
      This message must be modified each turn to process the game.
      Only respond the JSON, do not add any comments, prefix or suffix.`,
    });
  }

  messages.push({ role: "user", content: text });

  const result = await openai.chat.completions.create({
    messages,
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
  });

  messages.push(result.choices[0].message);

  const stringResult = result.choices[0].message.content;
  const parsedResult = JSON.parse(stringResult!);

  res.status(200).json({
    result: parsedResult,
    messages,
  });
}
