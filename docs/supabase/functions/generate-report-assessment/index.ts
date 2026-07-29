import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VALID_SEVERITIES = ["Low", "Medium", "High", "Critical"];

// gemini-1.5-flash (previously used here) and gemini-2.0-flash have
// both been shut down by Google — every call returned 404, which is
// why AI Insight never populated. gemini-2.5-flash is reportedly
// throwing early 404s ahead of its own Oct 16 2026 shutdown date, so
// this uses gemini-3.5-flash: the current GA model with no announced
// shutdown date as of July 2026. If this starts 404ing later, check
// https://ai.google.dev/gemini-api/docs/deprecations for the current
// recommended replacement before assuming a code bug.
const GEMINI_MODEL = "gemini-3.5-flash";

interface AssessmentInput {
  category: string;
  title: string;
  description: string;
  ward?: string;
  lga?: string;
}

interface AssessmentResult {
  severity: string;
  risk_score: number;
  priority: string;
  impact: string;
  summary: string;
}

function buildPrompt(input: AssessmentInput): string {
  return `You are an environmental hazard assessment assistant for ECHO, a community environmental reporting platform in Nasarawa State, Nigeria.

A citizen has submitted this hazard report:
- Category: ${input.category}
- Title: ${input.title}
- Description: ${input.description}
- Location: ${input.ward || "unknown ward"}, ${input.lga || "unknown LGA"}

Assess this report and respond with ONLY a JSON object (no markdown, no code fences, no extra text) in exactly this shape:
{
  "severity": "Low" | "Medium" | "High" | "Critical",
  "risk_score": <number between 0 and 1>,
  "priority": "Low" | "Medium" | "High" | "Critical",
  "impact": "<one or two sentences on likely environmental/community impact>",
  "summary": "<a concise 2-3 sentence assessment combining severity reasoning and a recommended next action>"
}

Base your assessment only on the information given. Do not invent specific facts (exact numbers, dates, or locations) not present in the description.`;
}

/** Extracts the first valid JSON object from a model response, tolerating
 * markdown code fences or stray text the model sometimes adds despite
 * instructions not to. Returns null if nothing parseable is found. */
function extractJson(text: string): AssessmentResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (
      typeof parsed.severity === "string" &&
      VALID_SEVERITIES.includes(parsed.severity) &&
      typeof parsed.risk_score === "number" &&
      typeof parsed.priority === "string" &&
      typeof parsed.impact === "string" &&
      typeof parsed.summary === "string"
    ) {
      return {
        severity: parsed.severity,
        risk_score: Math.min(1, Math.max(0, parsed.risk_score)),
        priority: parsed.priority,
        impact: parsed.impact,
        summary: parsed.summary,
      };
    }
    return null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const input: AssessmentInput = await req.json();

    if (!input.category || !input.description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: category, description." }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: GEMINI_API_KEY is not set." }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 400 },
      }),
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      // Surfaces the real Gemini error (e.g. model retired, quota,
      // invalid key) in the function logs instead of masking it.
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gemini API error" }),
        { status: geminiRes.status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const result = extractJson(rawText);

    if (!result) {
      // Model responded but not in the expected shape — surface this as
      // an error rather than silently writing garbage into the report.
      // The caller falls back to the SQL heuristic already on the row.
      return new Response(
        JSON.stringify({ error: "Could not parse a valid assessment from the model response." }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ result, model: GEMINI_MODEL }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});

