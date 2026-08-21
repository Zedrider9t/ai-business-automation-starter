export type EnquiryCategory =
  | "website"
  | "mobile-app"
  | "software"
  | "ai-automation"
  | "marketing"
  | "branding-design"
  | "video-media"
  | "hosting-support"
  | "general";

export type EnquiryPriority = "normal" | "high";

export interface EnquiryInput {
  subject?: string;
  message: string;
}

export interface EnquiryRoutingResult {
  category: EnquiryCategory;
  priority: EnquiryPriority;
  queue: string;
  matchedTerms: string[];
  requiresHumanReview: boolean;
}

const rules: Array<{ category: EnquiryCategory; terms: string[]; queue: string }> = [
  { category: "ai-automation", terms: ["ai", "automation", "agent", "chatbot", "workflow", "n8n", "openai"], queue: "ai-automation" },
  { category: "mobile-app", terms: ["mobile app", "android app", "ios app", "flutter", "react native", "app store"], queue: "mobile-apps" },
  { category: "website", terms: ["website", "web app", "next.js", "nextjs", "wordpress", "shopify", "ecommerce", "e-commerce"], queue: "web-development" },
  { category: "software", terms: ["software", "crm", "erp", "dashboard", "portal", "saas"], queue: "software-development" },
  { category: "marketing", terms: ["seo", "digital marketing", "social media", "ads", "campaign"], queue: "digital-marketing" },
  { category: "branding-design", terms: ["branding", "logo", "graphic design", "ui/ux", "brochure", "identity"], queue: "creative-design" },
  { category: "video-media", terms: ["video editing", "motion graphics", "vfx", "animation", "reel", "promo video"], queue: "media-production" },
  { category: "hosting-support", terms: ["hosting", "server", "maintenance", "support", "domain", "deployment"], queue: "technical-support" },
];

const priorityTerms = ["urgent", "asap", "quote", "quotation", "proposal", "price", "cost", "hire", "start project", "demo"];

export function routeEnquiry(input: EnquiryInput): EnquiryRoutingResult {
  const text = `${input.subject ?? ""} ${input.message}`.toLowerCase();
  let bestMatch: { category: EnquiryCategory; queue: string; matchedTerms: string[] } | null = null;

  for (const rule of rules) {
    const matchedTerms = rule.terms.filter((term) => text.includes(term));
    if (matchedTerms.length > (bestMatch?.matchedTerms.length ?? 0)) {
      bestMatch = { category: rule.category, queue: rule.queue, matchedTerms };
    }
  }

  const category = bestMatch?.category ?? "general";
  const matchedTerms = bestMatch?.matchedTerms ?? [];

  return {
    category,
    queue: bestMatch?.queue ?? "general-enquiries",
    matchedTerms,
    priority: priorityTerms.some((term) => text.includes(term)) ? "high" : "normal",
    requiresHumanReview: category === "general",
  };
}
