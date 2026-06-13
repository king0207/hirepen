import { getAIConfig, resolveAIModel } from "@/lib/env";
import type { UserPlan } from "@/lib/plans";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type StreamChatOptions = {
  plan?: UserPlan;
  temperature?: number;
  maxTokens?: number;
};

/**
 * Streams a chat completion from any OpenAI-compatible provider.
 * Returns a plain-text ReadableStream Response (token deltas).
 */
export async function streamChat(
  messages: ChatMessage[],
  options: StreamChatOptions = {},
): Promise<Response> {
  const config = getAIConfig();
  if (!config) {
    return new Response(
      JSON.stringify({
        error: "AI service is not configured. Set AI_API_KEY (and optional AI_BASE_URL / AI_MODEL).",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const model = resolveAIModel(options.plan) ?? config.model;
  const temperature = options.temperature ?? 0.55;
  const maxTokens = options.maxTokens ?? 1600;

  let upstream: Response;
  try {
    upstream = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature,
        max_tokens: maxTokens,
      }),
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Could not reach AI provider. Check AI_BASE_URL and network." }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!upstream.ok) {
    const detail = await upstream.text();
    return new Response(
      JSON.stringify({ error: "AI generation failed", detail }),
      { status: upstream.status, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!upstream.body) {
    return new Response(JSON.stringify({ error: "Empty AI response" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const chunk = parsed.choices?.[0]?.delta?.content;
              if (chunk) controller.enqueue(encoder.encode(chunk));
            } catch {
              // skip malformed SSE chunks
            }
          }
        }
      } catch (error) {
        controller.error(error);
        return;
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
