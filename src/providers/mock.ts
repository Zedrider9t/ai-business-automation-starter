import type {
  AICompletionRequest,
  AICompletionResult,
  AIProvider,
} from "./types.js";

export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  constructor(private readonly responseText = "Mock AI response") {}

  async complete(_request: AICompletionRequest): Promise<AICompletionResult> {
    return {
      text: this.responseText,
      model: "mock-model",
      provider: this.name,
    };
  }
}
