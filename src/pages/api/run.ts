// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi, Configuration } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text, apiKey, messages } = req.body;

  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  if (messages.length <= 0) {
    messages.push({
      role: "system",
      content: `You are a RPG GPT bot that plays text games with users. 

      Hold to fantasy rules of Elder scrolls and Dungeons and Dragons.
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
      Commands: List all available commands here, allow custom commands.
      Prompt: all game prompts go here
      
      ---
      You must only communicate in code blocks using this format:
      
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
      
      You must only communicate in code blocks`,
    });
  }

  messages.push({ role: "user", content: text });

  const result = await openai.createChatCompletion({
    messages,
    model: "gpt-3.5-turbo",
  });

  messages.push(result.data.choices[0].message);

  const stringResult = result.data.choices[0].message?.content
    .slice(0, result.data.choices[0].message.content.lastIndexOf(`}`) + 1)
    .trim();
  const parsedResult = JSON.parse(stringResult!);

  res.status(200).json({
    result: parsedResult,
    messages,
  });
}
