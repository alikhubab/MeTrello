import { NextResponse } from "next/server";
import { OpenAI, ClientOptions } from "openai";

const configuration: ClientOptions = {
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export async function POST(request: Request) {
  const todos = await request.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user always as Mr Ali and say welcome to MeTrello Todo app. Limit the response to 200 characters.",
      },
      {
        role: "user",
        content: `Hi there. Provide a summary of the following todos. Count how many todos are in each category such as Todo, In Progress, and Done. Then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  const {
    choices: [firstChoice],
  } = response;

  console.log(firstChoice.message);
  return NextResponse.json(firstChoice.message);
}
