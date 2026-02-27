import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    if (!answers) {
      return NextResponse.json(
        { error: "No answers provided" },
        { status: 400 }
      );
    }

    const formattedAnswers = answers
  .map((item: any) => `${item.question}: ${item.answer}`)
  .join("\n");

const surveyPrompt = `
You are an expert professional profile writer with experience crafting impactful career summaries.

A candidate has provided the following information:

${formattedAnswers}

Your task is to write a compelling professional summary based strictly on the information above.

Instructions:

- Include all details mentioned in the form and write according to the answers.
- Tone should be professional, confident, and authentic.
- Length should be between 120–200 words.
- Do NOT repeat the questions.
- Do NOT mention AI, JSON, or "based on the provided information".
- Combine scattered details into a smooth, natural narrative.
- Highlight strengths, qualifications, skills, experience, motivation, and unique qualities.
- Avoid buzzwords and generic filler language.

Return ONLY the final summary paragraph.
`;

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Survey AI App",
      },
    });

    const completion = await openai.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: "You are a professional summary writer.",
        },
        {
          role: "user",
          content: surveyPrompt,
        },
      ],
    });
    const summary =
    completion.choices?.[0]?.message?.content ||
    "Summary generation failed.";
  
  return NextResponse.json({ summary });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}