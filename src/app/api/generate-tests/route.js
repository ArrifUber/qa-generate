import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt(userStory, testCaseType, numberOfTests) {
  const typeInstructions = {
    comprehensive: "covering all scenarios: positive flows, negative flows, edge cases, boundary values, and security/validation checks",
    positive_negative: "focusing specifically on positive (happy path) and negative (failure path) scenarios",
    edge_cases: "focusing specifically on edge cases, boundary values, and unexpected/extreme inputs",
    security_validation: "focusing specifically on security vulnerabilities, input validation, authentication, authorization, and data integrity checks",
  };

  const instruction = typeInstructions[testCaseType] || typeInstructions.comprehensive;

  return `You are a senior QA automation engineer. Your task is to generate exactly ${numberOfTests} test case(s) ${instruction} based on the following user story or feature description.

USER STORY / FEATURE DESCRIPTION:
"""
${userStory}
"""

INSTRUCTIONS:
- Generate exactly ${numberOfTests} test case(s).
- Each test case must be ${instruction}.
- Return ONLY a valid JSON array. Do not include any markdown, code fences, or explanatory text outside the JSON.
- Each object in the array must have exactly these fields:
  {
    "id": "TC-001",
    "title": "Short descriptive title",
    "scenario": "One-sentence description of what is being tested",
    "preconditions": ["condition 1", "condition 2"],
    "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "testType": "Positive" | "Negative" | "Edge" | "Security",
    "expectedResult": "Clear description of the expected outcome"
  }
- Use IDs like TC-001, TC-002, etc.
- Make steps actionable and specific to the feature described.
- Preconditions should list required system state or data setup.

Return ONLY the JSON array, starting with [ and ending with ].`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userStory, testCaseType, numberOfTests } = body;

    // --- Input validation ---
    if (!userStory || typeof userStory !== "string" || userStory.trim().length < 10) {
      return Response.json(
        { error: "Please provide a valid user story with at least 10 characters." },
        { status: 400 }
      );
    }

    const validTypes = ["comprehensive", "positive_negative", "edge_cases", "security_validation"];
    if (!validTypes.includes(testCaseType)) {
      return Response.json(
        { error: "Invalid test case type selected." },
        { status: 400 }
      );
    }

    const count = parseInt(numberOfTests, 10);
    if (isNaN(count) || count < 1 || count > 20) {
      return Response.json(
        { error: "Number of test cases must be between 1 and 20." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Server configuration error: Gemini API key is not set." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = buildPrompt(userStory.trim(), testCaseType, count);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Strip markdown code fences if Gemini wraps the JSON
    const cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let testCases;
    try {
      testCases = JSON.parse(cleanText);
    } catch {
      console.error("Failed to parse Gemini response as JSON:", cleanText);
      return Response.json(
        { error: "The AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    if (!Array.isArray(testCases)) {
      return Response.json(
        { error: "The AI returned an unexpected data shape. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ testCases }, { status: 200 });
  } catch (error) {
    console.error("Generate test cases error:", error);

    const isTimeout =
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("deadline");

    return Response.json(
      {
        error: isTimeout
          ? "The request timed out. Please try again with a shorter description or fewer test cases."
          : "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
