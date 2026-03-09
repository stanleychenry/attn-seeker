/**
 * Search intent: contact vs service vs content.
 * Used to inject contact result and/or boost service results.
 */

const CONTACT_PHRASES = [
  "contact",
  "get in touch",
  "get in contact",
  "talk to",
  "speak to",
  "reach out",
  "reach you",
  "email you",
  "call you",
  "message you",
  "hire you",
  "work with you",
  "get in touch with",
  "talk with",
  "speak with",
  "contact us",
  "contact you",
  "reach us",
  "hello",
  "say hi",
];

const SERVICE_PHRASES = [
  "service",
  "services",
  "what do you offer",
  "what do you do",
  "help with",
  "help me",
  "need help",
  "offer",
  "packages",
  "pricing",
  "work with us",
  "work with you",
  "hire",
  "agency",
];

const PERSON_PHRASES = [
  "who is",
  "who are",
  "team",
  "staff",
  "people",
  "person",
  "member",
  "founder",
  "ceo",
  "director",
];

const EVENT_PHRASES = [
  "event",
  "events",
  "upcoming",
  "what's on",
  "when is",
  "workshop",
  "webinar",
];

export type SearchIntent = "contact" | "service" | "person" | "event" | "content";

export function getIntentFromKeywords(query: string): SearchIntent | null {
  const lower = query.toLowerCase().trim();
  if (CONTACT_PHRASES.some((p) => lower.includes(p))) return "contact";
  if (SERVICE_PHRASES.some((p) => lower.includes(p))) return "service";
  if (PERSON_PHRASES.some((p) => lower.includes(p))) return "person";
  if (EVENT_PHRASES.some((p) => lower.includes(p))) return "event";
  return null;
}

/**
 * Call OpenAI to classify intent. Returns null if no key or on error.
 */
export async function getIntentFromLLM(query: string): Promise<SearchIntent | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !query.trim()) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You classify the user's search intent on a marketing agency website. Reply with exactly one word: contact, service, person, event, or content. contact = they want to get in touch, speak to someone, or reach the team. service = they want to know what the agency offers, pricing, or how to work with them. person = they are looking for a specific person, team member, or staff (e.g. 'who is Stanley'). event = they are looking for events, workshops, webinars, or what's on. content = articles, case studies, podcasts, shows, or general content.",
          },
          {
            role: "user",
            content: query.trim(),
          },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content?.trim().toLowerCase();
    if (content === "contact" || content === "service" || content === "person" || content === "event" || content === "content") {
      return content as SearchIntent;
    }
    return null;
  } catch (err) {
    console.error("[search-intent] LLM error:", err);
    return null;
  }
}

/**
 * Resolve intent: try LLM first if key present, then fall back to keywords.
 */
export async function resolveIntent(query: string): Promise<SearchIntent | null> {
  const llm = await getIntentFromLLM(query);
  if (llm) return llm;
  return getIntentFromKeywords(query);
}
