/* eslint-disable @typescript-eslint/no-unused-vars */
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function POST(request: Request) {
  try {
    const prompt =
      "Only give the result for the prompt and dont give any extra content .Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    const messagesArray = response.choices.map((choice) =>
      choice.message.content?.split("||").map((content) => ({ content }))
    );

    
    return Response.json(
      {
        success: true,
        messages: messagesArray.flat(),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      {
        status: 500,
      }
    );
  }
}
