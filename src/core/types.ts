export type LeadTemperature = "cold" | "warm" | "hot";

export interface LeadInput {
  name: string;
  company?: string;
  email?: string;
  budget?: number;
  timelineDays?: number;
  message: string;
}

export interface LeadQualificationResult {
  score: number;
  temperature: LeadTemperature;
  reasons: string[];
  recommendedAction: "nurture" | "follow-up" | "priority-call";
}

export interface AiProvider {
  generateStructured<T>(input: {
    system: string;
    prompt: string;
    schemaName: string;
  }): Promise<T>;
}
