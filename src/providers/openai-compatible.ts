import type {
  AICompletionRequest,
  AICompletionResult,
  AIProvider,
} from "./types.js";

interface OpenAICompatibleProviderOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  providerName?: string;
}

interface ChatCompletionResponse {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

export class OpenAICompatibleProvider implements AIProvider {
  readonly name: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(options: OpenAICompatibleProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.baseUrl = (options.baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "");
    this.name = options.providerName ?? "openai-compatible";
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResult> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.2,
        ...(request.maxTokens ? { max_tokens: request.maxTokens } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`AI provider request failed (${response.status}): ${detail}`);
    }

    const payload = (await response.json()) as ChatCompletionResponse;
    const text = payload.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("AI provider returned an empty completion.");
    }

    return {
      text,
      model: payload.model ?? this.model,
      provider: this.name,
    };
  }
}
